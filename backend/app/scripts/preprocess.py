import joblib
import pandas as pd
from pathlib import Path
from typing import Optional

MODEL_DIR: Path = Path(__file__).parent.parent / "models"

PREPROCESSOR_PATH: str = str(MODEL_DIR / "scaler.pkl")

_scaler: Optional[object] = None


def _get_scaler():
    """Lazy load the scaler on first use"""
    global _scaler
    if _scaler is None:
        try:
            _scaler = joblib.load(PREPROCESSOR_PATH)
        except Exception as e:
            raise RuntimeError(
                f"Failed to load scaler from {PREPROCESSOR_PATH}: {e}"
            ) from e
    return _scaler


NUM_FEATURES = [
    "Total_units_approved",
    "Average_grade",
    "Age_at_enrollment",
    "Total_units_evaluated",
    "Total_units_enrolled",
    "Previous_qualification_(grade)",
]
BINARY_FEATURES = ["Tuition_fees_up_to_date", "Scholarship_holder", "Debtor", "Gender"]


def preprocess_input(user_input: dict) -> pd.DataFrame:
    """
    Transforms user-friendly input into a format suitable for the model.

    Mapping from user input ranges to original dataset ranges:
    - Average grade: 0-100 (percentage) → 0-18 (dataset range)
    - Units evaluated: 0-20 (user input) → 0-45 (dataset range)
    - Units approved: 0-20 (user input) → 0-43 (dataset range)
    - Units enrolled: 0-20 (user input) → 0-26 (dataset range)
    - Age: 17-70 (stays as is)
    - Previous qualification: 0-100 (percentage) → 0-190 (dataset range)
    """

    def percentage_to_dataset_range(
        percentage_value, max_user_range=100.0, max_dataset_range=18.0
    ):
        """
        Convert percentage from user range to dataset range.
        Formula: (percentage / max_user_range) * max_dataset_range

        Args:
            percentage_value: The percentage value from user input
            max_user_range: Maximum value in user input range (default: 100.0 for percentages)
            max_dataset_range: Maximum value in dataset range (default: 18.0 for average grade)
        """
        try:
            percentage = float(percentage_value)
            return (percentage / max_user_range) * max_dataset_range
        except (ValueError, TypeError):
            return max_dataset_range / 2.0  # Default to middle of range

    def units_to_dataset_range(units_value, max_user_range, max_dataset_range):
        """
        Convert units from user range to dataset range.
        Formula: (units / max_user_range) * max_dataset_range
        """
        try:
            units = float(units_value)
            return (units / max_user_range) * max_dataset_range
        except (ValueError, TypeError):
            return 0.0

    processed_input = {
        "Total_units_approved": units_to_dataset_range(
            user_input.get(
                "total_units_approved", user_input.get("Total_units_approved", 0)
            ),
            max_user_range=20.0,
            max_dataset_range=23.0,
        ),
        "Average_grade": percentage_to_dataset_range(
            user_input.get("average_grade", user_input.get("Average_grade", 50)),
            max_user_range=100.0,
            max_dataset_range=18.0,
        ),
        "Age_at_enrollment": user_input.get(
            "age_at_enrollment", user_input.get("Age_at_enrollment", 20)
        ),
        "Total_units_evaluated": units_to_dataset_range(
            user_input.get(
                "total_units_evaluated", user_input.get("Total_units_evaluated", 0)
            ),
            max_user_range=20.0,
            max_dataset_range=33.0,
        ),
        "Total_units_enrolled": units_to_dataset_range(
            user_input.get(
                "total_units_enrolled", user_input.get("Total_units_enrolled", 0)
            ),
            max_user_range=20.0,
            max_dataset_range=23.0,
        ),
        "Previous_qualification_(grade)": percentage_to_dataset_range(
            user_input.get(
                "previous_qualification_grade",
                user_input.get("Previous_qualification_(grade)", 70),
            ),
            max_user_range=100.0,
            max_dataset_range=190.0,
        ),
    }
    processed_input["Tuition_fees_up_to_date"] = int(
        user_input.get(
            "tuition_fees_up_to_date", user_input.get("Tuition_fees_up_to_date", 0)
        )
    )
    processed_input["Scholarship_holder"] = int(
        user_input.get("scholarship_holder", user_input.get("Scholarship_holder", 0))
    )
    processed_input["Debtor"] = int(
        user_input.get("debtor", user_input.get("Debtor", 0))
    )
    processed_input["Gender"] = int(
        user_input.get("gender", user_input.get("Gender", 0))
    )

    input_df = pd.DataFrame([processed_input])

    scaler = _get_scaler()
    input_df[NUM_FEATURES] = scaler.transform(input_df[NUM_FEATURES])

    all_features = NUM_FEATURES + BINARY_FEATURES
    input_df = input_df[all_features]

    return input_df

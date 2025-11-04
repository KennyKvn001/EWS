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
            raise RuntimeError(f"Failed to load scaler from {PREPROCESSOR_PATH}: {e}") from e
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

    Input format:
    - Grades (average_grade, previous_qualification_grade): percentage 0-100
    - Units (approved, evaluated, enrolled): 0-20 scale  
    - Age: actual age
    - Binary features: User-friendly inputs converted to 0/1 internally
      - Gender: 'male'/'female', 'm'/'f', or 1/0 → converted to 1/0
      - Tuition_fees_up_to_date: true/false, 'yes'/'no', or 1/0 → converted to 1/0
      - Scholarship_holder: true/false, 'yes'/'no', or 1/0 → converted to 1/0
      - Debtor: true/false, 'yes'/'no', or 1/0 → converted to 1/0

    Returns:
    - DataFrame with properly scaled features matching training data
    """

    def percentage_to_model_scale(percentage_value, feature_type):
        """
        Convert percentage (0-100) to the scale used in training data.
        
        For average_grade: Convert percentage to 0-20 scale (percentage/5)
        For previous_qualification: Convert percentage to Portuguese scale (percentage*1.0 + 100)
        """
        try:
            percentage = float(percentage_value)
        except (ValueError, TypeError):
            return 10.0 if feature_type == "average" else 140.0  # Default values
            
        if feature_type == "average":
            # Convert 0-100 percentage to 0-20 scale
            return percentage / 5.0
        elif feature_type == "previous_qualification":
            # Convert 0-100 percentage to Portuguese scale (100-200)
            return percentage + 100.0
        else:
            return percentage

    def scale_units(value):
        """
        Units are already in 0-20 scale, just ensure they're valid floats.
        """
        try:
            return float(value)
        except (ValueError, TypeError):
            return 0.0

    processed_input = {
        "Total_units_approved": scale_units(
            user_input.get("total_units_approved", user_input.get("Total_units_approved", 0))
        ),
        "Average_grade": percentage_to_model_scale(
            user_input.get("average_grade", user_input.get("Average_grade", 50)), 
            "average"
        ),
        "Age_at_enrollment": user_input.get(
            "age_at_enrollment", user_input.get("Age_at_enrollment", 20)
        ),
        "Total_units_evaluated": scale_units(
            user_input.get("total_units_evaluated", user_input.get("Total_units_evaluated", 0))
        ),
        "Total_units_enrolled": scale_units(
            user_input.get("total_units_enrolled", user_input.get("Total_units_enrolled", 0))
        ),
        "Previous_qualification_(grade)": percentage_to_model_scale(
            user_input.get(
                "previous_qualification_grade",
                user_input.get("Previous_qualification_(grade)", 70)
            ),
            "previous_qualification"
        ),
    }

    # Binary features - converted to 0/1 by Pydantic validators, just ensure they're integers
    processed_input["Tuition_fees_up_to_date"] = int(
        user_input.get("tuition_fees_up_to_date", user_input.get("Tuition_fees_up_to_date", 0))
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

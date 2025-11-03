import joblib
import pandas as pd
from pathlib import Path

MODEL_DIR: Path = Path(__file__).parent.parent / "models"

PREPROCESSOR_PATH: str = str(MODEL_DIR / "scaler.pkl")

scaler = joblib.load(PREPROCESSOR_PATH)

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

    Accepts:
    - Raw numerical values (will be scaled automatically)
    - Gender as string ("male" or "female") - converts to 1/0
    - Binary features as booleans - converts to 1/0

    Returns:
    - DataFrame with scaled numerical features and binary encoded features
    """
    # Map user-friendly input to model feature names
    processed_input = {
        "Total_units_approved": user_input.get(
            "total_units_approved", user_input.get("Total_units_approved", 0)
        ),
        "Average_grade": user_input.get(
            "average_grade", user_input.get("Average_grade", 0)
        ),
        "Age_at_enrollment": user_input.get(
            "age_at_enrollment", user_input.get("Age_at_enrollment", 0)
        ),
        "Total_units_evaluated": user_input.get(
            "total_units_evaluated", user_input.get("Total_units_evaluated", 0)
        ),
        "Total_units_enrolled": user_input.get(
            "total_units_enrolled", user_input.get("Total_units_enrolled", 0)
        ),
        "Previous_qualification_(grade)": user_input.get(
            "previous_qualification_grade",
            user_input.get("Previous_qualification_(grade)", 0),
        ),
    }

    # Convert boolean binary features to int (1 for True/Yes, 0 for False/No)
    processed_input["Tuition_fees_up_to_date"] = int(
        user_input.get(
            "tuition_fees_up_to_date", user_input.get("Tuition_fees_up_to_date", False)
        )
    )
    processed_input["Scholarship_holder"] = int(
        user_input.get(
            "scholarship_holder", user_input.get("Scholarship_holder", False)
        )
    )
    processed_input["Debtor"] = int(
        user_input.get("debtor", user_input.get("Debtor", False))
    )

    # Convert Gender string to int (male=1, female=0)
    gender = user_input.get("gender", user_input.get("Gender", "female"))
    if isinstance(gender, str):
        gender_lower = gender.lower()
        processed_input["Gender"] = 1 if gender_lower == "male" else 0
    else:
        # If already int, use as is
        processed_input["Gender"] = int(gender)

    # Convert to DataFrame
    input_df = pd.DataFrame([processed_input])

    # Scale numerical features
    input_df[NUM_FEATURES] = scaler.transform(input_df[NUM_FEATURES])

    # Select features in correct order
    all_features = NUM_FEATURES + BINARY_FEATURES
    input_df = input_df[all_features]

    return input_df

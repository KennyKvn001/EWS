import shap
import joblib
import numpy as np
from pathlib import Path
from tensorflow import keras
from .prediction import predict
from .preprocess import preprocess_input

MODEL_DIR: Path = Path(__file__).parent.parent / "models"

MODEL_PATH = str(MODEL_DIR / "nn_b_model.pkl")
BACKGROUND_PATH = str(MODEL_DIR / "background_data.pkl")

_model = None
_explainer = None

def _load_resources():
    global _model, _explainer

    if _model is None:
        _model = joblib.load(MODEL_PATH)

    if _explainer is None:
        background = joblib.load(BACKGROUND_PATH)
        _explainer = shap.KernelExplainer(_model.predict, background)

def explain_instance(input_data: np.ndarray):
    """
    Compute SHAP values for a single input instance
    """
    _load_resources()
    shap_values = _explainer.shap_values(input_data)
    return shap_values

def predict_with_explanation(user_input: dict) -> dict:
    """
    Returns model prediction with SHAP explanations for a single input.
    """
    pred = predict(user_input)

    x_input_df = preprocess_input(user_input)
    x_input = x_input_df.values

    shap_values = explain_instance(x_input)

    feature_names = [
        "Total Units Approved",
        "Average Grade (scaled)",
        "Age at Enrollment", 
        "Total Units Evaluated",
        "Total Units Enrolled",
        "Previous Qualification Grade (scaled)",
        "Tuition Fees Up to Date",
        "Scholarship Holder",
        "Debtor",
        "Gender"
    ]
    
    # Create readable explanation
    feature_explanations = []
    original_values = list(user_input.values())
    preprocessed_values = x_input[0]
    
    for i, feature_name in enumerate(feature_names):
        dropout_impact = shap_values[0][i][0]
        graduate_impact = shap_values[0][i][1]
        
        feature_explanations.append({
            "feature": feature_name,
            "original_value": original_values[i],
            "preprocessed_value": round(preprocessed_values[i], 4),
            "dropout_impact": round(dropout_impact, 4),
            "graduate_impact": round(graduate_impact, 4),
            "interpretation": "Increases dropout risk" if dropout_impact > 0 else "Decreases dropout risk" if dropout_impact < 0 else "Neutral impact"
        })
    
    # Sort by absolute impact
    feature_explanations.sort(key=lambda x: abs(x["dropout_impact"]), reverse=True)

    return {
        "prediction": pred,
        "explanation": {
            "feature_impacts": feature_explanations,
            "summary": {
                "most_influential_feature": feature_explanations[0]["feature"],
                "strongest_dropout_factor": max(feature_explanations, key=lambda x: x["dropout_impact"])["feature"] if any(f["dropout_impact"] > 0 for f in feature_explanations) else "None",
                "strongest_protective_factor": min(feature_explanations, key=lambda x: x["dropout_impact"])["feature"] if any(f["dropout_impact"] < 0 for f in feature_explanations) else "None"
            }
        }
    }
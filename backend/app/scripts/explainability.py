import shap
import joblib
import numpy as np
from pathlib import Path
from tensorflow import keras

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
import joblib
import numpy as np
from .preprocess import preprocess_input
from pathlib import Path
from typing import Optional

MODEL_DIR: Path = Path(__file__).parent.parent / "models"

MODEL_PATH: str = str(MODEL_DIR / "nn_b_model.pkl")

_model: Optional[object] = None


def _get_model():
    """Lazy load the model on first use"""
    global _model
    if _model is None:
        try:
            import tensorflow as tf

            _model = joblib.load(MODEL_PATH)
        except Exception as e:
            raise RuntimeError(f"Failed to load model from {MODEL_PATH}: {e}") from e
    return _model


def predict(user_input: dict) -> dict:
    """
    Returns model prediction for a single input along with probability.
    Keras model outputs probabilities for each class (softmax output).

    Prediction labels:
    - 0: Dropout
    - 1: Graduate
    """
    model = _get_model()
    X_input = preprocess_input(user_input)

    y_proba = model.predict(X_input, verbose=0)[0]

    y_pred = int(np.argmax(y_proba))

    label = "Graduate" if y_pred == 1 else "Dropout"

    dropout_prob = float(y_proba[0])

    if dropout_prob >= 0.75:
        risk_category = "high"
    elif dropout_prob <= 0.50:
        risk_category = "low"
    else:
        risk_category = "medium"

    return {
        "prediction": y_pred,
        "label": label,
        "probability": {"dropout": dropout_prob, "graduate": float(y_proba[1])},
        "risk_category": risk_category,
    }

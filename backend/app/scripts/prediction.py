import joblib
import numpy as np
from .preprocess import preprocess_input
from pathlib import Path
from typing import Optional

MODEL_DIR: Path = Path(__file__).parent.parent / "models"

MODEL_PATH: str = str(MODEL_DIR / "nn_b_model.pkl")

# Lazy load model - only load when first needed
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

    # Get probabilities for each class
    y_proba = model.predict(X_input, verbose=0)[0]

    # Get predicted class (0 = Dropout, 1 = Graduate)
    y_pred = int(np.argmax(y_proba))

    # Map to user-friendly labels
    label = "Graduate" if y_pred == 1 else "Dropout"

    # Calculate risk category based on dropout probability
    dropout_prob = float(y_proba[0])

    # Risk categories:
    # - High: dropout probability >= 0.65 (high risk of dropping out)
    # - Medium: dropout probability between 0.35 and 0.65
    # - Low: dropout probability <= 0.35 (low risk, likely to graduate)
    if dropout_prob >= 0.65:
        risk_category = "high"
    elif dropout_prob <= 0.35:
        risk_category = "low"
    else:
        risk_category = "medium"

    return {
        "prediction": y_pred,
        "label": label,
        "probability": {"dropout": dropout_prob, "graduate": float(y_proba[1])},
        "risk_category": risk_category,
    }

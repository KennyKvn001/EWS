import shap
import joblib
import numpy as np
from pathlib import Path
from typing import Optional, Tuple
from .prediction import predict, _get_model
from .preprocess import preprocess_input, NUM_FEATURES, BINARY_FEATURES

MODEL_DIR: Path = Path(__file__).parent.parent / "models"

BACKGROUND_PATH = str(MODEL_DIR / "background_data.pkl")

FEATURE_NAMES = [
    "Total Units Approved",
    "Average Grade",
    "Age at Enrollment",
    "Total Units Evaluated",
    "Total Units Enrolled",
    "Previous Qualification Grade",
    "Tuition Fees Up to Date",
    "Scholarship Holder",
    "Debtor",
    "Gender",
]

_explainer: Optional[shap.KernelExplainer] = None
_background_data: Optional[np.ndarray] = None


def _ensure_2d(array: np.ndarray) -> np.ndarray:
    """Ensure array is 2D by reshaping if needed."""
    if array.ndim == 1:
        return array.reshape(1, -1)
    return array


def _load_resources():
    """Lazy load the explainer and background data on first use."""
    global _explainer, _background_data

    if _explainer is None:
        try:
            model = _get_model()
            if _background_data is None:
                _background_data = joblib.load(BACKGROUND_PATH)
                _background_data = _ensure_2d(_background_data)
                max_samples = min(100, len(_background_data))
                _background_data = _background_data[:max_samples]
            _explainer = shap.KernelExplainer(model.predict, _background_data)
        except Exception as e:
            raise RuntimeError(f"Failed to load explainer resources: {e}") from e


def explain_instance(input_data: np.ndarray):
    """
    Compute SHAP values for a single input instance.

    Args:
        input_data: Input array (1D or 2D)

    Returns:
        SHAP values (list or array)
    """
    _load_resources()
    input_data = _ensure_2d(input_data)

    try:
        shap_values = _explainer.shap_values(input_data, nsamples=100)
        return shap_values
    except Exception as e:
        raise RuntimeError(f"SHAP computation failed: {e}") from e


def _normalize_shap_values(shap_values) -> Tuple[np.ndarray, bool]:
    """
    Normalize SHAP values to a consistent 3D format: (samples, features, classes).

    Returns:
        Tuple of (normalized_shap_array, has_two_classes)
    """
    if isinstance(shap_values, list) and len(shap_values) == 2:
        # Binary classification: SHAP returns list of 2 arrays (one per class)
        shap_dropout = _ensure_2d(np.array(shap_values[0]))
        shap_graduate = _ensure_2d(np.array(shap_values[1]))
        # Stack along axis=2 to create (samples, features, classes) shape
        shap_array = np.stack([shap_dropout, shap_graduate], axis=2)
        return shap_array, True
    elif isinstance(shap_values, list) and len(shap_values) > 0:
        # Single class or unexpected format - take first element
        shap_array = np.array(shap_values[0])
        shap_array = _ensure_2d(shap_array)
        # Reshape to 3D: (samples, features, 1)
        if shap_array.ndim == 2:
            shap_array = shap_array.reshape(shap_array.shape[0], shap_array.shape[1], 1)
        return shap_array, False
    else:
        # Single array (not a list)
        shap_array = np.array(shap_values)
        shap_array = _ensure_2d(shap_array)
        # Reshape to 3D: (samples, features, 1)
        if shap_array.ndim == 2:
            shap_array = shap_array.reshape(shap_array.shape[0], shap_array.shape[1], 1)
        return shap_array, False


def _extract_impacts(
    shap_array: np.ndarray, has_two_classes: bool, feature_idx: int
) -> Tuple[float, float]:
    """
    Extract dropout and graduate impacts from normalized SHAP array.

    After normalization, shap_array should always be 3D: (samples, features, classes).
    For binary classification with has_two_classes=True, shape[2] should be 2.

    Returns:
        Tuple of (dropout_impact, graduate_impact)
    """
    if shap_array.ndim == 3:
        dropout_impact = float(shap_array[0, feature_idx, 0])
        if shap_array.shape[2] >= 2:
            graduate_impact = float(shap_array[0, feature_idx, 1])
        else:
            graduate_impact = 0.0
    else:
        if shap_array.ndim == 2:
            dropout_impact = float(shap_array[0, feature_idx])
            if (
                has_two_classes
                and shap_array.shape[1] > feature_idx + shap_array.shape[0]
            ):
                num_features = shap_array.shape[1] // 2
                if feature_idx < num_features:
                    graduate_impact = float(shap_array[0, feature_idx + num_features])
                else:
                    graduate_impact = 0.0
            else:
                graduate_impact = 0.0
        else:
            dropout_impact = float(shap_array[feature_idx])
            graduate_impact = 0.0

    return dropout_impact, graduate_impact


def _get_interpretation(dropout_impact: float) -> str:
    """Get human-readable interpretation of dropout impact."""
    if dropout_impact > 0:
        return "Increases dropout risk"
    elif dropout_impact < 0:
        return "Decreases dropout risk"
    else:
        return "Neutral impact"


def _compute_summary(feature_explanations: list) -> dict:
    """
    Compute summary statistics in a single pass over feature_explanations.
    """
    if not feature_explanations:
        return {
            "most_influential_feature": "Unknown",
            "strongest_dropout_factor": "None",
            "strongest_protective_factor": "None",
        }

    strongest_dropout = None
    strongest_protective = None
    max_dropout_impact = float("-inf")
    min_dropout_impact = float("inf")

    for feature in feature_explanations:
        impact = feature["dropout_impact"]
        if impact > max_dropout_impact:
            max_dropout_impact = impact
            strongest_dropout = feature["feature"]
        if impact < min_dropout_impact:
            min_dropout_impact = impact
            strongest_protective = feature["feature"]

    return {
        "most_influential_feature": feature_explanations[0]["feature"],
        "strongest_dropout_factor": (
            strongest_dropout if max_dropout_impact > 0 else "None"
        ),
        "strongest_protective_factor": (
            strongest_protective if min_dropout_impact < 0 else "None"
        ),
    }


def predict_with_explanation(user_input: dict) -> dict:
    """
    Returns model prediction with SHAP explanations for a single input.
    """
    pred = predict(user_input)

    x_input_df = preprocess_input(user_input)
    x_input = _ensure_2d(x_input_df.values)

    def _get_original_value(feature_key: str, user_input: dict):
        """
        Get original value from user_input by trying multiple key variations.
        Handles mismatches between feature names and actual input keys.
        """
        # Try exact match (case-insensitive)
        key_lower = feature_key.lower()
        if key_lower in user_input:
            return user_input[key_lower]
        if feature_key in user_input:
            return user_input[feature_key]

        # Try variations for special cases
        # "Previous_qualification_(grade)" -> "previous_qualification_grade"
        normalized_key = key_lower.replace("_(", "_").replace("(", "").replace(")", "")
        if normalized_key in user_input:
            return user_input[normalized_key]

        # Try removing underscores and parentheses
        simple_key = key_lower.replace("_", "").replace("(", "").replace(")", "")
        for k in user_input.keys():
            if (
                k.lower().replace("_", "").replace("(", "").replace(")", "")
                == simple_key
            ):
                return user_input[k]

        return None

    all_feature_keys = NUM_FEATURES + BINARY_FEATURES
    original_values = []
    for key in all_feature_keys:
        value = _get_original_value(key, user_input)
        original_values.append(value)

    try:
        shap_values = explain_instance(x_input)
        shap_array, has_two_classes = _normalize_shap_values(shap_values)

        feature_explanations = []
        preprocessed_values = x_input[0]

        num_features = min(
            len(FEATURE_NAMES),
            shap_array.shape[1] if shap_array.ndim >= 2 else len(shap_array),
        )

        for i in range(num_features):
            try:
                dropout_impact, graduate_impact = _extract_impacts(
                    shap_array, has_two_classes, i
                )

                feature_explanations.append(
                    {
                        "feature": FEATURE_NAMES[i],
                        "original_value": (
                            original_values[i] if i < len(original_values) else None
                        ),
                        "preprocessed_value": (
                            round(float(preprocessed_values[i]), 4)
                            if i < len(preprocessed_values)
                            else 0.0
                        ),
                        "dropout_impact": round(dropout_impact, 4),
                        "graduate_impact": round(graduate_impact, 4),
                        "interpretation": _get_interpretation(dropout_impact),
                    }
                )
            except (IndexError, ValueError) as e:
                continue

        if not feature_explanations:
            raise ValueError("No feature explanations could be generated")

        feature_explanations.sort(key=lambda x: abs(x["dropout_impact"]), reverse=True)

        return {
            "prediction": pred,
            "explanation": {
                "feature_impacts": feature_explanations,
                "summary": _compute_summary(feature_explanations),
            },
        }
    except Exception as e:
        return {
            "prediction": pred,
            "explanation": {
                "error": f"Could not generate explanation: {str(e)}",
                "feature_impacts": [],
            },
        }

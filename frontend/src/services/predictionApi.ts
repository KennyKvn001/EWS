import type {
  PredictionFormData,
  PredictionInput,
  PredictionWithExplanationResponse,
  FeatureImpact,
} from "../types/prediction";

export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
  hint?: string;
}

export class FormDataConverter {
  static toBackendFormat(formData: PredictionFormData): PredictionInput {
    this.validateFormData(formData);

    return {
      total_units_approved: formData.total_units_approved,
      average_grade: formData.average_grade,
      age_at_enrollment: formData.age_at_enrollment,
      total_units_evaluated: formData.total_units_evaluated,
      total_units_enrolled: formData.total_units_enrolled,
      previous_qualification_grade: formData.previous_qualification_grade,
      tuition_fees_up_to_date: formData.tuition_fees_up_to_date ? 1 : 0,
      scholarship_holder: formData.scholarship_holder ? 1 : 0,
      debtor: formData.debtor ? 1 : 0,
      gender: formData.gender === "male" ? 1 : 0,
    };
  }

  static validateFormData(formData: PredictionFormData): void {
    const errors: string[] = [];

    if (
      formData.total_units_approved < 0 ||
      formData.total_units_approved > 20
    ) {
      errors.push("Total units approved must be between 0 and 20");
    }
    if (
      formData.total_units_evaluated < 0 ||
      formData.total_units_evaluated > 20
    ) {
      errors.push("Total units evaluated must be between 0 and 20");
    }
    if (
      formData.total_units_enrolled < 0 ||
      formData.total_units_enrolled > 20
    ) {
      errors.push("Total units enrolled must be between 0 and 20");
    }
    if (formData.average_grade < 0 || formData.average_grade > 100) {
      errors.push("Average grade must be between 0 and 100");
    }
    if (
      formData.previous_qualification_grade < 0 ||
      formData.previous_qualification_grade > 100
    ) {
      errors.push("Previous qualification grade must be between 0 and 100");
    }
    if (formData.age_at_enrollment < 16 || formData.age_at_enrollment > 65) {
      errors.push("Age at enrollment must be between 16 and 65");
    }
    if (!["male", "female"].includes(formData.gender)) {
      errors.push('Gender must be either "male" or "female"');
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(", ")}`);
    }
  }

  static validateApiResponse(
    response: unknown
  ): response is PredictionWithExplanationResponse {
    if (!response || typeof response !== "object") return false;

    const resp = response as Record<string, unknown>;

    if (!resp.prediction || typeof resp.prediction !== "object") return false;

    const prediction = resp.prediction as Record<string, unknown>;
    if (
      typeof prediction.prediction !== "number" ||
      typeof prediction.label !== "string" ||
      !prediction.probability ||
      typeof prediction.probability !== "object" ||
      typeof prediction.risk_category !== "string"
    )
      return false;

    const probability = prediction.probability as Record<string, unknown>;
    if (
      typeof probability.dropout !== "number" ||
      typeof probability.graduate !== "number"
    )
      return false;

    if (!resp.explanation || typeof resp.explanation !== "object") return false;

    const explanation = resp.explanation as Record<string, unknown>;
    if (
      !Array.isArray(explanation.feature_impacts) ||
      !explanation.summary ||
      typeof explanation.summary !== "object"
    )
      return false;

    for (const impact of explanation.feature_impacts) {
      if (
        !impact ||
        typeof impact !== "object" ||
        typeof (impact as any).feature !== "string" ||
        typeof (impact as any).dropout_impact !== "number" ||
        typeof (impact as any).graduate_impact !== "number" ||
        typeof (impact as any).interpretation !== "string"
      )
        return false;
    }

    const summary = explanation.summary as Record<string, unknown>;
    if (
      typeof summary.most_influential_feature !== "string" ||
      typeof summary.strongest_dropout_factor !== "string" ||
      typeof summary.strongest_protective_factor !== "string"
    )
      return false;

    return true;
  }
}

export class PredictionApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8000") {
    this.baseUrl = baseUrl;
  }

  async predictWithExplanation(
    formData: PredictionFormData
  ): Promise<PredictionWithExplanationResponse> {
    try {
      const backendInput = FormDataConverter.toBackendFormat(formData);

      const response = await fetch(`${this.baseUrl}/predict_with_xai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendInput),
      });

      if (!response.ok) {
        let errorData: ApiErrorResponse;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: "HTTP Error",
            message: `Request failed with status ${response.status}`,
          };
        }
        throw new PredictionApiError(errorData.message, errorData);
      }

      const data = await response.json();

      if (!FormDataConverter.validateApiResponse(data)) {
        throw new PredictionApiError("Invalid response format from server", {
          error: "Invalid Response",
          message: "The server returned an unexpected response format",
          details: { receivedData: data },
        });
      }

      return data;
    } catch (error) {
      if (error instanceof PredictionApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new PredictionApiError(
          "Unable to connect to the prediction service.",
          {
            error: "Network Error",
            message: "Failed to connect to the backend service",
            hint: "Make sure the backend server is running",
          }
        );
      }

      throw new PredictionApiError("An unexpected error occurred", {
        error: "Unknown Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export class PredictionApiError extends Error {
  public readonly apiError: ApiErrorResponse;

  constructor(message: string, apiError: ApiErrorResponse) {
    super(message);
    this.name = "PredictionApiError";
    this.apiError = apiError;
  }

  getUserMessage(): string {
    return this.message;
  }

  getApiError(): ApiErrorResponse {
    return this.apiError;
  }
}

export const predictionApi = new PredictionApiService();

export class PredictionResultConverter {
  static toEnhancedResult(
    apiResponse: PredictionWithExplanationResponse
  ): import("../types/prediction").EnhancedPredictionResult {
    const { prediction, explanation } = apiResponse;

    let riskLevel: "high" | "medium" | "low";
    switch (prediction.risk_category.toLowerCase()) {
      case "high":
        riskLevel = "high";
        break;
      case "medium":
        riskLevel = "medium";
        break;
      case "low":
        riskLevel = "low";
        break;
      default:
        if (prediction.probability.dropout >= 0.7) {
          riskLevel = "high";
        } else if (prediction.probability.dropout >= 0.4) {
          riskLevel = "medium";
        } else {
          riskLevel = "low";
        }
    }

    return {
      riskLevel,
      riskScore: prediction.probability.dropout,
      predictionLabel: prediction.label,
      explanation: {
        topFeatures: explanation.feature_impacts.slice(0, 5),
        summary: explanation.summary,
      },
    };
  }

  static getTopFeatures(
    featureImpacts: FeatureImpact[],
    count: number = 5
  ): FeatureImpact[] {
    return featureImpacts
      .sort((a, b) => Math.abs(b.dropout_impact) - Math.abs(a.dropout_impact))
      .slice(0, count);
  }

  static categorizeFeatures(featureImpacts: FeatureImpact[]): {
    riskFactors: FeatureImpact[];
    protectiveFactors: FeatureImpact[];
    neutralFactors: FeatureImpact[];
  } {
    const riskFactors = featureImpacts.filter((f) => f.dropout_impact > 0);
    const protectiveFactors = featureImpacts.filter(
      (f) => f.dropout_impact < 0
    );
    const neutralFactors = featureImpacts.filter((f) => f.dropout_impact === 0);

    return {
      riskFactors: riskFactors.sort(
        (a, b) => b.dropout_impact - a.dropout_impact
      ),
      protectiveFactors: protectiveFactors.sort(
        (a, b) => a.dropout_impact - b.dropout_impact
      ),
      neutralFactors,
    };
  }
}

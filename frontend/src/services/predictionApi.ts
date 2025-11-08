import type {
  PredictionFormData,
  PredictionInput,
  PredictionWithExplanationResponse,
  FeatureImpact,
} from "../types/prediction";
import type { Student, StudentWithPrediction } from "../types/student";

export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
  hint?: string;
}

export interface AtRiskStudentsResponse {
  students: Student[];
  total: number;
  skip: number;
  limit: number;
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
      tuition_fees_up_to_date: formData.tuition_fees_up_to_date ? 0 : 1,
      scholarship_holder: formData.scholarship_holder ? 0 : 1,
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
    if (!Array.isArray(explanation.feature_impacts)) return false;

    if (explanation.feature_impacts.length > 0) {
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
    }

    if (explanation.summary && typeof explanation.summary === "object") {
      const summary = explanation.summary as Record<string, unknown>;
      if (
        summary.most_influential_feature !== undefined &&
        summary.strongest_dropout_factor !== undefined &&
        summary.strongest_protective_factor !== undefined
      ) {
        if (
          typeof summary.most_influential_feature !== "string" ||
          typeof summary.strongest_dropout_factor !== "string" ||
          typeof summary.strongest_protective_factor !== "string"
        )
          return false;
      }
    }

    return true;
  }
}

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export class PredictionApiService {
  private baseUrl: string;
  private defaultTimeout: number;
  private retryOptions: RetryOptions;

  constructor(
    baseUrl: string = "https://ews-mcr0.onrender.com",
    timeout: number = 30000,
    retryOptions: RetryOptions = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    }
  ) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
    this.retryOptions = retryOptions;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private calculateRetryDelay(attempt: number): number {
    const delay =
      this.retryOptions.baseDelay *
      Math.pow(this.retryOptions.backoffMultiplier, attempt);
    return Math.min(delay, this.retryOptions.maxDelay);
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new PredictionApiError(
          "Request timed out. Please try again.",
          {
            error: "Timeout Error",
            message: `Request timed out after ${timeout}ms`,
            hint: "The server may be experiencing high load. Please try again in a moment.",
          },
          ErrorType.TIMEOUT_ERROR,
          true
        );
      }
      throw error;
    }
  }

  async predictWithExplanation(
    formData: PredictionFormData,
    options?: { timeout?: number; retries?: number }
  ): Promise<PredictionWithExplanationResponse> {
    const timeout = options?.timeout || this.defaultTimeout;
    const maxRetries =
      options?.retries !== undefined
        ? options.retries
        : this.retryOptions.maxRetries;

    let lastError: PredictionApiError | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const backendInput = FormDataConverter.toBackendFormat(formData);

        const response = await this.fetchWithTimeout(
          `${this.baseUrl}/predict_with_xai`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(backendInput),
          },
          timeout
        );

        if (!response.ok) {
          let errorData: ApiErrorResponse;
          let errorType: ErrorType;
          let isRetryable = false;

          try {
            errorData = await response.json();
          } catch {
            errorData = {
              error: "HTTP Error",
              message: `Request failed with status ${response.status}`,
            };
          }

          if (response.status >= 400 && response.status < 500) {
            errorType =
              response.status === 422
                ? ErrorType.VALIDATION_ERROR
                : ErrorType.SERVER_ERROR;
            isRetryable = response.status === 429;
            errorType = ErrorType.SERVER_ERROR;
            isRetryable = true;
          } else {
            errorType = ErrorType.UNKNOWN_ERROR;
          }

          const apiError = new PredictionApiError(
            this.getErrorMessage(errorData, response.status),
            errorData,
            errorType,
            isRetryable
          );

          if (!isRetryable || attempt === maxRetries) {
            throw apiError;
          }

          lastError = apiError;
          await this.delay(this.calculateRetryDelay(attempt));
          continue;
        }

        const data = await response.json();

        if (!FormDataConverter.validateApiResponse(data)) {
          throw new PredictionApiError(
            "Invalid response format from server",
            {
              error: "Invalid Response",
              message: "The server returned an unexpected response format",
              details: { receivedData: data },
            },
            ErrorType.PARSE_ERROR,
            false
          );
        }

        return data;
      } catch (error) {
        if (error instanceof PredictionApiError) {
          if (!error.canRetry() || attempt === maxRetries) {
            throw error;
          }
          lastError = error;
          await this.delay(this.calculateRetryDelay(attempt));
          continue;
        }

        if (error instanceof TypeError && error.message.includes("fetch")) {
          const networkError = new PredictionApiError(
            "Unable to connect to the prediction service.",
            {
              error: "Network Error",
              message: "Failed to connect to the backend service",
              hint: "Make sure the backend server is running and your internet connection is stable",
            },
            ErrorType.NETWORK_ERROR,
            true
          );

          if (attempt === maxRetries) {
            throw networkError;
          }

          lastError = networkError;
          await this.delay(this.calculateRetryDelay(attempt));
          continue;
        }

        throw new PredictionApiError(
          "An unexpected error occurred",
          {
            error: "Unknown Error",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          ErrorType.UNKNOWN_ERROR,
          false
        );
      }
    }

    throw (
      lastError ||
      new PredictionApiError(
        "Maximum retries exceeded",
        {
          error: "Retry Limit Exceeded",
          message: "Failed to complete request after maximum retries",
        },
        ErrorType.UNKNOWN_ERROR,
        false
      )
    );
  }

  private getErrorMessage(
    errorData: ApiErrorResponse,
    statusCode: number
  ): string {
    switch (statusCode) {
      case 400:
        return "Invalid request data. Please check your input and try again.";
      case 422:
        return "Validation failed. Please check the highlighted fields.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error occurred. Please try again in a moment.";
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return errorData.message || `Request failed with status ${statusCode}`;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/health`,
        { method: "GET" },
        5000
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async createStudentWithPrediction(
    formData: PredictionFormData,
    uploadedBy: string
  ): Promise<StudentWithPrediction> {
    const requestData = {
      age_at_enrollment: formData.age_at_enrollment,
      gender: formData.gender === "male" ? 1 : 0,
      total_units_approved: formData.total_units_approved,
      average_grade: formData.average_grade,
      total_units_evaluated: formData.total_units_evaluated,
      total_units_enrolled: formData.total_units_enrolled,
      previous_qualification_grade: formData.previous_qualification_grade,
      tuition_fees_up_to_date: formData.tuition_fees_up_to_date ? 0 : 1,
      scholarship_holder: formData.scholarship_holder ? 0 : 1,
      debtor: formData.debtor ? 1 : 0,
      uploaded_by: uploadedBy,
    };

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/students/create-with-prediction`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      },
      this.defaultTimeout
    );

    if (!response.ok) {
      let errorData: ApiErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          error: "HTTP Error",
          message: `Failed to create student with status ${response.status}`,
        };
      }

      throw new PredictionApiError(
        this.getErrorMessage(errorData, response.status),
        errorData,
        response.status >= 400 && response.status < 500
          ? ErrorType.VALIDATION_ERROR
          : ErrorType.SERVER_ERROR,
        false
      );
    }

    return await response.json();
  }

  async fetchAtRiskStudents(
    skip: number = 0,
    limit: number = 100
  ): Promise<AtRiskStudentsResponse> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/students/at-risk?skip=${skip}&limit=${limit}`,
        { method: "GET" },
        this.defaultTimeout
      );

      if (!response.ok) {
        throw new PredictionApiError(
          "Failed to fetch at-risk students",
          {
            error: "HTTP Error",
            message: `Request failed with status ${response.status}`,
          },
          ErrorType.SERVER_ERROR,
          false
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof PredictionApiError) {
        throw error;
      }
      throw new PredictionApiError(
        "Unable to fetch at-risk students",
        {
          error: "Network Error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        ErrorType.NETWORK_ERROR,
        false
      );
    }
  }
}

export enum ErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  PARSE_ERROR = "PARSE_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class PredictionApiError extends Error {
  public readonly apiError: ApiErrorResponse;
  public readonly errorType: ErrorType;
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    apiError: ApiErrorResponse,
    errorType: ErrorType = ErrorType.UNKNOWN_ERROR,
    isRetryable: boolean = false
  ) {
    super(message);
    this.name = "PredictionApiError";
    this.apiError = apiError;
    this.errorType = errorType;
    this.isRetryable = isRetryable;
  }

  getUserMessage(): string {
    return this.message;
  }

  getApiError(): ApiErrorResponse {
    return this.apiError;
  }

  getErrorType(): ErrorType {
    return this.errorType;
  }

  canRetry(): boolean {
    return this.isRetryable;
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
        } else if (prediction.probability.dropout > 0.5) {
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
        topFeatures: explanation.feature_impacts || [],
        summary: explanation.summary,
        error: explanation.error,
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

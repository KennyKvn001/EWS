/**
 * Usage Examples for PredictionResultDialog Component
 * 
 * This file provides TypeScript examples and helper functions for using the PredictionResultDialog
 */

import type { PredictionResult, RiskLevel } from "./PredictionResultDialog";

/**
 * Backend API response format (typical Python/FastAPI response)
 */
export interface BackendPredictionResponse {
  risk_category: "high" | "medium" | "low";
  risk_score: number;
  model_version?: string;
  created_at?: string;
}

/**
 * Explainability response format
 */
export interface ExplainabilityResponse {
  student_id: string;
  feature_importance: Record<string, number>;
  shap_values?: Record<string, number>;
  top_factors: Array<{
    feature: string;
    impact: number;
    direction: "positive" | "negative";
  }>;
}

/**
 * Converts backend API response to PredictionResult format
 */
export function convertBackendToPredictionResult(
  response: BackendPredictionResponse
): PredictionResult {
  return {
    riskLevel: response.risk_category,
    riskScore: response.risk_score,
  };
}

/**
 * Determines risk level based on score
 * @param score - Risk score between 0 and 1
 * @returns Risk level category
 */
export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 0.7) return "high";
  if (score >= 0.4) return "medium";
  return "low";
}

/**
 * Formats risk score as percentage
 */
export function formatRiskScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Gets risk level color for custom styling
 */
export function getRiskLevelColor(riskLevel: RiskLevel): string {
  const colors = {
    high: "#dc2626",
    medium: "#f59e0b",
    low: "#16a34a",
  };
  return colors[riskLevel];
}

/**
 * Gets risk level text color for Tailwind
 */
export function getRiskLevelTextColor(riskLevel: RiskLevel): string {
  const colors = {
    high: "text-red-600 dark:text-red-400",
    medium: "text-orange-600 dark:text-orange-400",
    low: "text-green-600 dark:text-green-400",
  };
  return colors[riskLevel];
}

/**
 * Example: Make a prediction API call
 */
export async function makePrediction(
  studentData: Record<string, unknown>
): Promise<PredictionResult> {
  const response = await fetch("/api/v1/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    throw new Error("Failed to make prediction");
  }

  const data: BackendPredictionResponse = await response.json();
  return convertBackendToPredictionResult(data);
}

/**
 * Example: Fetch explainability data
 */
export async function fetchExplainability(
  studentId: string
): Promise<ExplainabilityResponse> {
  const response = await fetch(`/api/v1/explain/${studentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch explainability");
  }

  return await response.json();
}

/**
 * Example: Re-run prediction with same parameters
 */
export async function rerunPrediction(
  studentId: string
): Promise<PredictionResult> {
  const response = await fetch(`/api/v1/predict/${studentId}/rerun`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to re-run prediction");
  }

  const data: BackendPredictionResponse = await response.json();
  return convertBackendToPredictionResult(data);
}

/**
 * Generate mock prediction result for testing
 */
export function generateMockPredictionResult(
  riskLevel?: RiskLevel
): PredictionResult {
  const level = riskLevel || (["high", "medium", "low"][Math.floor(Math.random() * 3)] as RiskLevel);
  
  const scoreRanges = {
    high: [0.7, 0.95],
    medium: [0.4, 0.69],
    low: [0.05, 0.39],
  };
  
  const [min, max] = scoreRanges[level];
  const score = min + Math.random() * (max - min);
  
  return {
    riskLevel: level,
    riskScore: Number(score.toFixed(2)),
  };
}

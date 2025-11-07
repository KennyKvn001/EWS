/**
 * Student-related TypeScript types that correspond to backend schema
 */

export interface Student {
  id: string;
  age_at_enrollment: number;
  gender: string;
  total_units_approved: number;
  average_grade: number;
  total_units_evaluated: number;
  total_units_enrolled: number;
  previous_qualification_grade: number;
  tuition_fees_up_to_date: boolean;
  scholarship_holder: boolean;
  debtor: boolean;
  uploaded_by: string;
  created_at?: string;
  updated_at?: string;
  risk_score?: number;
  risk_category?: string;
  last_prediction_date?: string;
}

export interface StudentCreate {
  age_at_enrollment: number;
  gender: string;
  total_units_approved: number;
  average_grade: number;
  total_units_evaluated: number;
  total_units_enrolled: number;
  previous_qualification_grade: number;
  tuition_fees_up_to_date: boolean;
  scholarship_holder: boolean;
  debtor: boolean;
  uploaded_by: string;
}

export interface BatchCreate {
  students: StudentCreate[];
}

export const Gender = {
  MALE: "male",
  FEMALE: "female",
} as const;

export const RiskCategory = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type GenderType = (typeof Gender)[keyof typeof Gender];
export type RiskCategoryType = (typeof RiskCategory)[keyof typeof RiskCategory];

export interface StudentWithPrediction {
  id: string;
  age_at_enrollment: number;
  gender: string;
  total_units_approved: number;
  average_grade: number;
  total_units_evaluated: number;
  total_units_enrolled: number;
  previous_qualification_grade: number;
  tuition_fees_up_to_date: boolean;
  scholarship_holder: boolean;
  debtor: boolean;
  uploaded_by: string;
  created_at: string;
  risk_score: number;
  risk_category: string;
  prediction_label: string;
  last_prediction_date: string;
}

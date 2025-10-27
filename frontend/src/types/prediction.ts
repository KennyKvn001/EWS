/**
 * Prediction-related TypeScript types that correspond to backend models
 */

export interface PredictionLog {
  id: string;
  student_id: string;
  risk_score: number;
  risk_category: string;
  created_at: string;
  created_by?: string;
}

export interface PredictionCreate {
  student_id: string;
  risk_score: number;
  risk_category: string;
  model_version?: string;
  model_features?: string;
  created_by?: string;
}

export interface PredictionResponse {
  /** The prediction result */
  prediction: PredictionLog;
  /** Additional metadata about the prediction */
  metadata?: {
    model_accuracy?: number;
    feature_importance?: Record<string, number>;
    processing_time_ms?: number;
  };
}

export interface BatchPredictionRequest {
  student_ids: string[];
  model_version?: string;
  created_by?: string;
}

export interface BatchPredictionResponse {
  predictions: PredictionLog[];
  summary: {
    total_predictions: number;
    successful_predictions: number;
    failed_predictions: number;
    average_risk_score: number;
    risk_distribution: Record<string, number>;
  };
}

export interface UserFriendlyPredictionInput {
  Total_Units_Approved: number;
  Average_Grade: number;
  Age_At_Enrollment: number;
  Total_Units_Evaluated: number;
  Total_Units_Enrolled: number;
  Previous_Qualification_Grade: number;
  Tuition_Fees_Up_To_Date: boolean;
  Scholarship_Holder: boolean;
  Debtor: boolean;
  Gender: string;
}

export interface PredictionInputMapping {
  /** Maps user-friendly field names to backend schema field names */
  Total_Units_Approved: 'total_units_approved';
  Average_Grade: 'average_grade';
  Age_At_Enrollment: 'age_at_enrollment';
  Total_Units_Evaluated: 'total_units_evaluated';
  Total_Units_Enrolled: 'total_units_enrolled';
  Previous_Qualification_Grade: 'previous_qualification_grade';
  Tuition_Fees_Up_To_Date: 'tuition_fees_up_to_date';
  Scholarship_Holder: 'scholarship_holder';
  Debtor: 'debtor';
  Gender: 'gender';
}

export const PREDICTION_FIELD_MAPPING: PredictionInputMapping = {
  Total_Units_Approved: 'total_units_approved',
  Average_Grade: 'average_grade',
  Age_At_Enrollment: 'age_at_enrollment',
  Total_Units_Evaluated: 'total_units_evaluated',
  Total_Units_Enrolled: 'total_units_enrolled',
  Previous_Qualification_Grade: 'previous_qualification_grade',
  Tuition_Fees_Up_To_Date: 'tuition_fees_up_to_date',
  Scholarship_Holder: 'scholarship_holder',
  Debtor: 'debtor',
  Gender: 'gender',
};

/**
 * Converts user-friendly prediction input to backend schema format
 */
export function convertToBackendFormat(
  userInput: UserFriendlyPredictionInput,
  uploadedBy: string
): Omit<import('./student').StudentCreate, 'uploaded_by'> & { uploaded_by: string } {
  return {
    total_units_approved: userInput.Total_Units_Approved,
    average_grade: userInput.Average_Grade,
    age_at_enrollment: userInput.Age_At_Enrollment,
    total_units_evaluated: userInput.Total_Units_Evaluated,
    total_units_enrolled: userInput.Total_Units_Enrolled,
    previous_qualification_grade: userInput.Previous_Qualification_Grade,
    tuition_fees_up_to_date: userInput.Tuition_Fees_Up_To_Date,
    scholarship_holder: userInput.Scholarship_Holder,
    debtor: userInput.Debtor,
    gender: userInput.Gender,
    uploaded_by: uploadedBy,
  };
}

/**
 * Converts backend format to user-friendly prediction input
 */
export function convertFromBackendFormat(
  backendData: import('./student').Student | import('./student').StudentCreate
): UserFriendlyPredictionInput {
  return {
    Total_Units_Approved: backendData.total_units_approved,
    Average_Grade: backendData.average_grade,
    Age_At_Enrollment: backendData.age_at_enrollment,
    Total_Units_Evaluated: backendData.total_units_evaluated,
    Total_Units_Enrolled: backendData.total_units_enrolled,
    Previous_Qualification_Grade: backendData.previous_qualification_grade,
    Tuition_Fees_Up_To_Date: backendData.tuition_fees_up_to_date,
    Scholarship_Holder: backendData.scholarship_holder,
    Debtor: backendData.debtor,
    Gender: backendData.gender,
  };
}

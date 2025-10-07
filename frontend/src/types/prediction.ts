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
  Age: number;
  Marital_Status: number;
  Currently_Employed: boolean;
  Scholarship_Holder: boolean;
  Has_Student_Loan: boolean;
  Attendance_Score: number;
  Study_Mode: number;
  Internet_Access: boolean;
  Engagement_Score: number;
  Repeated_Courses: number;
}

export interface PredictionInputMapping {
  /** Maps user-friendly field names to backend schema field names */
  Age: 'age';
  Marital_Status: 'marital_status';
  Currently_Employed: 'employed';
  Scholarship_Holder: 'scholarship';
  Has_Student_Loan: 'student_loan';
  Attendance_Score: 'attendance_score';
  Study_Mode: 'study_mode';
  Internet_Access: 'internet_access';
  Engagement_Score: 'engagement_score';
  Repeated_Courses: 'repeated_course';
}

export const PREDICTION_FIELD_MAPPING: PredictionInputMapping = {
  Age: 'age',
  Marital_Status: 'marital_status',
  Currently_Employed: 'employed',
  Scholarship_Holder: 'scholarship',
  Has_Student_Loan: 'student_loan',
  Attendance_Score: 'attendance_score',
  Study_Mode: 'study_mode',
  Internet_Access: 'internet_access',
  Engagement_Score: 'engagement_score',
  Repeated_Courses: 'repeated_course',
};

/**
 * Converts user-friendly prediction input to backend schema format
 */
export function convertToBackendFormat(
  userInput: UserFriendlyPredictionInput,
  uploadedBy: string
): Omit<import('./student').StudentCreate, 'uploaded_by'> & { uploaded_by: string } {
  return {
    age: userInput.Age,
    marital_status: userInput.Marital_Status,
    employed: userInput.Currently_Employed,
    scholarship: userInput.Scholarship_Holder,
    student_loan: userInput.Has_Student_Loan,
    attendance_score: userInput.Attendance_Score,
    study_mode: userInput.Study_Mode,
    internet_access: userInput.Internet_Access,
    engagement_score: userInput.Engagement_Score,
    repeated_course: userInput.Repeated_Courses,
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
    Age: backendData.age,
    Marital_Status: backendData.marital_status,
    Currently_Employed: backendData.employed,
    Scholarship_Holder: backendData.scholarship,
    Has_Student_Loan: backendData.student_loan,
    Attendance_Score: backendData.attendance_score,
    Study_Mode: backendData.study_mode,
    Internet_Access: backendData.internet_access,
    Engagement_Score: backendData.engagement_score,
    Repeated_Courses: backendData.repeated_course,
  };
}

/**
 * Student-related TypeScript types that correspond to backend schema
 */

export interface Student {
  id: string;
  age: number;
  marital_status: number;
  employed: boolean;
  scholarship: boolean;
  student_loan: boolean;
  attendance_score: number;
  study_mode: number;
  internet_access: boolean;
  engagement_score: number;
  repeated_course: number;
  uploaded_by: string;
  created_at?: string;
  updated_at?: string;
  risk_score?: number;
  risk_category?: string;
  last_prediction_date?: string;
}

export interface StudentCreate {
  age: number;
  marital_status: number;
  employed: boolean;
  scholarship: boolean;
  student_loan: boolean;
  attendance_score: number;
  study_mode: number;
  internet_access: boolean;
  engagement_score: number;
  repeated_course: number;
  uploaded_by: string;
}

export interface BatchCreate {
  students: StudentCreate[];
}

// Enums and constants for better type safety
export const MaritalStatus = {
  SINGLE: 1,
  MARRIED: 2,
}

export const StudyMode = {
  FULL_TIME: 1,
  PART_TIME: 2,
  ONLINE: 3,
}

export const RiskCategory = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

export type MaritalStatusType = typeof MaritalStatus[keyof typeof MaritalStatus];
export type StudyModeType = typeof StudyMode[keyof typeof StudyMode];
export type RiskCategoryType = typeof RiskCategory[keyof typeof RiskCategory];

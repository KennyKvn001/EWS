/**
 * Central export file for all TypeScript types
 * Import types like: import { Student, StudentCreate } from '@/types'
 */

// Student types
export type {
  Student,
  StudentCreate,
  BatchCreate,
  GenderType,
  RiskCategoryType,
} from './student';

export {
  Gender,
  RiskCategory,
} from './student';

// Prediction types
export type {
  PredictionLog,
  PredictionCreate,
  PredictionResponse,
  BatchPredictionRequest,
  BatchPredictionResponse,
  UserFriendlyPredictionInput,
  PredictionInputMapping,
  FeatureImpact,
  ExplanationSummary,
  PredictionWithExplanationResponse,
  PredictionFormData,
  PredictionInput,
  EnhancedPredictionResult,
} from './prediction';

export {
  PREDICTION_FIELD_MAPPING,
  convertToBackendFormat,
  convertFromBackendFormat,
} from './prediction';

// Batch upload types
export type {
  BatchUpload,
  BatchUploadCreate,
  BatchUploadUpdate,
  BatchUploadStatusType,
  BatchUploadSummary,
  BatchValidationError,
  BatchValidationResult,
} from './batch';

export {
  BatchUploadStatus,
} from './batch';

// Tab types
export type {
  TabConfig,
  TabControllerProps,
} from './tab';

// Common form and UI types
export interface FormError {
  /** Field name */
  field: string;
  /** Error message */
  message: string;
}

export interface LoadingState {
  /** Whether data is currently loading */
  loading: boolean;
  /** Error message if any */
  error?: string;
}

export interface TableColumn<T = unknown> {
  /** Column identifier */
  key: keyof T | string;
  /** Display label */
  label: string;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Custom render function */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  /** Column width */
  width?: string | number;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
}


/**
 * Batch upload-related TypeScript types that correspond to backend models
 */

export interface BatchUpload {
  id: string;
  filename?: string;
  total_records: number;
  successful_records: number;
  failed_records: number;
  status: BatchUploadStatusType;
  error_log?: string;
  uploaded_by: string;
  created_at: string;
  completed_at?: string;
}

export interface BatchUploadCreate {
  filename?: string;
  total_records: number;
  uploaded_by: string;
}

export interface BatchUploadUpdate {
  successful_records?: number;
  failed_records?: number;
  status?: BatchUploadStatusType;
  error_log?: string;
  completed_at?: string;
}

// Batch upload status enum
export const BatchUploadStatus = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
} as const;

export type BatchUploadStatusType = typeof BatchUploadStatus[keyof typeof BatchUploadStatus];

export interface BatchUploadSummary {
  total_uploads: number;
  status_distribution: Record<BatchUploadStatusType, number>;
  total_records_processed: number;
  overall_success_rate: number;
  recent_uploads: BatchUpload[];
}

export interface BatchValidationError {
  row: number;
  field: string;
  message: string;
  value?: unknown;
}

export interface BatchValidationResult {
  is_valid: boolean;
  errors: BatchValidationError[];
  valid_rows: number;
  invalid_rows: number;
  preview?: unknown[];
}

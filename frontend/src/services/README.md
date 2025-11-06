# API Service Layer Implementation

This document describes the implementation of the API service layer for backend-frontend integration.

## Files Modified/Created

### 1. `types/prediction.ts`

- Added comprehensive TypeScript interfaces matching backend response format
- `PredictionWithExplanationResponse` - matches `/predict_with_xai` endpoint response
- `PredictionFormData` - frontend form data structure
- `PredictionInput` - backend API input format
- `FeatureImpact` and `ExplanationSummary` - explainability data structures

### 2. `services/predictionApi.ts`

- Enhanced existing implementation with proper type safety
- `FormDataConverter` class with data transformation utilities
- `PredictionApiService` class for API communication
- `PredictionResultConverter` class for UI data conversion
- Comprehensive error handling with `PredictionApiError`

## Key Features

### Data Transformation

- **Grade Conversion**: Form uses 0-20 scale, backend expects 0-100 percentage
  - `average_grade`: (formValue / 20) \* 100
  - `previous_qualification_grade`: Direct mapping (0-200 range)
- **Boolean Conversion**: Form booleans → backend numbers (0/1)
- **Gender Conversion**: "male"/"female" → 1/0

### Validation

- Client-side validation matching backend schema constraints
- Units: 0-20 scale validation
- Grades: Proper range validation for both form and backend formats
- Age: 16-65 years validation
- Gender: "male"/"female" validation

### Error Handling

- Network error detection and user-friendly messages
- API error response parsing and display
- Response structure validation
- Comprehensive error types with hints

### Type Safety

- No `any` types used anywhere
- Strict TypeScript interfaces matching backend schemas
- Runtime response validation
- Type-safe data conversion methods

## Usage Example

```typescript
import { predictionApi, FormDataConverter } from "@/services";
import type { PredictionFormData } from "@/types";

const formData: PredictionFormData = {
  total_units_approved: 12.0,
  average_grade: 15.0, // 0-20 scale
  age_at_enrollment: 20,
  total_units_evaluated: 15.0,
  total_units_enrolled: 18.0,
  previous_qualification_grade: 160.0,
  tuition_fees_up_to_date: true,
  scholarship_holder: false,
  debtor: false,
  gender: "female",
};

try {
  const result = await predictionApi.predictWithExplanation(formData);
  console.log("Prediction:", result.prediction);
  console.log("Explanation:", result.explanation);
} catch (error) {
  if (error instanceof PredictionApiError) {
    console.error("API Error:", error.getUserMessage());
  }
}
```

## Backend Compatibility

The implementation is fully compatible with the FastAPI backend:

- Matches `PredictionInput` Pydantic schema exactly
- Handles all validation constraints from backend
- Properly transforms data types for API consumption
- Validates response structure matches backend output

## Next Steps

This implementation is ready for integration with:

1. PredictionForm component (Task 2)
2. PredictionResultDialog enhancement (Task 3)
3. Comprehensive error handling and testing (Task 4)

# Integration Tests

Integration tests for the prediction API service to verify that endpoints are called correctly.

## Running Integration Tests

```bash
# Run only integration tests
pnpm test src/test/integration

# Run all tests
pnpm test
```

## Test Coverage

### PredictionApiService

#### 1. predictWithExplanation

- ✅ Verifies `/predict_with_xai` endpoint is called exactly once
- ✅ Validates correct HTTP method (POST)
- ✅ Validates request headers (Content-Type: application/json)
- ✅ Validates data transformation from form format to backend format
- ✅ Validates response structure

**Data Transformation Tested:**

- Boolean fields converted to 1/0
- Gender converted to 1 (male) / 0 (female)
- All numeric fields passed through correctly

#### 2. createStudentWithPrediction

- ✅ Verifies `/students/create-with-prediction` endpoint is called exactly once
- ✅ Validates correct HTTP method (POST)
- ✅ Validates request body includes all student fields
- ✅ Validates `uploaded_by` field is included

#### 3. fetchAtRiskStudents

- ✅ Verifies `/students/at-risk` endpoint is called exactly once
- ✅ Validates correct HTTP method (GET)
- ✅ Validates query parameters (skip, limit) are included in URL
- ✅ Tests with default parameters (skip=0, limit=100)
- ✅ Tests with custom parameters

## Test Strategy

These integration tests use **mocked fetch** to:

1. Verify endpoints are called with correct URLs
2. Verify HTTP methods are correct
3. Verify request bodies and headers are properly formatted
4. Verify data transformations work correctly
5. Avoid making actual network requests during testing

## Mock Setup

```typescript
// Spy on global fetch
fetchSpy = vi.spyOn(global, "fetch");

// Mock successful response
fetchSpy.mockResolvedValueOnce({
  ok: true,
  status: 200,
  json: async () => mockResponse,
} as Response);
```

## Assertions

Each test verifies:

- `expect(fetchSpy).toHaveBeenCalledTimes(1)` - Endpoint called exactly once
- `expect(fetchSpy).toHaveBeenCalledWith(url, options)` - Correct URL and options
- Request body matches expected format
- Response is properly returned

## Configuration

Tests use a custom service configuration:

- Base URL: `https://ews-mcr0.onrender.com`
- Timeout: 10 seconds
- Max retries: 1 (reduced for faster tests)
- Retry delays: 100ms base, 500ms max

This ensures tests run quickly while still validating retry logic.

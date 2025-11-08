# View Component Tests

Simple render tests for all view components in the application.

## Running Tests

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Test Structure

```
frontend/src/test/
├── setup.ts           # Test setup with global mocks
├── views/             # View component tests
│   ├── HomeOverview.test.tsx
│   ├── Layout.test.tsx
│   ├── Login.test.tsx
│   ├── Prediction.test.tsx
│   ├── SignUp.test.tsx
│   ├── Simulations.test.tsx
│   └── StudentsView.test.tsx
├── integration/       # Integration tests
│   └── predictionApi.test.ts
└── README.md
```

## What's Tested

### View Component Tests

Each view component test verifies:

- Component renders without crashing
- Key text content is present
- Basic UI elements are rendered

These are simple smoke tests to ensure components render correctly.

### Integration Tests

The prediction API service integration tests verify:

- **predictWithExplanation**: Calls `/predict_with_xai` endpoint once with correct data transformation
- **createStudentWithPrediction**: Calls `/students/create-with-prediction` endpoint once
- **fetchAtRiskStudents**: Calls `/students/at-risk` endpoint once with query parameters
- **healthCheck**: Calls `/health` endpoint once and handles failures

These tests mock the fetch API to verify that endpoints are called correctly without making actual network requests.

## Mocks

- **ResizeObserver**: Mocked globally in setup.ts (required for Radix UI components)
- **IntersectionObserver**: Mocked globally in setup.ts
- **matchMedia**: Mocked globally in setup.ts
- **Clerk components**: Mocked in individual test files (SignIn, SignUp, UserButton)
- **useClient hook**: Mocked in StudentsView test

## Notes

- Tests use Vitest (not Jest)
- Testing Library is used for rendering and queries
- View tests are simple render tests without user interactions
- Integration tests use mocked fetch to verify API calls without network requests
- Run specific test suites: `pnpm test src/test/views` or `pnpm test src/test/integration`

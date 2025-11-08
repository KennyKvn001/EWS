# EWSS ML - Early Warning and Support System

A comprehensive student risk prediction platform that uses machine learning to identify at risk students, providing actionable insights through explainable AI (XAI).
![Dashboard Overview](readme-img/dashboard.png)

[![Demo Video](https://img.shields.io/badge/Demo-YouTube-red)](https://youtu.be/Ace3zPaHwoM)
[![Application](https://img.shields.io/badge/Application-Live-blue)](https://ews-puce.vercel.app)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)

---

## Overview

EWSS ML is a full-stack application designed to help educational institutions identify and support at-risk students early. The system combines machine learning models (XGBoost and Neural Networks) with SHAP-based explainability to provide transparent, actionable predictions.

### Key Capabilities

- **Risk Prediction**: ML-powered dropout probability predictions
- **Explainable AI**: SHAP-based feature importance and impact analysis
- **Student Management**: Comprehensive student record tracking
- **What-If Simulations**: Test intervention scenarios
- **Real-time Dashboard**: Monitor at-risk students and trends

---

## Features

### Student Risk Assessment

- Individual student risk predictions with shap interpretability (XAI) summary
- Risk categorization (Low, Medium, High)
- Historical prediction tracking
- Automatic risk scoring on student creation

### Explainable AI (XAI)

- SHAP-based feature impact analysis
- Visual representation of risk factors
- Protective vs. risk factor identification
- Most influential feature highlighting

### What-If Simulations

- Test different intervention scenarios
- Compare risk scores before/after changes
- Interactive parameter adjustment
- Real-time prediction updates

### Analytics Dashboard

- At-risk student trends over time
- Risk distribution visualization
- Student performance metrics
- Filterable date ranges

### Batch Operations (Coming Soon)

- CSV/Excel file upload support
- Bulk student data processing
- Batch prediction generation
- Upload history tracking

### Student Management

- Create and manage student records
- Searchable and sortable data tables
- Pagination support
- Detailed student profiles

---

## Technology Stack

### Backend

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **ML Libraries**:
  - scikit-learn (1.6.1) - XGBoost model
  - TensorFlow (2.20.0+) - Neural Network model
  - SHAP (0.49.1+) - Explainability
  - joblib, dill - Model serialization
- **Data Processing**: pandas (2.3.3+)
- **Server**: uvicorn
- **Package Manager**: uv (recommended) or pip

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI primitives
- **Routing**: React Router 7
- **Forms**: React Hook Form with Zod validation
- **Data Tables**: TanStack Table
- **Charts**: Recharts
- **Authentication**: Clerk
- **Package Manager**: pnpm (preferred) or npm

### Testing

- **Framework**: Vitest 4
- **Testing Library**: React Testing Library
- **Coverage**: Unit tests for views, Integration tests for API

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **Package Managers**:
  - pnpm (recommended for frontend) or npm
  - uv (recommended for backend) or pip
- **Database**: PostgreSQL (local or remote instance)
- **Git**: For cloning the repository

### Installing Package Managers

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install uv (recommended for Python)
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or via pip
pip install uv
```

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/KennyKvn001/EWS.git
cd EWS
```

### Step 2: Backend Setup

#### 2.1 Create Environment File

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Add the following configuration to `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://USER:PASSWORD@HOST:PORT/DATABASE_NAME

# Example for local PostgreSQL:
# DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/ewss_db

# Optional CORS configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
ALLOW_VERCEL_PREVIEWS=true
```

#### 2.2 Install Python Dependencies

Choose one of the following methods:

**Option A: Using uv (Recommended)**

```bash
cd backend

# Install from pyproject.toml (development mode)
uv pip install -e .

# OR sync exact versions from requirements.txt
uv pip sync requirements.txt
```

**Option B: Using pip**

```bash
cd backend

# Install from pyproject.toml
pip install -e .

# OR install from requirements.txt
pip install -r requirements.txt
```

#### 2.3 Initialize Database

```bash
cd backend

# Initialize database tables
python db_manager.py init

# Verify database connection
python db_manager.py test
```

### Step 3: Frontend Setup

#### 3.1 Install Node Dependencies

```bash
cd frontend

# Using pnpm (recommended)
pnpm install

# OR using npm
npm install
```

#### 3.2 Configure API Base URL (Optional)

The default API URL is `http://localhost:8000`. If your backend runs on a different URL, update it in `frontend/src/hooks/useClient.ts`:

```typescript
const BASE_URL = "http://localhost:8000"; // Change if needed
```

---

## Running the Application

### Start Backend Server

```bash
cd backend

# Run the FastAPI server
python -m app.main

# Server will start on http://localhost:8000
# API documentation available at http://localhost:8000/docs
```

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend

# Using pnpm
pnpm dev

# OR using npm
npm run dev

# Application will start on http://localhost:5173
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative API Docs**: http://localhost:8000/redoc (ReDoc)

---

## Project Structure

```
EWS/
├── backend/                      # Python FastAPI backend
│   ├── app/
│   │   ├── main.py              # FastAPI application & endpoints
│   │   ├── models.py            # SQLAlchemy ORM models
│   │   ├── database/
│   │   │   ├── db.py            # Database connection & session
│   │   │   ├── schema.py        # Pydantic schemas for validation
│   │   │   └── create_mock_data.py  # Mock data generator
│   │   ├── scripts/
│   │   │   ├── prediction.py    # ML prediction logic
│   │   │   ├── explainability.py # SHAP-based XAI
│   │   │   └── preprocess.py    # Data preprocessing
│   │   └── models/              # Serialized ML models (.pkl)
│   │       ├── best_b_xgb_model.pkl
│   │       ├── nn_b_model.pkl
│   │       ├── scaler.pkl
│   │       └── preprocessed.pkl
│   ├── db_manager.py            # Database CLI tool
│   ├── requirements.txt         # Python dependencies
│   └── pyproject.toml           # Python project configuration
│
├── frontend/                     # React TypeScript frontend
│   ├── src/
│   │   ├── App.tsx              # Root component
│   │   ├── main.tsx             # Application entry point
│   │   ├── views/               # Page components
│   │   │   ├── HomeOverview.tsx # Dashboard view
│   │   │   ├── Prediction.tsx   # Prediction interface
│   │   │   ├── Simulations.tsx  # What-if scenarios
│   │   │   ├── StudentsView.tsx # Student management
│   │   │   ├── Login.tsx        # Authentication
│   │   │   ├── SignUp.tsx       # User registration
│   │   │   └── Layout.tsx       # App layout wrapper
│   │   ├── components/
│   │   │   ├── forms/           # Form components
│   │   │   │   ├── PredictionForm.tsx
│   │   │   │   ├── SimulationForm.tsx
│   │   │   │   ├── StudentCreationForm.tsx
│   │   │   │   ├── FileUploadForm.tsx
│   │   │   │   └── StudentSelector.tsx
│   │   │   ├── myui/            # Custom UI components
│   │   │   │   ├── AppSidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── EwsTable.tsx
│   │   │   │   ├── RiskCircle.tsx
│   │   │   │   ├── TrendsChart.tsx
│   │   │   │   ├── RiskDistributionChart.tsx
│   │   │   │   ├── FeatureImpactCard.tsx
│   │   │   │   ├── XAISummary.tsx
│   │   │   │   └── PredictionResultDialog.tsx
│   │   │   └── ui/              # Radix UI wrappers
│   │   ├── services/
│   │   │   └── predictionApi.ts # API client service
│   │   ├── hooks/
│   │   │   └── useClient.ts     # API base URL hook
│   │   ├── types/               # TypeScript type definitions
│   │   │   ├── student.ts
│   │   │   ├── prediction.ts
│   │   │   ├── batch.ts
│   │   │   └── tab.ts
│   │   ├── test/                # Test files
│   │   │   ├── setup.ts         # Test configuration
│   │   │   ├── views/           # View component tests
│   │   │   └── integration/     # API integration tests
│   │   └── routes/
│   │       └── Routes.tsx       # Route definitions
│   ├── package.json             # Node dependencies
│   ├── vite.config.ts           # Vite configuration
│   ├── vitest.config.ts         # Vitest configuration
│   └── tsconfig.json            # TypeScript configuration
│
└── README.md                     # This file
```

---

## API Documentation

### Base URL

`http://localhost:8000`

### Endpoints

#### Health & Status

| Method | Endpoint   | Description                       |
| ------ | ---------- | --------------------------------- |
| GET    | `/`        | Service information               |
| GET    | `/health`  | Health check with database status |
| GET    | `/db/test` | Test database connectivity        |

#### Student Management

| Method | Endpoint                           | Description                                       |
| ------ | ---------------------------------- | ------------------------------------------------- |
| GET    | `/students`                        | Get paginated list of students                    |
| GET    | `/students/at-risk`                | Get at-risk students (risk_category: medium/high) |
| POST   | `/students/create-with-prediction` | Create student with automatic risk prediction     |

**Query Parameters:**

- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum records to return (default: 100)

#### Predictions

| Method | Endpoint            | Description                           |
| ------ | ------------------- | ------------------------------------- |
| POST   | `/predict`          | Basic prediction without explanations |
| POST   | `/predict_with_xai` | Prediction with SHAP explanations     |

#### File Upload

| Method | Endpoint       | Description                                |
| ------ | -------------- | ------------------------------------------ |
| POST   | `/upload/file` | Upload CSV/Excel file for batch processing |

### Data Models

#### Student Fields

| Field                        | Type    | Description                |
| ---------------------------- | ------- | -------------------------- |
| age_at_enrollment            | integer | Student age (16-65)        |
| gender                       | string  | "male" or "female"         |
| total_units_approved         | integer | Units passed (0-20)        |
| average_grade                | float   | Average grade (0-100)      |
| total_units_evaluated        | integer | Units evaluated (0-20)     |
| total_units_enrolled         | integer | Units enrolled (0-20)      |
| previous_qualification_grade | float   | Previous grade (0-100)     |
| tuition_fees_up_to_date      | boolean | Fee payment status         |
| scholarship_holder           | boolean | Scholarship status         |
| debtor                       | boolean | Debt status                |
| uploaded_by                  | string  | User who created record    |
| risk_score                   | float   | Dropout probability (0-1)  |
| risk_category                | string  | "low", "medium", or "high" |

---

## Testing

### High risk category response

![High Risk Category](readme-img/high.png)

### Medium risk category response

![Medium Risk Category](readme-img/medium.png)

### Low risk category response

![Low Risk Category](readme-img/low.png)

### Frontend Tests

The frontend includes comprehensive test coverage:

#### View Component Tests

Simple render tests for all view components to ensure they render without crashing.

**Run Tests:**

```bash
cd frontend

# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run only view tests
pnpm test src/test/views

# Run only integration tests
pnpm test src/test/integration
```

#### Integration Tests

API service integration tests that verify endpoints are called correctly.

**Test Coverage:**

- ✅ `predictWithExplanation` - Calls `/predict_with_xai` endpoint
- ✅ `createStudentWithPrediction` - Calls `/students/create-with-prediction` endpoint
- ✅ `fetchAtRiskStudents` - Calls `/students/at-risk` endpoint with pagination

**Test Strategy:**

These integration tests use **mocked fetch** to:

1. Verify endpoints are called with correct URLs
2. Verify HTTP methods are correct
3. Verify request bodies and headers are properly formatted
4. Verify data transformations work correctly
5. Avoid making actual network requests during testing

**Test Results:**

```
Test Files  8 passed (8)
Tests  26 passed (26)
  - View Tests: 20 passed
  - Integration Tests: 6 passed
```

### Backend Tests

Backend testing can be performed using the built-in FastAPI test client or manual API testing via Swagger UI.

**Manual Testing:**

1. Start the backend server
2. Navigate to http://localhost:8000/docs
3. Use the interactive Swagger UI to test endpoints

---

### Project Links

- [Demo Video](https://youtu.be/DRfHBF6c88o)
- [GitHub Repository](https://github.com/KennyKvn001/EWS)
- [Application](https://ews-puce.vercel.app)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is part of an academic research initiative for early student dropout prediction.

---

## Authors

- **Kenny Kevin** - [GitHub](https://github.com/KennyKvn001)

---

**Built with ❤️ for educational excellence**

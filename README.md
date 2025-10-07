## EWSS ML

Early Warning and Support System for student risk prediction.

### What’s here

- **Backend**: FastAPI API with PostgreSQL via SQLAlchemy (Python 3.11+)
- **Frontend**: React + TypeScript + Vite (TailwindCSS, Radix UI)

---

## Quick start

### Prerequisites

- Python 3.11+
- Node.js 18+ and pnpm (or npm)
- A PostgreSQL database (local or remote)

### 1) Backend

1. Create env file in `backend/.env`:

```
DATABASE_URL=postgresql+psycopg2://USER:PASS@HOST:PORT/DBNAME
```

2. Install deps (choose one):

```
# with uv (recommended)
cd backend && uv pip install -e .

# or with pip
cd backend && pip install -e .
```

3. Initialize DB tables:

```
cd backend
python db_manager.py init
```

4. (Optional) Seed mock data:

```
cd backend/app/database
python create_mock_data.py --count 100 --clear
```

5. Run API:

```
cd backend
python -m app.main
# then open http://localhost:8000/docs
```

### 2) Frontend

1. Install deps:

```
cd frontend
pnpm install   # or npm install
```

2. Start dev server:

```
pnpm dev       # or npm run dev
# open http://localhost:5173
```

Note: API base URL is set in `frontend/src/hooks/useClient.ts` (`BASE_URL = 'http://localhost:8000'`). Adjust if your API runs elsewhere.

---

## Backend API

Base URL: `http://localhost:8000`

### Endpoints

- `GET /` – service info
- `GET /health` – service + DB health
- `GET /db/test` – DB connectivity
- `GET /students/count` – total students
- `GET /students?skip=0&limit=100` – paginated students
- `POST /prediction/input` – mock prediction for a student body (schema below)
- `POST /upload/file` – accepts `.csv`/`.xlsx`/`.xls` (echoes metadata)

### Schemas (request excerpt)

`StudentCreate` fields:

- `age: int`
- `marital_status: int`
- `employed: bool`
- `scholarship: bool`
- `student_loan: bool`
- `attendance_score: float`
- `study_mode: int`
- `internet_access: bool`
- `engagement_score: float`
- `repeated_course: float`
- `uploaded_by: string`

### Models (tables)

- `students` – core student data (+ optional `risk_score`, `risk_category`, `last_prediction_date`)
- `prediction_logs` – prediction history
- `batch_uploads` – batch upload tracking

---

## Frontend

Dev server: `http://localhost:5173`

### Routes

- `/` – Home overview
- `/predictions` – Predictions view
- `/at-risk-view` – At-risk view
- `/simulation` – Simulations

### Tech

- React 19, TypeScript, Vite 7
- TailwindCSS 4, Radix UI, TanStack Table

---

## Developer commands

### Backend

```
# run API
cd backend && python -m app.main

# seed mock data
cd backend/app/database && python create_mock_data.py --count 100 --clear
```

### Frontend

```
cd frontend
pnpm dev
pnpm build
pnpm preview
```

---

## Configuration notes

- CORS allows `http://localhost:5173` and `http://localhost:3000` by default (see `backend/app/main.py`).
- Database URL must be a valid SQLAlchemy PostgreSQL URL using `psycopg2`.
- Vite alias `@` maps to `frontend/src`.

---

## Project structure

```
backend/
  app/
    main.py           # FastAPI app & endpoints
    models.py         # ORM models (students, prediction_logs, batch_uploads)
    database/
      schema.py       # Pydantic schemas
      db.py             # SQLAlchemy engine/session helpers
      create_mock_data.py
  db_manager.py       # DB CLI (init/reset/check/test)

frontend/
  src/
    routes/Routes.tsx # App routes
    views/            # Pages (HomeOverview, Prediction, AtRiskView, Simulations)
    hooks/useClient.ts# API client (BASE_URL)
```

---

## Troubleshooting

- If `/health` shows degraded: verify `DATABASE_URL` and DB is reachable.
- If frontend cannot fetch: ensure backend is on `http://localhost:8000` or update `BASE_URL`.
- If CORS errors: add your frontend origin in `backend/app/main.py` CORS settings.

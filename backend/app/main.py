from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import logging

from .scripts.prediction import predict
from .database.db import get_db, create_tables, test_connection, get_db_health
from .models import Student, PredictionLog
from .database.schema import PredicitonInput, StudentCreate, StudentWithPrediction
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="EWSS ML API",
    description="Early Warning and Support System for Student Risk Prediction",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Application startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database on application startup"""
    logger.info("Starting EWS API application...")

    if test_connection():
        logger.info("Database connection successful")

        try:
            create_tables()
            logger.info("Database tables initialized")
        except Exception as e:
            logger.error(f"Failed to initialize database tables: {e}")
            raise
    else:
        logger.error("Database connection failed - application may not work properly")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    logger.info("Shutting down EWS API application...")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to EWSS API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Enhanced health check endpoint with database status"""
    db_health = get_db_health()
    return {
        "status": "healthy" if db_health["status"] == "healthy" else "degraded",
        "service": "EWSS API",
        "database": db_health,
    }


@app.get("/db/test")
async def test_db_connection():
    """Test database connection endpoint"""
    if test_connection():
        return {"status": "success", "message": "Database connection successful"}
    else:
        return {"status": "error", "message": "Database connection failed"}


@app.get("/students")
async def get_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get students from the database with pagination"""
    try:
        students = db.query(Student).offset(skip).limit(limit).all()
        total_count = db.query(Student).count()

        # Convert to dictionaries for JSON response
        students_data = [student.to_dict() for student in students]

        return {
            "students": students_data,
            "total": total_count,
            "skip": skip,
            "limit": limit,
        }
    except Exception as e:
        logger.error(f"Error getting students: {e}")
        return {"error": "Failed to get students", "details": str(e)}

@app.post("/predict")
def predict_student(input_data: PredicitonInput):
    """Predict student risk status with percentile grades and 0-20 scale units"""
    try:
        result = predict(input_data.model_dump())
        return result
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {
            "error": "Prediction failed",
            "message": str(e),
            "hint": "Check /predict/input-guide for correct input format"
        }


@app.post("/students/create-with-prediction", response_model=StudentWithPrediction)
def create_student_with_prediction(student_data: StudentCreate, db: Session = Depends(get_db)):
    """Create a new student record and automatically generate prediction"""
    try:
        # Get prediction first
        prediction_result = predict(student_data.model_dump())
        
        if "error" in prediction_result:
            return {
                "error": "Prediction failed",
                "message": prediction_result.get("message", "Unknown prediction error"),
                "details": prediction_result
            }
        
        gender_str = "male" if student_data.gender == 1 else "female"
        
        # Create student record with prediction results
        new_student = Student(
            age_at_enrollment=student_data.age_at_enrollment,
            gender=gender_str,
            total_units_approved=student_data.total_units_approved,
            average_grade=student_data.average_grade,
            total_units_evaluated=student_data.total_units_evaluated,
            total_units_enrolled=student_data.total_units_enrolled,
            previous_qualification_grade=student_data.previous_qualification_grade,
            tuition_fees_up_to_date=bool(student_data.tuition_fees_up_to_date),
            scholarship_holder=bool(student_data.scholarship_holder),
            debtor=bool(student_data.debtor),
            uploaded_by=student_data.uploaded_by,
            # Prediction results
            risk_score=prediction_result["probability"]["dropout"],
            risk_category=prediction_result["risk_category"],
            last_prediction_date=datetime.now()
        )
        
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        
        # Also create a prediction log entry
        prediction_log = PredictionLog(
            student_id=new_student.id,
            risk_score=prediction_result["probability"]["dropout"],
            risk_category=prediction_result["risk_category"],
            model_version="nn_b_model_v1",
            created_by=student_data.uploaded_by
        )
        
        db.add(prediction_log)
        db.commit()
        
        # Prepare response
        response_data = {
            "id": str(new_student.id),
            "age_at_enrollment": new_student.age_at_enrollment,
            "gender": new_student.gender,
            "total_units_approved": new_student.total_units_approved,
            "average_grade": new_student.average_grade,
            "total_units_evaluated": new_student.total_units_evaluated,
            "total_units_enrolled": new_student.total_units_enrolled,
            "previous_qualification_grade": new_student.previous_qualification_grade,
            "tuition_fees_up_to_date": new_student.tuition_fees_up_to_date,
            "scholarship_holder": new_student.scholarship_holder,
            "debtor": new_student.debtor,
            "uploaded_by": new_student.uploaded_by,
            "created_at": new_student.created_at.isoformat(),
            "risk_score": new_student.risk_score,
            "risk_category": new_student.risk_category,
            "prediction_label": prediction_result["label"],
            "last_prediction_date": new_student.last_prediction_date.isoformat()
        }
        
        logger.info(f"Created student {new_student.id} with prediction: {prediction_result['risk_category']}")
        return response_data
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating student with prediction: {e}")
        return {
            "error": "Failed to create student",
            "message": str(e),
            "hint": "Check your input data and try again"
        }


@app.post("/upload/file")
async def file_upload(file: UploadFile = File(...)):
    """Endpoint for uploading data files"""
    try:
        # Validate file type
        if not file.filename.endswith((".csv", ".xlsx", ".xls")):
            return {
                "error": "Invalid file type. Please upload CSV or Excel files only."
            }

        # Here you would process the uploaded file
        # For now, returning upload confirmation
        return {
            "status": "success",
            "message": "File uploaded successfully",
            "filename": file.filename,
            "content_type": file.content_type,
            "size": file.size if hasattr(file, "size") else "unknown",
        }
    except Exception as e:
        logger.error(f"Error in file upload: {e}")
        return {"error": "Failed to upload file", "details": str(e)}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

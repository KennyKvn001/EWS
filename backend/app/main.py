from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import logging
from .database.db import get_db, create_tables, test_connection, get_db_health
from .models import Student
from .database.schema import StudentCreate

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

    # Test database connection
    if test_connection():
        logger.info("Database connection successful")

        # Create tables if they don't exist
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


@app.get("/students/count")
async def get_students_count(db: Session = Depends(get_db)):
    """Get total count of students in the database"""
    try:
        count = db.query(Student).count()
        return {"total_students": count}
    except Exception as e:
        logger.error(f"Error getting students count: {e}")
        return {"error": "Failed to get students count", "details": str(e)}


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


@app.post("/prediction/input")
async def prediction_input(student_data: StudentCreate, db: Session = Depends(get_db)):
    """Endpoint for single student prediction input"""
    try:
        # Here you would add your ML prediction logic
        # For now, returning a mock prediction
        return {
            "status": "success",
            "message": "Prediction completed",
            "student_data": student_data.dict(),
            "prediction": {
                "risk_score": 0.75,
                "risk_category": "medium",
                "confidence_score": 0.85,
            },
        }
    except Exception as e:
        logger.error(f"Error in prediction input: {e}")
        return {"error": "Failed to process prediction", "details": str(e)}


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

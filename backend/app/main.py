from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import logging

# Import database components
from .db import get_db, create_tables, test_connection, get_db_health
from .models import Student, PredictionLog, BatchUpload

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="EWS Project ML API",
    description="Early Warning System for Student Risk Prediction",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
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


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from typing import Generator
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
DB_SSLMODE = os.getenv("DB_SSLMODE", "prefer")

logger.info("Using PostgreSQL database")
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=5,
    max_overflow=10,
    connect_args={
        "connect_timeout": 5,
        "sslmode": DB_SSLMODE,
    },
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

metadata = MetaData()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.
    This will be used with FastAPI's dependency injection system.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def create_tables():
    """
    Create all tables in the database.
    This should be called during application startup.
    """
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise


def drop_tables():
    """
    Drop all tables in the database.
    Use with caution - this will delete all data!
    """
    try:
        Base.metadata.drop_all(bind=engine)
        logger.info("Database tables dropped successfully")
    except Exception as e:
        logger.error(f"Error dropping database tables: {e}")
        raise


def test_connection():
    """
    Test the database connection.
    Returns True if connection is successful, False otherwise.
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Database connection test successful")
        return True
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False


# Database health check
def get_db_health():
    """
    Get database health status for health check endpoints.
    """
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            return {
                "status": "healthy",
                "database": "connected",
                "engine": str(engine.url).split("@")[0] + "@***",
            }
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


# Import models to register them with Base.metadata
# This must be done after Base is defined to avoid circular imports
def _import_models():
    """Import all models to register them with Base.metadata"""
    try:
        from ..models import Student, PredictionLog, BatchUpload

        logger.info("Models imported successfully (relative import)")
    except ImportError:
        # If running from db_manager.py, use absolute import
        try:
            from app.models import Student, PredictionLog, BatchUpload

            logger.info("Models imported successfully (absolute import)")
        except ImportError as e:
            logger.error(f"Could not import models: {e}")
            raise


# Import models when this module is loaded
_import_models()

#!/usr/bin/env python3
"""
Database management script for EWS Project ML API.
This script provides utilities for database initialization, migration, and management.
"""
import sys
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "app"))

from app.db import create_tables, drop_tables, test_connection, engine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db():
    """Initialize the database by creating all tables."""
    logger.info("Initializing database...")

    if not test_connection():
        logger.error("Database connection failed. Please check your DATABASE_URL.")
        return False

    try:
        create_tables()
        logger.info("Database initialized successfully!")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        return False


def reset_db():
    """Reset the database by dropping and recreating all tables."""
    logger.warning("This will delete ALL data in the database!")
    confirm = input("Are you sure you want to continue? (y/N): ")

    if confirm.lower() != "y":
        logger.info("Database reset cancelled.")
        return False

    logger.info("Resetting database...")

    try:
        drop_tables()
        create_tables()
        logger.info("Database reset successfully!")
        return True
    except Exception as e:
        logger.error(f"Failed to reset database: {e}")
        return False


def check_db():
    """Check database connection and table status."""
    logger.info("Checking database status...")

    # Test connection
    if test_connection():
        logger.info("✓ Database connection successful")
    else:
        logger.error("✗ Database connection failed")
        return False

    # Check tables
    try:
        from sqlalchemy import inspect

        inspector = inspect(engine)
        tables = inspector.get_table_names()

        expected_tables = ["students", "prediction_logs", "batch_uploads"]

        logger.info("Database tables:")
        for table in expected_tables:
            if table in tables:
                logger.info(f"✓ {table} - exists")
            else:
                logger.warning(f"✗ {table} - missing")

        return True
    except Exception as e:
        logger.error(f"Failed to check tables: {e}")
        return False


def main():
    """Main CLI interface."""
    if len(sys.argv) < 2:
        print("Usage: python db_manager.py [command]")
        print("Commands:")
        print("  init    - Initialize database (create tables)")
        print("  reset   - Reset database (drop and recreate tables)")
        print("  check   - Check database status")
        print("  test    - Test database connection")
        return

    command = sys.argv[1].lower()

    if command == "init":
        init_db()
    elif command == "reset":
        reset_db()
    elif command == "check":
        check_db()
    elif command == "test":
        if test_connection():
            logger.info("Database connection successful!")
        else:
            logger.error("Database connection failed!")
    else:
        logger.error(f"Unknown command: {command}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Simple script to create mock student data and seed the database"""

import random
from datetime import datetime, timedelta
import sys
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "app"))

from app.db import SessionLocal, test_connection
from app.models import Student


def create_mock_students(count=50):
    """Create mock student data"""
    students = []
    uploaders = ["admin@university.edu", "registrar@university.edu", "system_import"]

    for i in range(count):
        age = random.randint(18, 45)

        # Create realistic but simple data
        student_data = {
            "age": age,
            "marital_status": random.randint(0, 4),
            "employed": random.choice([True, False]),
            "scholarship": random.choice([True, False]),
            "student_loan": random.choice([True, False]),
            "attendance_score": round(random.uniform(0.3, 1.0), 3),
            "study_mode": random.randint(1, 5),
            "engagement_score": round(random.uniform(0.2, 1.0), 3),
            "repeated_course": round(random.uniform(0, 3), 1),
            "internet_access": random.choice(
                [True, True, True, False]
            ),  # 75% have internet
            "uploaded_by": random.choice(uploaders),
        }

        # Add some risk data for 30% of students
        if random.random() < 0.3:
            risk_score = round(random.uniform(0.1, 0.9), 3)
            if risk_score < 0.3:
                student_data["risk_category"] = "low"
            elif risk_score < 0.7:
                student_data["risk_category"] = "medium"
            else:
                student_data["risk_category"] = "high"
            student_data["risk_score"] = risk_score

            # Random prediction date within last 3 months
            days_ago = random.randint(1, 90)
            student_data["last_prediction_date"] = datetime.now() - timedelta(
                days=days_ago
            )

        students.append(student_data)

    return students


def seed_database(students_data, clear_existing=False):
    """Seed the database with mock student data"""
    print(f" Seeding database with {len(students_data)} students...")

    if not test_connection():
        print(" Database connection failed!")
        return False

    db = SessionLocal()

    try:
        # Clear existing data if requested
        if clear_existing:
            print("  Clearing existing student data...")
            db.query(Student).delete()
            db.commit()
            print(" Existing data cleared")

        # Insert new students
        print(" Inserting students...")
        for i, student_data in enumerate(students_data, 1):
            student = Student(**student_data)
            db.add(student)

            if i % 10 == 0:
                print(f"   Processed {i}/{len(students_data)} students...")

        db.commit()

        # Verify insertion
        total_count = db.query(Student).count()
        print(f" Successfully seeded {len(students_data)} students!")
        print(f" Total students in database: {total_count}")

        return True

    except Exception as e:
        print(f" Error seeding database: {e}")
        db.rollback()
        return False
    finally:
        db.close()


def main():
    """Main function"""
    import argparse

    parser = argparse.ArgumentParser(description="Create and seed mock student data")
    parser.add_argument(
        "--count",
        type=int,
        default=50,
        help="Number of students to create (default: 50)",
    )
    parser.add_argument(
        "--clear", action="store_true", help="Clear existing data first"
    )

    args = parser.parse_args()

    print(f" Creating {args.count} mock students...")

    # Create mock data
    students = create_mock_students(args.count)
    print(f" Generated {len(students)} student records")

    # Seed database
    success = seed_database(students, clear_existing=args.clear)

    if success:
        print(" Mock data seeding completed!")
        print(" Start your API server to fetch the data:")
        print("   cd backend && python -m app.main")
        print("   Then visit: http://localhost:8000/students")
    else:
        print(" Seeding failed!")
        return 1


if __name__ == "__main__":
    main()

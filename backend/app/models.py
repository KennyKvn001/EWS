from sqlalchemy import Column, String, Integer, Boolean, Float, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from uuid import uuid4
from .database.db import Base


class Student(Base):
    """
    SQLAlchemy model for Student table.
    This corresponds to the Student schema in schema.py
    """

    __tablename__ = "students"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)

    # Student demographic information
    age_at_enrollment = Column(Integer, nullable=False, doc="Student age at enrollment")
    gender = Column(String(10), nullable=False, doc="Student gender (male/female)")

    # Academic information
    total_units_approved = Column(Float, nullable=False, doc="Total units approved")
    average_grade = Column(Float, nullable=False, doc="Average grade")
    total_units_evaluated = Column(Float, nullable=False, doc="Total units evaluated")
    total_units_enrolled = Column(Float, nullable=False, doc="Total units enrolled")
    previous_qualification_grade = Column(
        Float, nullable=False, doc="Previous qualification grade"
    )

    # Financial information
    tuition_fees_up_to_date = Column(
        Boolean, nullable=False, default=False, doc="Tuition fees up to date status"
    )
    scholarship_holder = Column(
        Boolean, nullable=False, default=False, doc="Has scholarship"
    )
    debtor = Column(Boolean, nullable=False, default=False, doc="Is a debtor")

    # Metadata
    uploaded_by = Column(String(255), nullable=False, doc="User who uploaded the data")
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        doc="Record creation timestamp",
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        doc="Record update timestamp",
    )

    # Additional fields for ML predictions (optional)
    risk_score = Column(Float, nullable=True, doc="Calculated risk score")
    risk_category = Column(
        String(50), nullable=True, doc="Risk category (low, medium, high)"
    )
    last_prediction_date = Column(
        DateTime(timezone=True), nullable=True, doc="Last prediction timestamp"
    )

    def __repr__(self):
        return f"<Student(id={self.id}, age_at_enrollment={self.age_at_enrollment}, uploaded_by='{self.uploaded_by}')>"

    def to_dict(self):
        """Convert model instance to dictionary"""
        return {
            "id": str(self.id),
            "age_at_enrollment": self.age_at_enrollment,
            "gender": self.gender,
            "total_units_approved": self.total_units_approved,
            "average_grade": self.average_grade,
            "total_units_evaluated": self.total_units_evaluated,
            "total_units_enrolled": self.total_units_enrolled,
            "previous_qualification_grade": self.previous_qualification_grade,
            "tuition_fees_up_to_date": self.tuition_fees_up_to_date,
            "scholarship_holder": self.scholarship_holder,
            "debtor": self.debtor,
            "uploaded_by": self.uploaded_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "risk_score": self.risk_score,
            "risk_category": self.risk_category,
            "last_prediction_date": (
                self.last_prediction_date.isoformat()
                if self.last_prediction_date
                else None
            ),
        }


class PredictionLog(Base):
    """
    SQLAlchemy model for storing prediction logs.
    This table tracks all ML predictions made for students.
    """

    __tablename__ = "prediction_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    student_id = Column(
        UUID(as_uuid=True), nullable=False, index=True, doc="Reference to student"
    )

    # Prediction results
    risk_score = Column(Float, nullable=False, doc="Predicted risk score")
    risk_category = Column(String(50), nullable=False, doc="Risk category")
    confidence_score = Column(Float, nullable=True, doc="Model confidence score")

    # Model information
    model_version = Column(String(50), nullable=True, doc="ML model version used")
    model_features = Column(Text, nullable=True, doc="JSON string of features used")

    # Metadata
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), doc="Prediction timestamp"
    )
    created_by = Column(String(255), nullable=True, doc="User who triggered prediction")

    def __repr__(self):
        return f"<PredictionLog(id={self.id}, student_id={self.student_id}, risk_category='{self.risk_category}')>"


class BatchUpload(Base):
    """
    SQLAlchemy model for tracking batch uploads.
    This table tracks bulk student data uploads.
    """

    __tablename__ = "batch_uploads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)

    # Upload information
    filename = Column(String(255), nullable=True, doc="Original filename")
    total_records = Column(
        Integer, nullable=False, default=0, doc="Total records in batch"
    )
    successful_records = Column(
        Integer, nullable=False, default=0, doc="Successfully processed records"
    )
    failed_records = Column(Integer, nullable=False, default=0, doc="Failed records")

    # Status tracking
    status = Column(
        String(50), nullable=False, default="processing", doc="Upload status"
    )
    error_log = Column(Text, nullable=True, doc="Error messages if any")

    # Metadata
    uploaded_by = Column(String(255), nullable=False, doc="User who uploaded the batch")
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), doc="Upload timestamp"
    )
    completed_at = Column(
        DateTime(timezone=True), nullable=True, doc="Completion timestamp"
    )

    def __repr__(self):
        return f"<BatchUpload(id={self.id}, status='{self.status}', total_records={self.total_records})>"

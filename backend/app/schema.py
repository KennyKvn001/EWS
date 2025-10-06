from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from typing import List


class Student(BaseModel):
    """Student schema with only the required fields"""

    id: UUID = Field(default_factory=uuid4, description="Unique student identifier")
    age: int = Field(..., description="Student age")
    marital_status: int = Field(..., description="Marital status code")
    employed: bool = Field(..., description="Employment status")
    scholarship: bool = Field(..., description="Has scholarship")
    student_loan: bool = Field(..., description="Has student loan")
    attendance_score: float = Field(..., description="Attendance score")
    study_mode: int = Field(..., description="Study mode code")
    internet_access: bool = Field(..., description="Has internet access")
    engagement_score: float = Field(..., description="Engagement score")
    repeated_course: float = Field(..., description="Number of repeated courses")
    uploaded_by: str = Field(..., description="User who uploaded the data")

    class Config:
        from_attributes = True


class StudentCreate(BaseModel):
    """Schema for creating a student"""

    age: int = Field(..., description="Student age")
    marital_status: int = Field(..., description="Marital status code")
    employed: bool = Field(..., description="Employment status")
    scholarship: bool = Field(..., description="Has scholarship")
    student_loan: bool = Field(..., description="Has student loan")
    attendance_score: float = Field(..., description="Attendance score")
    study_mode: int = Field(..., description="Study mode code")
    internet_access: bool = Field(..., description="Has internet access")
    engagement_score: float = Field(..., description="Engagement score")
    repeated_course: float = Field(..., description="Number of repeated courses")
    uploaded_by: str = Field(..., description="User who uploaded the data")


class BatchCreate(BaseModel):
    """Schema for creating multiple students"""

    students: List[StudentCreate] = Field(
        ..., min_items=1, description="List of students to create"
    )

from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from typing import List


class Student(BaseModel):
    """Student schema with only the required fields"""

    id: UUID = Field(default_factory=uuid4, description="Unique student identifier")
    age_at_enrollment: int = Field(..., description="Student age at enrollment")
    gender: str = Field(..., description="Student gender (male/female)")
    total_units_approved: float = Field(..., description="Total units approved")
    average_grade: float = Field(..., description="Average grade")
    total_units_evaluated: float = Field(..., description="Total units evaluated")
    total_units_enrolled: float = Field(..., description="Total units enrolled")
    previous_qualification_grade: float = Field(
        ..., description="Previous qualification grade"
    )
    tuition_fees_up_to_date: bool = Field(
        ..., description="Tuition fees up to date status"
    )
    scholarship_holder: bool = Field(..., description="Has scholarship")
    debtor: bool = Field(..., description="Is a debtor")
    uploaded_by: str = Field(..., description="User who uploaded the data")

    class Config:
        from_attributes = True


class StudentCreate(BaseModel):
    """Schema for creating a student"""

    age_at_enrollment: int = Field(..., description="Student age at enrollment")
    gender: str = Field(..., description="Student gender (male/female)")
    total_units_approved: float = Field(..., description="Total units approved")
    average_grade: float = Field(..., description="Average grade")
    total_units_evaluated: float = Field(..., description="Total units evaluated")
    total_units_enrolled: float = Field(..., description="Total units enrolled")
    previous_qualification_grade: float = Field(
        ..., description="Previous qualification grade"
    )
    tuition_fees_up_to_date: bool = Field(
        ..., description="Tuition fees up to date status"
    )
    scholarship_holder: bool = Field(..., description="Has scholarship")
    debtor: bool = Field(..., description="Is a debtor")
    uploaded_by: str = Field(..., description="User who uploaded the data")


class BatchCreate(BaseModel):
    """Schema for creating multiple students"""

    students: List[StudentCreate] = Field(
        ..., min_items=1, description="List of students to create"
    )

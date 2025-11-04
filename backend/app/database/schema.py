from pydantic import BaseModel, Field, validator
from uuid import UUID, uuid4
from typing import List, Union


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

    class Config:
        from_attributes = True


class PredicitonInput(BaseModel):
    """User-friendly prediction input schema with percentile grades and 0-20 scale for units"""

    total_units_approved: float = Field(
        ..., 
        description="Total units approved (0-20 scale)", 
        ge=0, 
        le=20,
        example=12.0
    )
    
    average_grade: float = Field(
        ...,
        description="Average grade as percentage (0-100)",
        ge=0,
        le=100,
        example=75.0
    )
    
    age_at_enrollment: int = Field(
        ..., 
        description="Student age at enrollment", 
        ge=16, 
        le=65,
        example=20
    )
    
    total_units_evaluated: float = Field(
        ..., 
        description="Total units evaluated (0-20 scale)", 
        ge=0, 
        le=20,
        example=15.0
    )
    
    total_units_enrolled: float = Field(
        ..., 
        description="Total units enrolled (0-20 scale)", 
        ge=0, 
        le=20,
        example=18.0
    )
    
    previous_qualification_grade: float = Field(
        ...,
        description="Previous qualification grade as percentage (0-100)",
        ge=0,
        le=100,
        example=80.0,
        alias="previous_qualification_(grade)"
    )
    
    tuition_fees_up_to_date: Union[bool, int, str] = Field(
        ..., 
        description="Tuition fees up to date - accepts: true/false, 1/0, 'yes'/'no'",
        example=True
    )
    
    scholarship_holder: Union[bool, int, str] = Field(
        ..., 
        description="Has scholarship - accepts: true/false, 1/0, 'yes'/'no'",
        example=False
    )
    
    debtor: Union[bool, int, str] = Field(
        ..., 
        description="Is debtor - accepts: true/false, 1/0, 'yes'/'no'",
        example=False
    )
    
    gender: Union[str, int] = Field(
        ...,
        description="Gender - accepts: 'male'/'female', 'm'/'f', 1/0",
        example="female"
    )

    class Config:
        populate_by_name = True
        schema_extra = {
            "example": {
                "total_units_approved": 12.0,
                "average_grade": 75.0,
                "age_at_enrollment": 20,
                "total_units_evaluated": 15.0,
                "total_units_enrolled": 18.0,
                "previous_qualification_grade": 80.0,
                "tuition_fees_up_to_date": True,
                "scholarship_holder": False,
                "debtor": False,
                "gender": "female"
            }
        }

    @validator('tuition_fees_up_to_date', 'scholarship_holder', 'debtor')
    def validate_boolean_fields(cls, v):
        """Convert various boolean representations to 0/1"""
        if isinstance(v, bool):
            return 1 if v else 0
        elif isinstance(v, int):
            if v in [0, 1]:
                return v
            else:
                raise ValueError("Integer value must be 0 or 1")
        elif isinstance(v, str):
            v_lower = v.lower().strip()
            if v_lower in ['yes', 'y', 'true', '1']:
                return 1
            elif v_lower in ['no', 'n', 'false', '0']:
                return 0
            else:
                raise ValueError("String value must be 'yes'/'no', 'true'/'false', or '1'/'0'")
        else:
            raise ValueError("Value must be boolean, integer (0/1), or string")

    @validator('gender')
    def validate_gender(cls, v):
        """Convert various gender representations to 0/1"""
        if isinstance(v, int):
            if v in [0, 1]:
                return v
            else:
                raise ValueError("Integer value must be 0 (female) or 1 (male)")
        elif isinstance(v, str):
            v_lower = v.lower().strip()
            if v_lower in ['male', 'm', '1']:
                return 1
            elif v_lower in ['female', 'f', '0']:
                return 0
            else:
                raise ValueError("Gender must be 'male'/'female', 'm'/'f', or '1'/'0'")
        else:
            raise ValueError("Gender must be string or integer (0/1)")


class StudentCreate(BaseModel):
    """Schema for creating a student with prediction data"""

    # Student data (using same validation as PredictionInput)
    total_units_approved: float = Field(
        ..., 
        description="Total units approved (0-20 scale)", 
        ge=0, 
        le=20
    )
    
    average_grade: float = Field(
        ...,
        description="Average grade as percentage (0-100)",
        ge=0,
        le=100
    )
    
    age_at_enrollment: int = Field(
        ..., 
        description="Student age at enrollment", 
        ge=16, 
        le=65
    )
    
    total_units_evaluated: float = Field(
        ..., 
        description="Total units evaluated (0-20 scale)", 
        ge=0, 
        le=20
    )
    
    total_units_enrolled: float = Field(
        ..., 
        description="Total units enrolled (0-20 scale)", 
        ge=0, 
        le=20
    )
    
    previous_qualification_grade: float = Field(
        ...,
        description="Previous qualification grade as percentage (0-100)",
        ge=0,
        le=100
    )
    
    tuition_fees_up_to_date: Union[bool, int, str] = Field(
        ..., 
        description="Tuition fees up to date - accepts: true/false, 1/0, 'yes'/'no'"
    )
    
    scholarship_holder: Union[bool, int, str] = Field(
        ..., 
        description="Has scholarship - accepts: true/false, 1/0, 'yes'/'no'"
    )
    
    debtor: Union[bool, int, str] = Field(
        ..., 
        description="Is debtor - accepts: true/false, 1/0, 'yes'/'no'"
    )
    
    gender: Union[str, int] = Field(
        ...,
        description="Gender - accepts: 'male'/'female', 'm'/'f', 1/0"
    )
    
    # Metadata
    uploaded_by: str = Field(
        ..., 
        description="User who is creating this student record",
        example="admin@university.edu"
    )

    # Apply the same validators as PredictionInput
    @validator('tuition_fees_up_to_date', 'scholarship_holder', 'debtor')
    def validate_boolean_fields(cls, v):
        """Convert various boolean representations to 0/1"""
        if isinstance(v, bool):
            return 1 if v else 0
        elif isinstance(v, int):
            if v in [0, 1]:
                return v
            else:
                raise ValueError("Integer value must be 0 or 1")
        elif isinstance(v, str):
            v_lower = v.lower().strip()
            if v_lower in ['yes', 'y', 'true', '1']:
                return 1
            elif v_lower in ['no', 'n', 'false', '0']:
                return 0
            else:
                raise ValueError("String value must be 'yes'/'no', 'true'/'false', or '1'/'0'")
        else:
            raise ValueError("Value must be boolean, integer (0/1), or string")

    @validator('gender')
    def validate_gender(cls, v):
        """Convert various gender representations to 0/1"""
        if isinstance(v, int):
            if v in [0, 1]:
                return v
            else:
                raise ValueError("Integer value must be 0 (female) or 1 (male)")
        elif isinstance(v, str):
            v_lower = v.lower().strip()
            if v_lower in ['male', 'm', '1']:
                return 1
            elif v_lower in ['female', 'f', '0']:
                return 0
            else:
                raise ValueError("Gender must be 'male'/'female', 'm'/'f', or '1'/'0'")
        else:
            raise ValueError("Gender must be string or integer (0/1)")


class StudentWithPrediction(BaseModel):
    """Response schema for student with prediction results"""
    
    # Student data
    id: str = Field(..., description="Student ID")
    age_at_enrollment: int
    gender: str  
    total_units_approved: float
    average_grade: float
    total_units_evaluated: float
    total_units_enrolled: float
    previous_qualification_grade: float
    tuition_fees_up_to_date: bool  
    scholarship_holder: bool
    debtor: bool
    uploaded_by: str
    created_at: str
    
    # Prediction results
    risk_score: float = Field(..., description="Dropout probability (0-1)")
    risk_category: str = Field(..., description="Risk category (low/medium/high)")
    prediction_label: str = Field(..., description="Prediction label (Graduate/Dropout)")
    last_prediction_date: str
    
    class Config:
        from_attributes = True


class BatchCreate(BaseModel):
    """Schema for creating multiple students"""

    students: List[StudentCreate] = Field(
        ..., min_items=1, description="List of students to create"
    )

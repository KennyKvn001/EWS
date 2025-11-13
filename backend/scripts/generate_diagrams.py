#!/usr/bin/env python3
"""
Script to generate ERD and Class Diagrams from the codebase.

This script can generate diagrams using various methods:
1. Print Mermaid syntax (can be used with mermaid.live)
2. Generate PlantUML files
3. Create simple text-based diagrams

Usage:
    python generate_diagrams.py --format mermaid
    python generate_diagrams.py --format plantuml
    python generate_diagrams.py --format text
"""

import argparse
from pathlib import Path
from typing import Dict, List


def generate_erd_mermaid() -> str:
    """Generate ERD in Mermaid format"""
    return """erDiagram
    STUDENTS {
        uuid id PK
        integer age_at_enrollment
        string gender
        float total_units_approved
        float average_grade
        float total_units_evaluated
        float total_units_enrolled
        float previous_qualification_grade
        boolean tuition_fees_up_to_date
        boolean scholarship_holder
        boolean debtor
        string uploaded_by
        timestamp created_at
        timestamp updated_at
        float risk_score
        string risk_category
        timestamp last_prediction_date
    }
    
    PREDICTION_LOGS {
        uuid id PK
        uuid student_id FK
        float risk_score
        string risk_category
        float confidence_score
        string model_version
        text model_features
        timestamp created_at
        string created_by
    }
    
    BATCH_UPLOADS {
        uuid id PK
        string filename
        integer total_records
        integer successful_records
        integer failed_records
        string status
        text error_log
        string uploaded_by
        timestamp created_at
        timestamp completed_at
    }
    
    STUDENTS ||--o{ PREDICTION_LOGS : "has many"
"""


def generate_class_diagram_mermaid() -> str:
    """Generate Class Diagram in Mermaid format"""
    return """classDiagram
    class Student {
        +UUID id
        +int age_at_enrollment
        +str gender
        +float total_units_approved
        +float average_grade
        +float total_units_evaluated
        +float total_units_enrolled
        +float previous_qualification_grade
        +bool tuition_fees_up_to_date
        +bool scholarship_holder
        +bool debtor
        +str uploaded_by
        +datetime created_at
        +datetime updated_at
        +float risk_score
        +str risk_category
        +datetime last_prediction_date
        +to_dict() dict
    }
    
    class PredictionLog {
        +UUID id
        +UUID student_id
        +float risk_score
        +str risk_category
        +float confidence_score
        +str model_version
        +str model_features
        +datetime created_at
        +str created_by
    }
    
    class BatchUpload {
        +UUID id
        +str filename
        +int total_records
        +int successful_records
        +int failed_records
        +str status
        +str error_log
        +str uploaded_by
        +datetime created_at
        +datetime completed_at
    }
    
    class PredictionInput {
        <<Pydantic>>
        +float total_units_approved
        +float average_grade
        +int age_at_enrollment
        +float total_units_evaluated
        +float total_units_enrolled
        +float previous_qualification_grade
        +Union[bool,int,str] tuition_fees_up_to_date
        +Union[bool,int,str] scholarship_holder
        +Union[bool,int,str] debtor
        +Union[str,int] gender
        +validate_boolean_fields()
        +validate_gender()
    }
    
    class StudentCreate {
        <<Pydantic>>
        +float total_units_approved
        +float average_grade
        +int age_at_enrollment
        +float total_units_evaluated
        +float total_units_enrolled
        +float previous_qualification_grade
        +Union[bool,int,str] tuition_fees_up_to_date
        +Union[bool,int,str] scholarship_holder
        +Union[bool,int,str] debtor
        +Union[str,int] gender
        +str uploaded_by
        +validate_boolean_fields()
        +validate_gender()
    }
    
    class PredictionService {
        -object _model
        +predict(user_input: dict) dict
        -_get_model() object
    }
    
    class FastAPIApp {
        +get_students()
        +get_at_risk_students()
        +predict_student()
        +predict_with_xai()
        +create_student_with_prediction()
        +file_upload()
        +health_check()
    }
    
    Student "1" --> "*" PredictionLog : has many
    FastAPIApp --> PredictionService : uses
    FastAPIApp --> Student : manages
    FastAPIApp --> PredictionLog : manages
    PredictionInput <|.. PredictionService : input
    StudentCreate <|.. Student : creates
"""


def generate_erd_plantuml() -> str:
    """Generate ERD in PlantUML format"""
    return """@startuml ERD
!define PK_COLOR #FFAAAA
!define FK_COLOR #AAAAFF

entity Student {
  * id : UUID <<PK>>
  --
  * age_at_enrollment : INTEGER
  * gender : VARCHAR(10)
  * total_units_approved : FLOAT
  * average_grade : FLOAT
  * total_units_evaluated : FLOAT
  * total_units_enrolled : FLOAT
  * previous_qualification_grade : FLOAT
  * tuition_fees_up_to_date : BOOLEAN
  * scholarship_holder : BOOLEAN
  * debtor : BOOLEAN
  * uploaded_by : VARCHAR(255)
  * created_at : TIMESTAMP
  * updated_at : TIMESTAMP
  risk_score : FLOAT
  risk_category : VARCHAR(50)
  last_prediction_date : TIMESTAMP
}

entity PredictionLog {
  * id : UUID <<PK>>
  --
  * student_id : UUID <<FK>>
  * risk_score : FLOAT
  * risk_category : VARCHAR(50)
  confidence_score : FLOAT
  model_version : VARCHAR(50)
  model_features : TEXT
  * created_at : TIMESTAMP
  created_by : VARCHAR(255)
}

entity BatchUpload {
  * id : UUID <<PK>>
  --
  filename : VARCHAR(255)
  * total_records : INTEGER
  * successful_records : INTEGER
  * failed_records : INTEGER
  * status : VARCHAR(50)
  error_log : TEXT
  * uploaded_by : VARCHAR(255)
  * created_at : TIMESTAMP
  completed_at : TIMESTAMP
}

Student ||--o{ PredictionLog
@enduml
"""


def generate_class_diagram_plantuml() -> str:
    """Generate Class Diagram in PlantUML format"""
    return """@startuml ClassDiagram
class Student {
  +UUID id
  +int age_at_enrollment
  +str gender
  +float total_units_approved
  +float average_grade
  +float total_units_evaluated
  +float total_units_enrolled
  +float previous_qualification_grade
  +bool tuition_fees_up_to_date
  +bool scholarship_holder
  +bool debtor
  +str uploaded_by
  +datetime created_at
  +datetime updated_at
  +float risk_score
  +str risk_category
  +datetime last_prediction_date
  +to_dict() dict
}

class PredictionLog {
  +UUID id
  +UUID student_id
  +float risk_score
  +str risk_category
  +float confidence_score
  +str model_version
  +str model_features
  +datetime created_at
  +str created_by
}

class BatchUpload {
  +UUID id
  +str filename
  +int total_records
  +int successful_records
  +int failed_records
  +str status
  +str error_log
  +str uploaded_by
  +datetime created_at
  +datetime completed_at
}

class PredictionInput {
  +float total_units_approved
  +float average_grade
  +int age_at_enrollment
  +float total_units_evaluated
  +float total_units_enrolled
  +float previous_qualification_grade
  +Union[bool,int,str] tuition_fees_up_to_date
  +Union[bool,int,str] scholarship_holder
  +Union[bool,int,str] debtor
  +Union[str,int] gender
  +validate_boolean_fields()
  +validate_gender()
}

class StudentCreate {
  +float total_units_approved
  +float average_grade
  +int age_at_enrollment
  +float total_units_evaluated
  +float total_units_enrolled
  +float previous_qualification_grade
  +Union[bool,int,str] tuition_fees_up_to_date
  +Union[bool,int,str] scholarship_holder
  +Union[bool,int,str] debtor
  +Union[str,int] gender
  +str uploaded_by
  +validate_boolean_fields()
  +validate_gender()
}

class PredictionService {
  -object _model
  +predict(user_input: dict) dict
  -_get_model() object
}

class FastAPIApp {
  +get_students()
  +get_at_risk_students()
  +predict_student()
  +predict_with_xai()
  +create_student_with_prediction()
  +file_upload()
  +health_check()
}

Student "1" --> "*" PredictionLog : has many
FastAPIApp --> PredictionService : uses
FastAPIApp --> Student : manages
FastAPIApp --> PredictionLog : manages
PredictionInput <|.. PredictionService : input
StudentCreate <|.. Student : creates
@enduml
"""


def generate_text_diagram() -> str:
    """Generate a simple text-based diagram"""
    return """
ENTITY RELATIONSHIP DIAGRAM
===========================

STUDENTS (Primary Table)
├── id (UUID, PK)
├── age_at_enrollment (INTEGER)
├── gender (VARCHAR)
├── total_units_approved (FLOAT)
├── average_grade (FLOAT)
├── total_units_evaluated (FLOAT)
├── total_units_enrolled (FLOAT)
├── previous_qualification_grade (FLOAT)
├── tuition_fees_up_to_date (BOOLEAN)
├── scholarship_holder (BOOLEAN)
├── debtor (BOOLEAN)
├── uploaded_by (VARCHAR)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── risk_score (FLOAT)
├── risk_category (VARCHAR)
└── last_prediction_date (TIMESTAMP)
    │
    │ (1:N)
    │
    └──> PREDICTION_LOGS
         ├── id (UUID, PK)
         ├── student_id (UUID, FK -> STUDENTS.id)
         ├── risk_score (FLOAT)
         ├── risk_category (VARCHAR)
         ├── confidence_score (FLOAT)
         ├── model_version (VARCHAR)
         ├── model_features (TEXT)
         ├── created_at (TIMESTAMP)
         └── created_by (VARCHAR)

BATCH_UPLOADS (Independent Table)
├── id (UUID, PK)
├── filename (VARCHAR)
├── total_records (INTEGER)
├── successful_records (INTEGER)
├── failed_records (INTEGER)
├── status (VARCHAR)
├── error_log (TEXT)
├── uploaded_by (VARCHAR)
├── created_at (TIMESTAMP)
└── completed_at (TIMESTAMP)


CLASS DIAGRAM
=============

Backend Classes:
- Student (SQLAlchemy Model)
- PredictionLog (SQLAlchemy Model)
- BatchUpload (SQLAlchemy Model)
- PredictionInput (Pydantic Schema)
- StudentCreate (Pydantic Schema)
- StudentWithPrediction (Pydantic Schema)
- PredictionService (ML Service)
- ExplainabilityService (XAI Service)
- PreprocessService (Data Preprocessing)
- FastAPIApp (API Endpoints)

Relationships:
- Student 1:N PredictionLog
- FastAPIApp uses PredictionService
- FastAPIApp manages Student and PredictionLog
- PredictionService uses PreprocessService
"""


def main():
    parser = argparse.ArgumentParser(
        description="Generate ERD and Class Diagrams for EWSS ML system"
    )
    parser.add_argument(
        "--format",
        choices=["mermaid", "plantuml", "text"],
        default="mermaid",
        help="Output format (default: mermaid)",
    )
    parser.add_argument(
        "--type",
        choices=["erd", "class", "all"],
        default="all",
        help="Diagram type to generate (default: all)",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="docs",
        help="Output directory for files (default: docs)",
    )

    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)

    if args.format == "mermaid":
        if args.type in ["erd", "all"]:
            erd_content = generate_erd_mermaid()
            erd_file = output_dir / "erd_generated.mmd"
            erd_file.write_text(erd_content)
            print(f"✓ Generated ERD: {erd_file}")

        if args.type in ["class", "all"]:
            class_content = generate_class_diagram_mermaid()
            class_file = output_dir / "class_diagram_generated.mmd"
            class_file.write_text(class_content)
            print(f"✓ Generated Class Diagram: {class_file}")

    elif args.format == "plantuml":
        if args.type in ["erd", "all"]:
            erd_content = generate_erd_plantuml()
            erd_file = output_dir / "erd.puml"
            erd_file.write_text(erd_content)
            print(f"✓ Generated ERD: {erd_file}")

        if args.type in ["class", "all"]:
            class_content = generate_class_diagram_plantuml()
            class_file = output_dir / "class_diagram.puml"
            class_file.write_text(class_content)
            print(f"✓ Generated Class Diagram: {class_file}")

    elif args.format == "text":
        text_content = generate_text_diagram()
        text_file = output_dir / "diagrams.txt"
        text_file.write_text(text_content)
        print(f"✓ Generated Text Diagram: {text_file}")
        print("\n" + text_content)

    print("\nTo view Mermaid diagrams:")
    print("  1. Copy content to https://mermaid.live")
    print("  2. Use VS Code with 'Markdown Preview Mermaid Support' extension")
    print("  3. Push to GitHub (auto-renders in markdown)")
    print("\nTo view PlantUML diagrams:")
    print("  1. Use http://www.plantuml.com/plantuml/uml/")
    print("  2. Install PlantUML extension in VS Code")
    print("  3. Use PlantUML command-line tool")


if __name__ == "__main__":
    main()


# Documentation - Diagrams

This directory contains system diagrams including Entity Relationship Diagrams (ERD) and Class Diagrams.

## Files

- `DIAGRAMS.md` - Comprehensive guide with all diagrams and usage instructions
- `erd.mmd` - Standalone ERD in Mermaid format
- `class_diagram_backend.mmd` - Backend class diagram in Mermaid format
- `class_diagram_frontend.mmd` - Frontend class diagram in Mermaid format

## Quick Start

### View Diagrams Online

1. **Mermaid Live Editor**: Go to [mermaid.live](https://mermaid.live)
2. Copy the content from any `.mmd` file
3. Paste into the editor
4. Export as PNG/SVG if needed

### Generate Diagrams Programmatically

Run the Python script to generate diagrams in different formats:

```bash
cd backend
python scripts/generate_diagrams.py --format mermaid
python scripts/generate_diagrams.py --format plantuml
python scripts/generate_diagrams.py --format text
```

### View in VS Code

1. Install the "Markdown Preview Mermaid Support" extension
2. Open `DIAGRAMS.md` in VS Code
3. Use the markdown preview to see rendered diagrams

### View in GitHub

If you push this repository to GitHub, the Mermaid diagrams in `DIAGRAMS.md` will automatically render.

## Diagram Types

### ERD (Entity Relationship Diagram)
Shows the database schema with:
- **STUDENTS** table (main entity)
- **PREDICTION_LOGS** table (prediction history)
- **BATCH_UPLOADS** table (batch operations)
- Relationships between tables

### Class Diagram
Shows the system architecture with:
- **Backend**: SQLAlchemy models, Pydantic schemas, and service classes
- **Frontend**: TypeScript interfaces and service classes
- Relationships and dependencies

## Tools for Creating/Editing Diagrams

1. **Mermaid** (Recommended)
   - Online: [mermaid.live](https://mermaid.live)
   - VS Code Extension: "Markdown Preview Mermaid Support"
   - GitHub: Native support in markdown

2. **PlantUML**
   - Online: [plantuml.com](http://www.plantuml.com/plantuml/uml/)
   - VS Code Extension: "PlantUML"
   - Command-line tool available

3. **Draw.io / diagrams.net**
   - Online: [app.diagrams.net](https://app.diagrams.net)
   - Desktop app available

4. **Database Tools** (for ERD only)
   - pgAdmin (PostgreSQL)
   - DBeaver
   - dbdiagram.io

## Updating Diagrams

When you make changes to the codebase:

1. Update the relevant `.mmd` files
2. Update `DIAGRAMS.md` if needed
3. Regenerate using `generate_diagrams.py` if using automated generation
4. Test the diagrams render correctly in your chosen tool


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.database import SessionLocal
from backend.registry import workflow_registry
from backend.schemas.workflow_schema import WorkflowCreateSchema

router = APIRouter(prefix="/workflows", tags=["Workflows"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_workflow(payload: WorkflowCreateSchema, db: Session = Depends(get_db)):
    return workflow_registry.create_workflow(
        db,
        payload.name,
        payload.definition.dict()
    )


@router.get("/")
def list_workflows(db: Session = Depends(get_db)):
    return workflow_registry.list_workflows(db)
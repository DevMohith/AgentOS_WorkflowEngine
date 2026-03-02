from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.database import SessionLocal
from backend.registry import workflow_registry
from backend.schemas.workflow_schema import WorkflowCreateSchema
from backend.governance.workflow_builder import build_workflow_from_prompt
from backend.agents.llm_planner import generate_workflow
from pydantic import BaseModel

router = APIRouter(prefix="/workflows", tags=["Workflows"])

class LLMWorkflowRequest(BaseModel):
    name: str
    prompt: str

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


@router.post("/generate")
def generate_workflow_via_llm(payload: LLMWorkflowRequest, db: Session = Depends(get_db)):

    workflow = build_workflow_from_prompt(
        db,
        payload.name,
        payload.prompt
    )

    return {
        "workflow_id": workflow.id,
        "definition": workflow.definition
    }
    
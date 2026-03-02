from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.database import SessionLocal
from backend.registry import workflow_registry
from backend.orchestrator.engine import execute_workflow
from backend.db import models
from backend.schemas.run_schema import RunInput, RunResponse, ContextUpdate
from sqlalchemy.orm.attributes import flag_modified

router = APIRouter(prefix="/runs", tags=["Runs"])


# database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# start a new workflow run
@router.post("/{workflow_id}", response_model=RunResponse)
async def run_workflow(
    workflow_id: str,
    input: RunInput,
    db: Session = Depends(get_db)
):

    workflow = workflow_registry.get_workflow(db, workflow_id)

    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    print(f"DEBUG: Found Workflow Name: {workflow.name}")
    
    initial_context = input.model_dump()
    initial_context["workflow_name"] = workflow.name

    run = await execute_workflow(db, workflow, initial_context)

    return format_run_response(run)


# get workflow run status and logs
@router.get("/{run_id}")
def get_run(run_id: str, db: Session = Depends(get_db)):

    run = db.query(models.WorkflowRun).filter(
        models.WorkflowRun.id == run_id
    ).first()

    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    return format_run_response(run)


# resume workflow run (for human approval nodes)
@router.post("/resume/{run_id}", response_model=RunResponse)
async def resume_workflow(run_id: str, db: Session = Depends(get_db)):

    run = db.query(models.WorkflowRun).filter(
        models.WorkflowRun.id == run_id
    ).first()

    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    workflow = workflow_registry.get_workflow(db, run.workflow_id)

    updated_run = await execute_workflow(
        db,
        workflow,
        existing_run=run
    )

    return format_run_response(updated_run)

# laptop procurement context update endpoint
@router.patch("/{run_id}/context", response_model=RunResponse)
def update_context(run_id: str, update: ContextUpdate, db: Session = Depends(get_db)):

    run = db.query(models.WorkflowRun).filter(
        models.WorkflowRun.id == run_id
    ).first()

    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    # Ensure context exists
    if not run.context:
        run.context = {}

    if update.laptop_model:
        run.context["laptop_model"] = update.laptop_model

    # flag mofdified for SQLAlchemy to detect changes in JSON field
    flag_modified(run, "context")

    db.commit()
    db.refresh(run)

    return format_run_response(run)

# Utility function to format run response
def format_run_response(run):
    return {
        "run_id": run.id,
        "workflow_id": run.workflow_id,
        "status": run.status,
        "current_node": run.current_node,
        "logs": run.logs,
        "context": run.context 
    }
    
# runs list view
@router.get("/")
def list_runs(db: Session = Depends(get_db)):
    runs = db.query(models.WorkflowRun).all()

    return [
        {
            "run_id": r.id,
            "workflow_id": r.workflow_id,
            "status": r.status,
            "current_node": r.current_node,
            "context": r.context,
        }
        for r in runs
    ]
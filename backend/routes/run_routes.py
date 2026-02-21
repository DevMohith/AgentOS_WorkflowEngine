from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.database import SessionLocal
from backend.registry import workflow_registry
from backend.orchestrator.engine import execute_workflow
from backend.db import models

router = APIRouter(prefix="/runs", tags=["Runs"])


# ===============================
# DB Dependency
# ===============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===============================
# START WORKFLOW
# ===============================
@router.post("/{workflow_id}")
async def run_workflow(workflow_id: str, db: Session = Depends(get_db)):
    # return {"debug": "This is new code"}
    workflow = workflow_registry.get_workflow(db, workflow_id)

    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")

    run = await execute_workflow(db, workflow)

    return {
        "run_id": run.id,
        "workflow_id": run.workflow_id,
        "status": run.status,
        "current_node": run.current_node,
        "logs": run.logs
    }


# ===============================
# GET RUN STATUS
# ===============================
@router.get("/{run_id}")
def get_run(run_id: str, db: Session = Depends(get_db)):

    run = db.query(models.WorkflowRun).filter(
        models.WorkflowRun.id == run_id
    ).first()

    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    return {
        "run_id": run.id,
        "workflow_id": run.workflow_id,
        "status": run.status,
        "current_node": run.current_node,
        "logs": run.logs
    }


# ===============================
# RESUME AFTER HUMAN APPROVAL
# ===============================
@router.post("/resume/{run_id}")
async def resume_workflow(run_id: str, db: Session = Depends(get_db)):

    run = db.query(models.WorkflowRun).filter(
        models.WorkflowRun.id == run_id
    ).first()

    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    if run.status != "waiting_for_approval":
        raise HTTPException(status_code=400, detail="Run is not waiting for approval")

    workflow = workflow_registry.get_workflow(db, run.workflow_id)

    updated_run = await execute_workflow(db, workflow, existing_run=run)

    return {
        "run_id": updated_run.id,
        "workflow_id": updated_run.workflow_id,
        "status": updated_run.status,
        "current_node": updated_run.current_node,
        "logs": updated_run.logs
    }
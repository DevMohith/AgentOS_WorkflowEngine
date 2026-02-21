from sqlalchemy.orm import Session
from backend.db import models


def create_workflow(db: Session, name: str, definition: dict):
    workflow = models.Workflow(name=name, definition=definition)
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow


def get_workflow(db: Session, workflow_id: str):
    return db.query(models.Workflow).filter(models.Workflow.id == workflow_id).first()


def list_workflows(db: Session):
    return db.query(models.Workflow).all()
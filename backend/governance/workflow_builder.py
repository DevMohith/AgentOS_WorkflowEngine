import json
from sqlalchemy.orm import Session
from backend.registry import workflow_registry
from backend.db import models
from backend.agents.llm_planner import generate_workflow
from backend.governance.workflow_validator import validate_workflow

# yet just probabilistic workflow planner, can be extended over our deterministic engine.
"""It is NOT:

Executing agents

Calling browser automation

Accessing your DB directly

Triggering engine

Making system decisions

It only generates a proposed workflow definition."""

def build_workflow_from_prompt(db: Session, name: str, prompt: str):

    # Check if workflow already exists by name (cache layer to avoid redundant LLM calls)
    existing = db.query(models.Workflow).filter(
        models.Workflow.name == name
    ).first()

    if existing:
        return existing

    # Call LLM
    raw_definition = generate_workflow(prompt)

    try:
        definition_json = json.loads(raw_definition)
        # validates the definition structure and supported nodes before saving to DB
        validate_workflow(definition_json)
        
    except Exception as e:
        raise Exception(f"Workflow validation failed: {str(e)}")

    # Save to DB
    workflow = workflow_registry.create_workflow(
        db,
        name,
        definition_json
    )

    return workflow
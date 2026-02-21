from sqlalchemy.orm import Session
from backend.db import models
from backend.agents.browser_executor import execute_browser_agent


async def execute_workflow(db: Session, workflow: models.Workflow, existing_run=None):

    # If resume → reuse existing run
    if existing_run:
        run = existing_run
        run.status = "running"
        db.commit()
    else:
        run = models.WorkflowRun(
            workflow_id=workflow.id,
            status="running",
            logs=[]
        )
        db.add(run)
        db.commit()
        db.refresh(run)

    definition = workflow.definition
    nodes = definition.get("nodes", [])

    # If resume, skip already executed nodes
    start_index = 0
    if existing_run and run.current_node:
        for i, node in enumerate(nodes):
            if node["id"] == run.current_node:
                start_index = i + 1
                break

    for node in nodes[start_index:]:

        run.current_node = node["id"]
        append_log(run, db, f"Executing node: {node['id']}")

        if node["type"] == "human":
            run.status = "waiting_for_approval"
            append_log(run, db, "Paused for human approval.")
            db.commit()
            return run

        if node["type"] == "agent":
            await execute_agent_node(node, run, db)

    # If loop finishes
    run.status = "completed"
    append_log(run, db, "Workflow completed successfully.")
    db.commit()

    return run


async def execute_agent_node(node: dict, run: models.WorkflowRun, db: Session):

    agent_id = node["id"]

    try:
        if agent_id == "hr":
            append_log(run, db, "Starting HR Agent...")
            execute_browser_agent("hr", {
                "name": "Mohith",
                "role": "Software Engineer"
            })
            append_log(run, db, "HR completed.")

        elif agent_id == "it":
            append_log(run, db, "Starting IT Agent...")
            execute_browser_agent("it", {
                "name": "Mohith"
            })
            append_log(run, db, "IT completed.")
            
        elif agent_id == "procurement":
            append_log(run, db, "Starting Procurement Agent...")
            execute_browser_agent("procurement", {
                "name": "Mohith",
                "laptop_model": "Mac - MacBook Pro"
            })
            append_log(run, db, "Procurement order submitted.")

        else:
            append_log(run, db, f"No executor defined for agent: {agent_id}")

    except Exception as e:
        run.status = "failed"
        append_log(run, db, f"Agent {agent_id} failed: {str(e)}")
        db.commit()
        raise e


def append_log(run: models.WorkflowRun, db: Session, message: str):
    if run.logs is None:
        run.logs = []
    run.logs.append(message)
    db.commit()
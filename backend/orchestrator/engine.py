from sqlalchemy.orm import Session
from backend.db import models
from backend.agents.browser_executor import execute_browser_agent
from sqlalchemy.orm.attributes import flag_modified

async def execute_workflow(db, workflow, context=None, existing_run=None):

    # If resume → reuse existing run
    if existing_run:
        run = existing_run
        run.status = "running"
    else:
        run = models.WorkflowRun(
            workflow_id=workflow.id,
            status="running",
            logs=[],
            context=context or {}
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
                "name": run.context["employee_name"],
                "role": run.context["role"]
            })
            append_log(run, db, "HR completed.")

        elif agent_id == "it":
            append_log(run, db, "Starting IT Agent...")
            execute_browser_agent("it", {
                "name": run.context["employee_name"]
            })
            run.context["it_account_id"] = run.context["employee_name"].lower().replace(" ", ".")
            run.context["it_email"] = f"{run.context['it_account_id']}@agentos.com"
            flag_modified(run, "context")
            append_log(run, db, "IT completed.")
            
        elif agent_id == "procurement":
            append_log(run, db, "Starting Procurement Agent...")
            execute_browser_agent("procurement", {
                "name": run.context["employee_name"],
                "laptop_model": run.context.get("laptop_model", "Windows - Dell XPS")
            })
            run.context["id_card_generated"] = True
            run.context["workspace_allocated"] = "Heidelberg HQ"
            flag_modified(run, "context")
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
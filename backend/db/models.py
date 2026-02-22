from sqlalchemy import Column, String, Text, JSON
from backend.db.database import Base
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    definition = Column(JSON, nullable=False)


class WorkflowRun(Base):
    __tablename__ = "workflow_runs"

    id = Column(String, primary_key=True, default=generate_uuid)
    workflow_id = Column(String, nullable=False)
    status = Column(String, default="running")
    current_node = Column(String, nullable=True)
    logs = Column(JSON, default=[])
    context = Column(JSON, default={})
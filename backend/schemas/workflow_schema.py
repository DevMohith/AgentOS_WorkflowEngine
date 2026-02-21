from pydantic import BaseModel
from typing import List, Dict


class NodeSchema(BaseModel):
    id: str
    type: str
    agent_id: str | None = None


class WorkflowDefinitionSchema(BaseModel):
    nodes: List[NodeSchema]


class WorkflowCreateSchema(BaseModel):
    name: str
    definition: WorkflowDefinitionSchema
from pydantic import BaseModel
from typing import Optional, List


class RunInput(BaseModel):
    employee_name: str
    role: str


class ContextUpdate(BaseModel):
    laptop_model: Optional[str] = None


class RunResponse(BaseModel):
    run_id: str
    workflow_id: str
    status: str
    current_node: Optional[str]
    logs: Optional[List[str]]
    context: Optional[dict]
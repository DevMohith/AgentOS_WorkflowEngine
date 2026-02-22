export interface Workflow {
  id: string;
  name: string;
}

export interface RunContext {
  employee_name?: string;
  role?: string;
  laptop_model?: string;
  it_account_id?: string;
  it_email?: string;
  id_card_generated?: boolean;
  workspace_allocated?: string;
}

export interface RunResponse {
  run_id: string;
  workflow_id: string;
  status: string;
  current_node: string;
  logs: string[];
  context: RunContext;
}
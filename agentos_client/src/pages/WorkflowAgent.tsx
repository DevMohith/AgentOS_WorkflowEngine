import WorkflowCreator from "../components/workflowCreator";
import RunStarter from "../components/RunStarter";
import type { RunResponse } from "../types";

export default function WorkflowAgent() {
  return (
    <div>
      <h1>Workflow Agent</h1>

      <WorkflowCreator />

      <div style={{ marginTop: "30px" }}>
        <RunStarter onRunStarted={(run: RunResponse) => {
          alert(`Run started with ID: ${run.run_id}`);
        }} />
      </div>
    </div>
  );
}
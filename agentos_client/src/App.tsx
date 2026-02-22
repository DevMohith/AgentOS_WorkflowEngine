import RunsDashboard from "./components/RunDashboard";
import WorkflowCreator from "./components/workflowCreator";
import RunStarter from "./components/RunStarter";
import RunMonitor from "./components/RunMonitor";
import { useState } from "react";
import type { RunResponse } from "./types";

export default function App() {
  const [run, setRun] = useState<RunResponse | null>(null);

  return (
    <div>
      <h1>AgentOS Workflow Engine</h1>

      <WorkflowCreator />
      <RunStarter onRunStarted={setRun} />

      <RunsDashboard setRun={setRun} />

      <RunMonitor run={run} setRun={setRun} />
    </div>
  );
}
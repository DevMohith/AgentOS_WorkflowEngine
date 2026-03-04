import { useState } from "react";
import RunsDashboard from "../components/RunDashboard";
import RunMonitor from "../components/RunMonitor";
import type { RunResponse } from "../types";

export default function Runs() {
  const [run, setRun] = useState<RunResponse | null>(null);

  return (
    <div>
      <h1>Workflow Runs</h1>

      <RunsDashboard setRun={setRun} />

      <div style={{ marginTop: "40px" }}>
        <RunMonitor run={run} setRun={setRun} />
      </div>
    </div>
  );
}
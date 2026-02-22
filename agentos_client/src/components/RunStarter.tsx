import { useState } from "react";
import API from "../api/api";
import type { RunResponse } from "../types";

interface Props {
  onRunStarted: (run: RunResponse) => void;
}

export default function RunStarter({ onRunStarted }: Props) {
  const [workflowId, setWorkflowId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const startRun = async () => {
    const res = await API.post(`/runs/${workflowId}`, {
      employee_name: name,
      role,
    });

    onRunStarted(res.data);
  };

  return (
    <div>
      <h2>Start Run</h2>
      <input
        placeholder="Workflow ID"
        value={workflowId}
        onChange={(e) => setWorkflowId(e.target.value)}
      />
      <input
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button onClick={startRun}>Start</button>
    </div>
  );
}
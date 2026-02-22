import { useEffect, useState } from "react";
import API from "../api/api";
import type { RunResponse } from "../types";


interface Props {
  setRun: (run: RunResponse) => void;
}

export default function RunsDashboard({ setRun }: Props) {
  const [runs, setRuns] = useState<RunResponse[]>([]);

  useEffect(() => {
  const loadRuns = async () => {
    try {
      const res = await API.get("/runs/");
      setRuns(res.data);
    } catch (error) {
      console.error("Failed to fetch runs", error);
    }
  };

  loadRuns();
}, []);

  return (
    <div>
      <h2>All Workflow Runs</h2>

      {runs.map((r) => (
        <div
          key={r.run_id}
          style={{
            border: "1px solid gray",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <p><strong>Employee:</strong> {r.context?.employee_name}</p>
          <p>Status: {r.status}</p>
          <p>Current Node: {r.current_node}</p>

          <button onClick={() => setRun(r)}>
            Open
          </button>
        </div>
      ))}
    </div>
  );
}
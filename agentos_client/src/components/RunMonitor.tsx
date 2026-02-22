import type { RunResponse } from "../types";
import API from "../api/api";
import LaptopSelection from "./LaptopSelection";

interface Props {
  run: RunResponse | null;
  setRun: (run: RunResponse) => void;
}

export default function RunMonitor({ run, setRun }: Props) {
  if (!run) {
    return <div>No run started yet</div>;
  }

  const refresh = async () => {
    const res = await API.get(`/runs/${run.run_id}`);
    setRun(res.data);
  };

  const resume = async () => {
    await API.post(`/runs/resume/${run.run_id}`);
    await refresh();
  };

  return (
    <div>
      <h2>Run Monitor</h2>
      <p>Status: {run.status}</p>
      <p>Current Node: {run.current_node}</p>

      {run.status === "waiting_for_approval" &&
        run.current_node === "approval" && (
          <button style={{ color: "green" }} onClick={resume}>
            Approve
          </button>
        )}

      {run.status === "waiting_for_approval" &&
        run.current_node === "laptop_selection" && (
          <LaptopSelection runId={run.run_id} refresh={refresh} />
        )}

      {run.status === "completed" && run.context && (
        <div
          style={{
            border: "2px solid green",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2>✅ Workflow Completed</h2>

          <p><strong>Employee:</strong> {run.context.employee_name}</p>
          <p><strong>Role:</strong> {run.context.role}</p>
          <p><strong>Laptop Ordered:</strong> {run.context.laptop_model}</p>
          <p><strong>IT Account:</strong> {run.context.it_account_id}</p>
          <p><strong>Email:</strong> {run.context.it_email}</p>
          <p><strong>ID Card Generated:</strong> {run.context.id_card_generated ? "Yes" : "No"}</p>
          <p><strong>Workspace:</strong> {run.context.workspace_allocated}</p>
        </div>
      )}
    </div>
  );
}
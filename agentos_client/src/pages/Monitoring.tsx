import { useEffect, useRef, useState } from "react";
import API from "../api/api";
import { useParams } from "react-router-dom";
import type { RunResponse } from "../types";

interface LogEntry {
  timestamp: string;
  message: string;
  level: string;
}

export default function Monitoring() {
  const { runId } = useParams<{ runId: string }>();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [run, setRun] = useState<RunResponse | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔁 Load run state + logs
  const loadRun = async () => {
    if (!runId) return;
    try {
      const res = await API.get(`/runs/${runId}`);
      setRun(res.data);
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Failed to load run:", err);
    }
  };

  useEffect(() => {
    if (!runId) return;

    console.log("Monitoring run:", runId);

    loadRun();

    const ws = new WebSocket(`ws://localhost:8003/ws/logs/${runId}`);

    ws.onopen = () => {
      setConnected(true);
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data: LogEntry = JSON.parse(event.data);
      setLogs((prev) => [...prev, data]);
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, [runId]);

  // 🔽 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!runId) {
    return <div>No Run Selected</div>;
  }

  const resumeWorkflow = async () => {
    if (!runId) return;
    setLoadingAction(true);
    await API.post(`/runs/resume/${runId}`);
    await loadRun();
    setLoadingAction(false);
  };

  const selectLaptop = async (model: string) => {
    if (!runId) return;
    setLoadingAction(true);
    await API.patch(`/runs/${runId}/context`, {
      laptop_model: model,
    });
    await API.post(`/runs/resume/${runId}`);
    await loadRun();
    setLoadingAction(false);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "15px" }}>
        🛰 Workflow Control Center — {runId}
      </h2>

      {/* Status Bar */}
      <div style={{ marginBottom: "20px" }}>
        <span style={{ marginRight: "20px" }}>
          WebSocket:{" "}
          <strong style={{ color: connected ? "#10b981" : "#ef4444" }}>
            {connected ? "LIVE" : "DISCONNECTED"}
          </strong>
        </span>

        {run && (
          <span>
            Run Status:{" "}
            <strong style={{ color: getStatusColor(run.status) }}>
              {run.status.toUpperCase()}
            </strong>
          </span>
        )}
      </div>

      {/* Logs Panel */}
      <div
        style={{
          backgroundColor: "#000",
          padding: "20px",
          borderRadius: "8px",
          fontFamily: "JetBrains Mono, monospace",
          height: "400px",
          overflowY: "auto",
          border: "1px solid #1f2937",
          marginBottom: "25px",
        }}
      >
        {logs.length === 0 && (
          <div style={{ color: "#6b7280" }}>No logs available yet...</div>
        )}

        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <span style={{ color: "#6b7280" }}>
              [{new Date(log.timestamp).toLocaleTimeString()}]
            </span>{" "}
            <span style={{ color: getColor(log.level) }}>
              {log.message}
            </span>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* ACTION PANEL */}

      {run?.status === "waiting_for_approval" &&
        run.current_node === "approval" && (
          <button
            onClick={resumeWorkflow}
            disabled={loadingAction}
            style={actionButtonStyle("#10b981")}
          >
            {loadingAction ? "Processing..." : "Approve"}
          </button>
        )}

      {run?.status === "waiting_for_approval" &&
        run.current_node === "laptop_selection" && (
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => selectLaptop("Windows - Dell XPS")}
              disabled={loadingAction}
              style={actionButtonStyle("#2563eb")}
            >
              Dell XPS
            </button>

            <button
              onClick={() => selectLaptop("Mac - MacBook Pro")}
              disabled={loadingAction}
              style={actionButtonStyle("#f59e0b")}
            >
              MacBook Pro
            </button>
          </div>
        )}

      {run?.status === "completed" && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #10b981",
            backgroundColor: "#0f172a",
          }}
        >
          <h3>✅ Workflow Completed</h3>
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

function getColor(level: string) {
  if (level === "ERROR") return "#ef4444";
  if (level === "WARNING") return "#f59e0b";
  return "#10b981";
}

function getStatusColor(status: string) {
  if (status === "completed") return "#10b981";
  if (status === "waiting_for_approval") return "#f59e0b";
  if (status === "failed") return "#ef4444";
  return "#9ca3af";
}

function actionButtonStyle(color: string) {
  return {
    backgroundColor: color,
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  };
}
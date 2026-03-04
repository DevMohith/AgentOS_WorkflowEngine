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

  // --- Metrics ---
  const totalRuns = runs.length;
  const completedRuns = runs.filter(r => r.status === "completed").length;
  const pendingRuns = runs.filter(r => r.status === "waiting_for_approval").length;
  const failedRuns = runs.filter(r => r.status === "failed").length;

  return (
    <div>
      <h2 style={{ marginBottom: "25px", fontSize: "26px", fontWeight: 700 }}>
        Workflow Execution Dashboard
      </h2>

      {/* ================= METRICS SECTION ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <MetricCard title="Total Runs" value={totalRuns} color="#2563eb" />
        <MetricCard title="Completed" value={completedRuns} color="#10b981" />
        <MetricCard title="Pending for Approval" value={pendingRuns} color="#f59e0b" />
        <MetricCard title="Failed" value={failedRuns} color="#ef4444" />
      </div>

      {/* ================= RUN CARDS ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "25px",
        }}
      >
        {runs.map((r) => (
          <div
            key={r.run_id}
            style={{
              backgroundColor: "#111827",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #1f2937",
              transition: "0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.border = "1px solid #2563eb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.border = "1px solid #1f2937")
            }
          >
            <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>
              {r.context?.employee_name || "Unknown Employee"}
            </div>

            <StatusBadge status={r.status} />

            <div style={{ marginTop: "10px", color: "#9ca3af" }}>
              Agent: {r.current_node}
            </div>

            <button
              style={{
                marginTop: "15px",
                backgroundColor: "#2563eb",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => setRun(r)}
            >
              Inspect Run
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================= METRIC CARD =================
function MetricCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        padding: "20px",
        borderRadius: "10px",
        border: `1px solid ${color}`,
      }}
    >
      <div style={{ fontSize: "14px", color: "#9ca3af" }}>{title}</div>
      <div style={{ fontSize: "28px", fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

// ================= STATUS BADGE =================
function StatusBadge({ status }: { status: string }) {
  let color = "#6b7280";

  if (status === "completed") color = "#10b981";
  if (status === "waiting_for_approval") color = "#f59e0b";
  if (status === "failed") color = "#ef4444";

  return (
    <span
      style={{
        backgroundColor: color,
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
}
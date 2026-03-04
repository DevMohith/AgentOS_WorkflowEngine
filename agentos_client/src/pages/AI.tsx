import { useState } from "react";
import API from "../api/api";

export default function AIWorkflowGenerator() {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [workflowId, setWorkflowId] = useState("");
  const [definition, setDefinition] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<string[]>([]);

  // Add lifecycle event
  const addEvent = (message: string) => {
    setEvents((prev) => [...prev, message]);
  };

  // Save workflow state to session storage
  const saveState = (workflowId: string, definition: any) => {
    sessionStorage.setItem(
      "aiWorkflow",
      JSON.stringify({ workflowId, definition })
    );
  };


  const generateWorkflow = async () => {
    if (!name || !prompt) {
      alert("Please provide both workflow name and prompt");
      return;
    }

    setLoading(true);
    setEvents([]);

    addEvent("🧠 Planning agent received workflow prompt");
    addEvent("⚙️ LLM generating workflow structure");

    try {
      const res = await API.post("/workflows/generate", {
        name,
        prompt,
      });

      addEvent("🔍 Governance validator validating workflow definition");
      addEvent("💾 Storing workflow in registry");

      setWorkflowId(res.data.workflow_id);
      setDefinition(res.data.definition);

      saveState(res.data.workflow_id, res.data.definition);

      addEvent("✅ Workflow successfully generated");
    } catch (error) {
      addEvent("❌ AI Governance Validatior rejected LLM to create workflow definition ");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1
        style={{
          fontSize: "38px",
          fontWeight: 800,
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "40px",
        }}
      >
        AI WORKFLOW GENERATOR
      </h1>

      <p><strong style={{color: "green"}}>Current Active Agentic Nodes</strong>- HR ↠ Approval ↠ IT ↠ Laptop_selection ↠ Procurement</p>
      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            flex: "1 1 500px",
            backgroundColor: "#111827",
            padding: "30px",
            borderRadius: "8px",
            border: "1px solid #1f2937",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>
            Prompt Configuration
          </h3>

          <input
            placeholder="Workflow Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Describe the workflow..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              ...inputStyle,
              height: "160px",
              fontFamily: "JetBrains Mono, monospace",
            }}
          />

          <button
            onClick={generateWorkflow}
            disabled={loading}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: loading ? "#374151" : "#2563eb",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate Workflow"}
          </button>

          {events.length > 0 && (
            <div
              style={{
                marginTop: "25px",
                background: "#0f172a",
                padding: "20px",
                borderRadius: "6px",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "14px",
                border: "1px solid #1f2937",
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>
                Agent Lifecycle
              </h4>

              {events.map((event, i) => (
                <p key={i} style={{ margin: "4px 0", color: "#9ca3af" }}>
                  {event}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            flex: "1 1 500px",
            backgroundColor: "#0a0f1c",
            padding: "30px",
            borderRadius: "8px",
            border: "1px solid #1f2937",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>
            Generated Definition
          </h3>

          {workflowId ? (
            <>
              <p>
                <strong>Workflow ID:</strong> {workflowId}
              </p>

              <pre
                style={{
                  backgroundColor: "#000",
                  color: "#00ffcc",
                  padding: "20px",
                  borderRadius: "6px",
                  overflowX: "auto",
                  fontFamily: "JetBrains Mono, monospace",
                  marginTop: "15px",
                  maxHeight: "400px",
                }}
              >
                {JSON.stringify(definition, null, 2)}
              </pre>
            </>
          ) : (
            <p style={{ color: "#6b7280" }}>
              Workflow definition will appear here...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  backgroundColor: "#0f172a",
  color: "white",
  border: "1px solid #1f2937",
  borderRadius: "6px",
};
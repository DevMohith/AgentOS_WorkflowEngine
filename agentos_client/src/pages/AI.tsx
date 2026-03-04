import { useState, useEffect } from "react";
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
      addEvent("❌ (LLM Objected)AI Governance Validatior rejected the workflow definition ");
      console.error(
        "Failed to generate workflow (or) backend strict validation rules violated:",
        error
      );
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1>Prompt to Workflow Generator - P2P</h1>

      <p style={{ marginBottom: "20px", color: "#aaa" }}>
        Describe your desired workflow in natural language and let the AgentOS
        generate the definition for you
      </p>

      {/* Workflow Name */}
      <input
        placeholder="Workflow Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      {/* Prompt */}
      <textarea
        placeholder="Describe the workflow..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%",
          height: "150px",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      {/* Generate Button */}
      <button
        onClick={generateWorkflow}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          color: "white",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#666" : "#007bff",
        }}
      >
        {loading ? "Generating Workflow..." : "Generate Workflow"}
      </button>

      {/* Loading Indicator */}
      {loading && (
        <p style={{ marginTop: "10px", color: "#aaa" }}>
           AgentOS is designing your workflow...
        </p>
      )}

      {/* Agent Lifecycle */}
      {events.length > 0 && (
        <div
          style={{
            marginTop: "25px",
            background: "#111",
            padding: "20px",
            borderRadius: "6px",
          }}
        >
          <h3>Agent Lifecycle</h3>

          {events.map((event, i) => (
            <p key={i} style={{ color: "#ccc", margin: "4px 0" }}>
              {event}
            </p>
          ))}
        </div>
      )}

      {/* Result */}
      {workflowId && (
        <div style={{ marginTop: "30px" }}>
          <h3>Hey there! Here is the Generated Workflow for you:</h3>

          <p>
            <strong>Workflow ID:</strong> {workflowId}
          </p>

          <pre
            style={{
              backgroundColor: "#333",
              color: "white",
              padding: "20px",
              borderRadius: "6px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(definition, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
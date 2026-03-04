import { useState } from "react";
import API from "../api/api";

type NodeType = {
  id: string;
  type: string;
  agent_id: string | null;
};

type WorkflowDefinition = {
  nodes: NodeType[];
};

export default function WorkflowCreator() {
  const [name, setName] = useState("");

  const [definition, setDefinition] = useState<WorkflowDefinition>({
    nodes: []
  });

  const [workflowId, setWorkflowId] = useState("");

  // Add node from form
  const addNode = () => {
    setDefinition({
      nodes: [
        ...definition.nodes,
        { id: "", type: "agent", agent_id: null }
      ]
    });
  };

  // Update node
  const updateNode = (
    index: number,
    field: keyof NodeType,
    value: string | null
  ) => {
    const updated = [...definition.nodes];
    updated[index] = { ...updated[index], [field]: value };

    setDefinition({ nodes: updated });
  };

  // JSON editor change
  const handleJsonChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setDefinition(parsed);
    } catch {
      // ignore invalid JSON while typing
    }
  };

  // Submit workflow
  const createWorkflow = async () => {
    const payload = {
      name,
      definition
    };

    const res = await API.post("/workflows/", payload);

    setWorkflowId(res.data.id);
  };

  return (
    <div style={{ display: "flex", gap: "40px" }}>
      
      {/* FORM EDITOR */}
      <div style={{ flex: 1 }}>
        <h2>Create Workflow</h2>

        <input
          placeholder="Workflow Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "20px", width: "100%" }}
        />

        <h3>Nodes</h3>

        {definition.nodes.map((node, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <input
              placeholder="Node ID"
              value={node.id}
              onChange={(e) =>
                updateNode(i, "id", e.target.value)
              }
            />

            <select
              value={node.type}
              onChange={(e) =>
                updateNode(i, "type", e.target.value)
              }
            >
              <option value="agent">agent</option>
              <option value="human">human</option>
            </select>

            <input
              placeholder="Agent ID"
              value={node.agent_id ?? ""}
              onChange={(e) =>
                updateNode(i, "agent_id", e.target.value || null)
              }
            />
          </div>
        ))}

        <button onClick={addNode}>Add Node</button>

        <div style={{ marginTop: "20px" }}>
          <button onClick={createWorkflow}>
            Create Workflow
          </button>
        </div>

        {workflowId && (
          <p style={{ marginTop: "20px" }}>
            Workflow Created: {workflowId}
          </p>
        )}
      </div>

      {/* JSON EDITOR */}
      <div style={{ flex: 1 }}>
        <h3>JSON Definition</h3>

        <textarea
          style={{
            width: "100%",
            height: "500px",
            fontFamily: "monospace",
          }}
          value={JSON.stringify(definition, null, 2)}
          onChange={(e) =>
            handleJsonChange(e.target.value)
          }
        />
      </div>
    </div>
  );
}
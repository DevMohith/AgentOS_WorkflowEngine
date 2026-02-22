import { useState } from "react";
import API from "../api/api";

export default function WorkflowCreator() {
    const [name, setName] = useState("");
    const [workflowId, setWorkflowId] = useState("");

    const createWorkflow = async () => {
        const res = await API.post("/workflows/", {
            name,
            definition: {
                nodes: [
                    { id: "hr", type: "agent" },
                    { id: "approval", type: "human" },
                    { id: "it", type: "agent" },
                    { id: "laptop_selection", type: "human" },
                    { id: "procurement", type: "agent" }, 
                ],
            },
        });

        setWorkflowId(res.data.id);
    };

    return (
        <div>
            <h2>Create Workflow</h2>
            <input
                placeholder="Workflow Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={createWorkflow}>Create</button>
            {workflowId && <p>Workflow ID: {workflowId}</p>}
            </div>
        );
        }
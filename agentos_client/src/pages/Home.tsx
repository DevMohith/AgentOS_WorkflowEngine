import { useNavigate } from "react-router-dom";
import workflowImg from "../assets/workflow.png";
import logsImg from "../assets/monitoring.png";
import runsImg from "../assets/Runs.png";
import metricsImg from "../assets/Analytics.png";
import AIIMG from "../assets/AI.png"

export default function Home() {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Workflow Agent",
            description: "Prompt to Workflow Agent definition creation.",
            image: workflowImg,
            route: "/workflow-agent",
        },
        {
            title: "Workflow Runs",
            description: "View and monitor all workflow runs.",
            image: runsImg,
            route: "/runs",
        },
        {
            title: "Monitoring",
            description: "View detailed logs of all workflow runs.",
            image: logsImg,
            route: "/logs",
        },
        {
            title: "AgentOS AI",
            description: "Generate workflow definitions from natural language prompts using AI.",
            image: AIIMG,
            route: "/ai-workflow",
        },
        {
            title: "AgentOS Analytics(Coming Soon)",
            description: "Visualize workflow performance and metrics.",
            image: metricsImg,
            route: "*",
        },
    ];

    return (
        <div>

            <div style={{ maxWidth: "1200px",  }}>
                <h1>Build, Run, and Monitor AI Workflows</h1>

                <p style={{ marginTop: "15px", lineHeight: 1.6 }}>
                    AgentOS provides a centralized platform for creating intelligent workflow
                    agents, automating business processes, and monitoring system execution in
                    real time. Designed for enterprise environments, AgentOS enables teams to
                    manage complex workflows with full transparency and reliability.
                </p>
            </div>
            
            <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "30px",
            }}
            >
                {cards.map((card)=> (
                    <div
                    key={card.title}
                    onClick={() => navigate(card.route)}
                    style={{
                        backgroundColor: "#2e2e2e",
                        padding: "30px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "transform 0.2s",
                        border: "1px solid #444",
                    }}
                    onMouseEnter={(e)=>
                        ((e.currentTarget.style.border="1px solid #4da6ff"),
                        (e.currentTarget.style.transform="translateY(-5px)"))
                    }
                    onMouseLeave={(e) =>
                        ((e.currentTarget.style.border = "1px solid #444"),
                        (e.currentTarget.style.transform = "translateY(0px)"))
                    }
                    >

                <img
                    src={card.image}
                    alt={card.title}
                    style={{ width: "250px", marginBottom: "20px" }}
                />

                <h3 style={{ marginBottom: "10px" }}>{card.title}</h3>
                <p style={{ fontSize: "14px", color: "#aaa" }}>
                  {card.description}
                </p>
            </div>
        ))}
    </div>
</div>
);
}
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Runs from "./pages/Runs";
import WorkflowAgent from "./pages/WorkflowAgent";
import { useState, useEffect } from "react";
import type { NavLinkProps } from "react-router-dom";
import AI from "./pages/AI";
import Monitoring from "./pages/Monitoring";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1e1e1e" : "#f5f5f5";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  return (
    <Router>
      <div style={{ minHeight: "100vh" }}>
        
        {/* Navbar */}
        <nav
          style={{
            display: "flex",
            padding: "20px 40px",
            borderBottom: "1px solid #444",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "25px",
              letterSpacing: "2px",
              lineHeight: 1.1,
              fontWeight: 800,
              marginRight: "200px",
              cursor: "pointer",
            }}
            onClick={() => window.location.href = "/"}
          >
            AgentOS Control Panel
          </h1>

          {/* Links container */}
          <div style={{ display: "flex", gap: "30px" }}>
            <NavLink to="/" style={linkStyle}>Home</NavLink>
            <NavLink to="/runs" style={linkStyle}>Runs</NavLink>
            {/* <NavLink to="/monitoring" style={linkStyle}>Monitoring</NavLink> */}
            <NavLink to="/workflow-agent" style={linkStyle}>Workflow Agent</NavLink>
            <NavLink to="/ai-workflow" style={linkStyle}>P2P AI</NavLink>
          </div>

          {/* Dark mode button */}
          <div style={{ marginLeft: "auto" }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: "6px 12px",
                backgroundColor: darkMode ? "#444" : "#ddd",
                color: darkMode ? "white" : "black",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </nav>

        {/* Pages */}
        <div style={{ padding: "40px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/runs" element={<Runs />} />
            <Route path="/monitoring" element={<MonitoringHome />} />
            <Route path="/monitoring/:runId" element={<Monitoring />} />
            <Route path="/workflow-agent" element={<WorkflowAgent />} />
            <Route path="/ai-workflow" element={<AI/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function MonitoringHome() {
  return <div>Select a run to monitor from dashboard.</div>;
}

const linkStyle: NavLinkProps["style"] = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "#4da6ff" : "inherit",
  fontWeight: isActive ? "bold" : "normal",
});
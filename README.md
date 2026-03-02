**📘 AgentOS: Multi-Agent Enterprise Orchestration Framework**

**🚀 Overview**
AgentOS is a hybrid multi-agent orchestration system that bridges the gap between high-level AI planning and deterministic system execution. It is designed to coordinate autonomous agents across Enterprise Web Portals and Local Windows Operating Systems .

The framework ensures reliability through a Deterministic Execution Layer : while an LLM may suggest actions, only predefined Python executors can interact with the system, eliminating the risk of arbitrary code execution.

---

**🏛 System Architecture**
1. The Architectural Paradigm
AgentOS operates as both a Framework and a Runtime Engine :

As a Framework : It provides the standardized schemas (JSON), base models (SQLAlchemy), and registry patterns that allow developers to build new agents.

As a Runtime Engine : It provides the state machine, process manager, and persistence layer that executes workflows, handles pauses, and recovers from errors.

2. Core Components
Orchestration Brain ( engine.py) : A stateful node iterator that manages the lifecycle of a workflow run. It handles the transition between running, waiting_for_approval, and completed.

State Store ( agentos.db) : A SQLite-backed persistence layer that stores the Shared Context (memory) and detailed logs for every execution step.

Execution Layer ( browser_executor.py) : An isolated environment that launches browsers using Multiprocessing . This bypasses the Windows asynciolimitations and ensures the FastAPI server remains responsive.

Human-in-the-Loop (HITL) : Specialized nodes that pause the engine and wait for an external signal (API call) to resume.


---

**The research is divided into 2 phases **

**PHASE 1**
**--> AgentOS runtime oechestration engine**
1. The Anatomy of a Browser Agent
Unlike a standard API agent (which sends JSON data to a server), a Browser Agent interacts with the Document Object Model (DOM) or the visual screen.

The Controller (LLM/Script) : Receives a goal (eg, "Onboard John Doe in the HR Portal").

The Driver (Playwright/Selenium) : The software that controls the browser instance.In AgentOS, you use Playwright because it is faster and handles modern web apps better.

The Logic (Executors) : Pre-defined functions like _run_hr_flowthat translate high-level commands into specific browser actions like page.click()or page.fill().

2. The Orchestration Cycle 
The "Engine" doesn't just run the agent; it manages its life cycle. In your engine.py, the orchestration follows this pattern:

Context Injection : The engine pulls data from the database (eg, employee_name) and injects it into the agent's payload.

Process Isolation : The engine spawns a new system process for the agent. This is crucial for your thesis because it prevents a "hanging" browser from crashing your entire FastAPI server.

Action Execution : The agent performs his task (eg, filling out the HR form).

State Capture : Once finished, the agent returns a result or updates the shared_context. The engine then marks that "Node" as complete and moves to the next one.

3. Why Use Browser Agents instead of APIs?
<img width="523" height="183" alt="image" src="https://github.com/user-attachments/assets/3630ed23-daeb-40b0-a33c-82b43061e536" />

4. Human-in-the-Loop (HITL) Integration
   A key part of your browser orchestration is the Human Node . If a browser agent encounters an ambiguous situation (eg, the procurement portal asks for a "Laptop Model" that isn't in the database), the engine:

Pauses the browser agent.

Saves the current URL and state to agentos.db.

Waits for you to provide the missing data via an API patch.

Resumes the agent right where it left off.

5. Deterministic Routing (Safety)
One of the "Framework" rules in AgentOS is that the LLM cannot directly control the browser. Instead:

The LLM generates a plan .

The Framework validates the plan against your browser_executor.py.

The Engine executes the validated code. This prevents the "hallucination" where an AI might try to delete a user instead of creating one.





**PHASE 2**
🏛 Phase 2: System Architecture
The Desktop Agent is designed around the Planner-Executor Pattern . Instead of letting an LLM write and execute arbitrary code (which is a high security risk), the system uses Structured Routing .

1. The Decision-Making Flow
User Input : A natural language command (eg, "Clean my Downloads folder and move PDFs to the 'Reports' directory" ).

LLM Planner : Breaks the request into a JSON Action Plan .

Example output: {"action": "move_files", "criteria": ".pdf", "target": "Reports"}

Safe Router : Validates the plan against the Agent Registry . If the action isn't registered (like delete_system32), it is rejected.

Deterministic Executor : The specific Python handler (eg, file_executor.py) performs the actual OS operation using safe libraries like os, shutil, or pathlib.

--- 

🛠 Core Specialized Executors
The Desktop Assistant's power comes from its specialized toolset, designed to handle common Windows productivity tasks:

📁 File System Executor
Manages the "digital workspace." It uses pathlibfor cross-platform security and watchdogto monitor folder changes.

Capabilities : Categorizing files by type/date, bulk renaming, and directory cleanup.

📊 Excel/Data Executor
Unlike a standard LLM that "hallucinates" cell data, this executor uses Pandas and OpenPyXL to read actual objects.

Capabilities : Creating pivot tables, running VLOOKUPs programmatically, and generating charts from raw .xlsxfiles.

Safety : Performs "Health Checks" on spreadsheets before editing to ensure no formulas are accidentally overwritten.

🔗 API/Network Executor
Acts as a bridge for developers. It uses requestsor httpxto test endpoints.

Capabilities : Running a suite of API tests, validating status codes, and saving JSON responses to local logs.

---
🧠 Design Principles: Why it's "Safe AI"
Phase 2 is built to be Deterministic , meaning the same plan always leads to the same outcome.
<img width="536" height="178" alt="image" src="https://github.com/user-attachments/assets/52abedbd-c1aa-44b7-9323-7eeef8912628" />

Gemini said
In your AgentOS framework, Phase 2: Desktop AI Assistant represents a shift from web-based automation to local operating system control. While Phase 1 mimics a user in a browser, Phase 2 behaves as a Power User directly interacting with the Windows environment via CLI and deterministic system calls.

🏛 Phase 2: System Architecture
The Desktop Agent is designed around the Planner-Executor Pattern . Instead of letting an LLM write and execute arbitrary code (which is a high security risk), the system uses Structured Routing .

1. The Decision-Making Flow
User Input : A natural language command (eg, "Clean my Downloads folder and move PDFs to the 'Reports' directory" ).

LLM Planner : Breaks the request into a JSON Action Plan .

Example output: {"action": "move_files", "criteria": ".pdf", "target": "Reports"}

Safe Router : Validates the plan against the Agent Registry . If the action isn't registered (like delete_system32), it is rejected.

Deterministic Executor : The specific Python handler (eg, file_executor.py) performs the actual OS operation using safe libraries like os, shutil, or pathlib.

🛠 Core Specialized Executors
The Desktop Assistant's power comes from its specialized toolset, designed to handle common Windows productivity tasks:

📁 File System Executor
Manages the "digital workspace." It uses pathlibfor cross-platform security and watchdogto monitor folder changes.

Capabilities : Categorizing files by type/date, bulk renaming, and directory cleanup.

📊 Excel/Data Executor
Unlike a standard LLM that "hallucinates" cell data, this executor uses Pandas and OpenPyXL to read actual objects.

Capabilities : Creating pivot tables, running VLOOKUPs programmatically, and generating charts from raw .xlsxfiles.

Safety : Performs "Health Checks" on spreadsheets before editing to ensure no formulas are accidentally overwritten.

🔗 API/Network Executor
Acts as a bridge for developers. It uses requestsor httpxto test endpoints.

Capabilities : Running a suite of API tests, validating status codes, and saving JSON responses to local logs.

🧠 Design Principles: Why it's "Safe AI"
Phase 2 is built to be Deterministic , meaning the same plan always leads to the same outcome.

feature	Uncontrolled Agent (Risky)	AgentOS Desktop Agent (Safe)
Execution	Runs exec()on eval()AI code.	Runs pre-written Python functions.
Permissions	Requires full Admin/Root access.	Runs with user level "Least Privilege."
Feedback	You only see the final result.	Uses Structured Logs to show every step.
Planning	"Black box" reasoning.	Explicit Plan Generation (User can review the JSON).
🧱 Phase 2 Directory Breakdown
This section of your project focuses on the desktop_agent/folder:

Plain text
desktop_agent/
├── cli.py            # Entry point (built with Typer for a professional CLI feel)
├── planner.py        # LLM integration: Converts English → Action JSON
├── router.py         # Logic: Maps JSON actions to the correct Python function
└── executors/        # THE "TOOLS"
    ├── file_executor.py   # File & Folder management
    ├── excel_executor.py  # Spreadsheet automation
    └── api_executor.py    # Programmatic API testing


🎓 Thesis Context: "The Research Contribution"
In your defense, you can emphasize that Phase 2 demonstrates Neuro-Symbolic Integration . You are using the "Neural" power of LLMs for understanding intent and the "Symbolic" power of Python's standard libraries for reliable execution. This architecture solves the "Agentic Reliability Problem" in desktop computing.

Would you like me to help you write the cli.pycode using the Typerlibrary so your Desktop Agent has a beautiful, professional command-line interface?

The Architecture of AI Agents: Planning and Action
This video provides an excellent deep dive into how modern AI agents (like Microsoft's "Agent Mode") plan and execute complex, multi-step tasks across desktop applications like Excel, which aligns perfectly with your Phase 2 objectives.


---

**🛠 Technical Implementations & Windows Optimization**

**The Multiprocessing Bridge**
-On Windows, launching Playwright browsers directly within a async web server often leads to NotImplementedErroror event loop blockages. AgentOS solves this by spawning a dedicated system process for every browser task:

$$\text{FastAPI (Main Process)} \rightarrow \text{multiprocessing.Process()} \rightarrow \text{Playwright (Sync API)}$$

**Shared Context Memory**

Agents communicate through a shared JSON context. For example:

IT Agent creates an account and updates run.context["it_email"].

Orchestrator saves the state using flag_modified(run, "context").

Procurement Agent reads the email from the context to complete a laptop order.

---

🧱 Project Directory Tree
Plain text
AgentOS Workflow Engine/
├── backend/
│   ├── main.py                # Entry point: Configures Windows Selector Policy
│   ├── db/
│   │   ├── database.py        # SQLAlchemy & SQLite Engine
│   │   └── models.py          # Tables: Workflow (Templates), WorkflowRun (Instances)
│   ├── orchestrator/
│   │   └── engine.py          # The "Engine": Handles node execution & HITL logic
│   ├── agents/
│   │   └── browser_executor.py # The "Limbs": Isolated Playwright automation scripts
│   ├── routes/
│   │   ├── run_routes.py      # Execution APIs: Start, Resume, Status
│   │   └── workflow_routes.py # Management APIs: CRUD for workflow definitions
│   └── schemas/               # Pydantic validation (Input/Output/Context)
├── enterprise_suite/          # Mock Enterprise Apps (Ports 3001-3003)
│   ├── hr_portal/             # Employee data entry simulation
│   ├── it_portal/             # Account creation simulation
│   └── procurement_portal/    # Hardware ordering simulation
├── agentos.db                 # Persistent SQLite database
├── docker-compose.yml         # Container Orchestration (Planned)
└── README.md


---

🐳 Deployment (Docker Strategy)
The project is architected for containerization to simplify the management of multiple web portals and the backend engine.

Planned Docker Stack:
Backend Service : Runs the FastAPI engine.

Portal Services : Three lightweight Nginx containers hosting the Enterprise Suite.

Persistence : A mounted volume for agentos.dbto ensure workflow history survives container restarts.

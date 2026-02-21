import asyncio
import sys
from fastapi.middleware.cors import CORSMiddleware

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    
from fastapi import FastAPI
from backend.db.database import Base, engine
from backend.routes import workflow_routes, run_routes

app = FastAPI(title="AgentOS Enterprise Orchestration Engine")

# cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)

app.include_router(workflow_routes.router)
app.include_router(run_routes.router)


@app.get("/")
def root():
    return {"message": "AgentOS Enterprise Engine Running 🚀"}
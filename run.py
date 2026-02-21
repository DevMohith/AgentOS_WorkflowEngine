import asyncio
import sys
import uvicorn
import multiprocessing

if __name__ == "__main__":
    # Required for multiprocessing to work on Windows
    multiprocessing.freeze_support()

    if sys.platform == 'win32':
        # Use Proactor policy as it is the standard for subprocesses on Windows
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    # IMPORTANT: Set reload=False to stop Uvicorn from spawning 
    # conflict-heavy child processes during testing.
    uvicorn.run(
        "backend.main:app", 
        host="127.0.0.1", 
        port=8003, 
        reload=False, 
        loop="asyncio"
    )
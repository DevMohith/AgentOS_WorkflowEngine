from fastapi import APIRouter, WebSocket
from backend.core.websocket_manager import manager

router = APIRouter()

@router.websocket("/ws/logs/{run_id}")
async def websocket_logs(websocket: WebSocket, run_id: str):
    print("WebSocket route hit for run:", run_id)
    await manager.connect(run_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(run_id, websocket)
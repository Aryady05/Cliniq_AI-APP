from collections import defaultdict

from fastapi import WebSocket, WebSocketDisconnect


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, consultation_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[consultation_id].append(websocket)

    def disconnect(self, consultation_id: str, websocket: WebSocket) -> None:
        if websocket in self.active_connections[consultation_id]:
            self.active_connections[consultation_id].remove(websocket)
        if not self.active_connections[consultation_id]:
            self.active_connections.pop(consultation_id, None)

    async def broadcast(self, consultation_id: str, payload: dict) -> None:
        for connection in list(self.active_connections[consultation_id]):
            try:
                await connection.send_json(payload)
            except (WebSocketDisconnect, RuntimeError):
                self.disconnect(consultation_id, connection)


manager = ConnectionManager()

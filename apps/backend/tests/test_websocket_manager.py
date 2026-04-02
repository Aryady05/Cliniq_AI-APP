import pytest
from fastapi import WebSocketDisconnect

from app.websocket.manager import ConnectionManager


class DummyWebSocket:
    def __init__(self, should_fail: bool = False) -> None:
        self.should_fail = should_fail
        self.accepted = False
        self.messages: list[dict] = []

    async def accept(self) -> None:
        self.accepted = True

    async def send_json(self, payload: dict) -> None:
        if self.should_fail:
            raise WebSocketDisconnect()
        self.messages.append(payload)


@pytest.mark.asyncio
async def test_broadcast_removes_stale_connections() -> None:
    manager = ConnectionManager()
    healthy = DummyWebSocket()
    stale = DummyWebSocket(should_fail=True)

    await manager.connect("consult-1", healthy)
    await manager.connect("consult-1", stale)

    await manager.broadcast("consult-1", {"event": "ping"})

    assert healthy.messages == [{"event": "ping"}]
    assert manager.active_connections["consult-1"] == [healthy]


@pytest.mark.asyncio
async def test_disconnect_removes_empty_room() -> None:
    manager = ConnectionManager()
    socket = DummyWebSocket()

    await manager.connect("consult-2", socket)
    manager.disconnect("consult-2", socket)

    assert "consult-2" not in manager.active_connections

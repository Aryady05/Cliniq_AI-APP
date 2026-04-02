from datetime import datetime, timezone
from typing import Any
from uuid import uuid4


class InMemoryStore:
    def __init__(self) -> None:
        self.patients: dict[str, dict[str, Any]] = {}
        self.intakes: dict[str, dict[str, Any]] = {}
        self.consultations: dict[str, dict[str, Any]] = {}
        self.transcripts: dict[str, list[dict[str, Any]]] = {}
        self.notes: dict[str, dict[str, Any]] = {}
        self.reports: dict[str, dict[str, Any]] = {}

    @staticmethod
    def now() -> datetime:
        return datetime.now(timezone.utc)

    @staticmethod
    def new_id() -> str:
        return str(uuid4())


store = InMemoryStore()

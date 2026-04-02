from app.ml.triage_engine import HybridTriageEngine
from app.schemas.triage import TriageInput, TriageResult


class TriageService:
    def __init__(self) -> None:
        self.engine = HybridTriageEngine()

    def assess(self, payload: TriageInput) -> TriageResult:
        return self.engine.score(payload)

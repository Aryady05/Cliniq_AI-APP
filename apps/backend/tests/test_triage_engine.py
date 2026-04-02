from app.ml.triage_engine import HybridTriageEngine
from app.schemas.triage import TriageInput, VitalSigns


def test_critical_triage_for_chest_pain() -> None:
    engine = HybridTriageEngine()

    result = engine.score(
        TriageInput(
            chief_complaint="Severe chest pain with trouble breathing",
            symptoms=["Chest pain", "Shortness of breath"],
            red_flags=["confusion"],
            age=67,
            vitals=VitalSigns(spo2=90, pulse=118),
        )
    )

    assert result.urgency == "critical"
    assert result.triage_score >= 85


def test_low_triage_for_minor_issue() -> None:
    engine = HybridTriageEngine()

    result = engine.score(
        TriageInput(
            chief_complaint="Need medication refill",
            symptoms=["Mild cough"],
            red_flags=[],
            age=30,
        )
    )

    assert result.urgency in {"low", "moderate"}

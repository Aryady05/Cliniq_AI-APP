from datetime import datetime, timezone

from fastapi.testclient import TestClient

from app.main import app


def test_intake_rejects_unknown_patient() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/intake/assess",
            json={
                "patient_id": "missing-patient",
                "chief_complaint": "Persistent headache",
                "symptoms": ["headache"],
                "red_flags": [],
            },
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "Patient not found"


def test_consultation_rejects_unknown_patient() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/consultations",
            json={
                "patient_id": "missing-patient",
                "clinician_id": "clinician-1",
                "department": "general medicine",
            },
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "Patient not found"


def test_transcript_rejects_unknown_consultation() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/consultations/missing-consultation/transcript",
            json={
                "speaker": "doctor",
                "text": "Please describe the pain.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "Consultation not found"


def test_note_generation_rejects_unknown_consultation() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/notes/generate",
            json={
                "patient_id": "missing-patient",
                "consultation_id": "missing-consultation",
                "chief_complaint": "Chest pain",
                "transcript": [],
            },
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "Consultation not found"

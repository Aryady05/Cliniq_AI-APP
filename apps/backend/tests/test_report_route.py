from fastapi.testclient import TestClient

from app.main import app


def test_generate_and_download_report() -> None:
    with TestClient(app) as client:
        patient = client.post(
            "/api/v1/patients",
            json={
                "first_name": "Riya",
                "last_name": "Sen",
                "age": 29,
                "gender": "female",
            },
        ).json()

        consultation = client.post(
            "/api/v1/consultations",
            json={
                "patient_id": patient["id"],
                "clinician_id": "clinician-1",
                "department": "general medicine",
            },
        ).json()

        report = client.post(
            "/api/v1/reports/generate",
            json={
                "patient_id": patient["id"],
                "consultation_id": consultation["id"],
                "patient_name": "Riya Sen",
                "clinician_name": "Clinician One",
                "triage": {
                    "urgency": "moderate",
                    "triage_score": 67,
                    "recommended_route": "Respiratory consult",
                    "rationale": ["Shortness of breath after exertion"],
                    "risk_factors": ["shortness of breath"],
                },
                "notes": {
                    "symptoms": ["Shortness of breath after exertion"],
                    "diagnosis": ["Needs respiratory evaluation"],
                    "prescription": ["Pulse oximetry", "Chest exam"],
                    "notes": ["Patient stable"],
                    "follow_up": ["Follow up within 24 hours"],
                },
            },
        )

        assert report.status_code == 201
        report_id = report.json()["report_id"]

        download = client.get(f"/api/v1/reports/{report_id}/download")

        assert download.status_code == 200
        assert download.headers["content-type"] == "application/pdf"
        assert download.content.startswith(b"%PDF")

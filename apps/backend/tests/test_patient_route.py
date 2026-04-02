from fastapi.testclient import TestClient

from app.main import app


def test_patient_round_trip_persists_across_requests() -> None:
    with TestClient(app) as client:
        create_response = client.post(
            "/api/v1/patients",
            json={
                "first_name": "Aarav",
                "last_name": "Sharma",
                "age": 32,
                "gender": "male",
                "phone": "9999999999",
                "email": "aarav@example.com",
            },
        )

        assert create_response.status_code == 201
        patient_id = create_response.json()["id"]

        fetch_response = client.get(f"/api/v1/patients/{patient_id}")

        assert fetch_response.status_code == 200
        assert fetch_response.json()["id"] == patient_id

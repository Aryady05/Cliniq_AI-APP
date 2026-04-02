from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_login_rejects_unknown_user() -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "someone@example.com", "password": "anything"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_login_rejects_wrong_password() -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "doctor@cliniq.ai", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_login_accepts_demo_user() -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "doctor@cliniq.ai", "password": "doctor123"},
    )

    body = response.json()

    assert response.status_code == 200
    assert body["role"] == "doctor"
    assert body["token_type"] == "bearer"
    assert body["access_token"]

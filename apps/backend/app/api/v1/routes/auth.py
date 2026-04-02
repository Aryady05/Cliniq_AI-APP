from secrets import compare_digest

from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter()

# Local-only demo users until real user persistence is wired in.
DEMO_USERS = {
    "doctor@cliniq.ai": {"password": "doctor123", "role": "doctor"},
    "admin@admin.cliniq.ai": {"password": "admin123", "role": "admin"},
    "desk@reception.cliniq.ai": {"password": "desk123", "role": "reception"},
}


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    if not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required",
        )

    user = DEMO_USERS.get(str(payload.email).lower())
    if user is None or not compare_digest(payload.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    role = user["role"]
    token = create_access_token(str(payload.email).lower(), {"role": role})
    return TokenResponse(access_token=token, role=role)

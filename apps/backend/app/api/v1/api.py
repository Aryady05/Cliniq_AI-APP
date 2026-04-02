from fastapi import APIRouter

from app.api.v1.routes import auth, consultations, health, intake, notes, patients, reports, triage

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(intake.router, prefix="/intake", tags=["intake"])
api_router.include_router(triage.router, prefix="/triage", tags=["triage"])
api_router.include_router(
    consultations.router, prefix="/consultations", tags=["consultations"]
)
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])

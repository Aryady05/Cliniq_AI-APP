from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.intake import IntakeCreate, IntakeResponse
from app.services.patient_service import PatientService
from app.services.intake_service import IntakeService

router = APIRouter()
intake_service = IntakeService()
patient_service = PatientService()


@router.post("/assess", response_model=IntakeResponse, status_code=status.HTTP_201_CREATED)
async def assess_intake(
    payload: IntakeCreate, session: AsyncSession = Depends(get_db_session)
) -> IntakeResponse:
    if not await patient_service.exists(session, payload.patient_id):
        raise HTTPException(status_code=404, detail="Patient not found")
    return await intake_service.create_intake(session, payload)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.patient import PatientCreate, PatientResponse
from app.services.patient_service import PatientService

router = APIRouter()
patient_service = PatientService()


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    payload: PatientCreate, session: AsyncSession = Depends(get_db_session)
) -> PatientResponse:
    return await patient_service.create_patient(session, payload)


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: str, session: AsyncSession = Depends(get_db_session)
) -> PatientResponse:
    patient = await patient_service.get_patient(session, patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    return patient

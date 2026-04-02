from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientResponse


class PatientService:
    async def create_patient(
        self, session: AsyncSession, payload: PatientCreate
    ) -> PatientResponse:
        patient = Patient(**payload.model_dump())
        session.add(patient)
        await session.commit()
        await session.refresh(patient)
        return PatientResponse.model_validate(patient)

    async def get_patient(
        self, session: AsyncSession, patient_id: str
    ) -> PatientResponse | None:
        patient = await session.scalar(select(Patient).where(Patient.id == patient_id))
        if patient is None:
            return None
        return PatientResponse.model_validate(patient)

    async def exists(self, session: AsyncSession, patient_id: str) -> bool:
        patient = await session.scalar(select(Patient.id).where(Patient.id == patient_id))
        return patient is not None

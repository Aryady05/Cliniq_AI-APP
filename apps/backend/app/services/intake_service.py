from sqlalchemy.ext.asyncio import AsyncSession

from app.models.intake import IntakeSession
from app.models.triage import TriageAssessment
from app.schemas.intake import IntakeCreate, IntakeResponse
from app.schemas.triage import TriageInput
from app.services.triage_service import TriageService


class IntakeService:
    def __init__(self) -> None:
        self.triage_service = TriageService()

    async def create_intake(
        self, session: AsyncSession, payload: IntakeCreate
    ) -> IntakeResponse:
        triage = self.triage_service.assess(
            TriageInput(
                patient_id=payload.patient_id,
                chief_complaint=payload.chief_complaint,
                symptoms=payload.symptoms,
                red_flags=payload.red_flags,
                symptom_onset=payload.symptom_onset,
                vitals=payload.vitals,
            )
        )

        intake = IntakeSession(
            patient_id=payload.patient_id,
            chief_complaint=payload.chief_complaint,
            symptoms=payload.symptoms,
            red_flags=payload.red_flags,
            symptom_onset=payload.symptom_onset,
            notes=payload.notes,
            vitals=payload.vitals.model_dump() if payload.vitals else {},
        )
        session.add(intake)
        await session.flush()

        assessment = TriageAssessment(
            intake_id=intake.id,
            patient_id=payload.patient_id,
            urgency=triage.urgency,
            triage_score=triage.triage_score,
            recommended_route=triage.recommended_route,
            rationale=triage.rationale,
            risk_factors=triage.risk_factors,
        )
        session.add(assessment)
        await session.commit()

        return IntakeResponse(
            intake_id=intake.id,
            patient_id=payload.patient_id,
            notes=payload.notes,
            triage=triage,
        )

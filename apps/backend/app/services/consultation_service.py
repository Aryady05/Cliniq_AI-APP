from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.consultation import Consultation, TranscriptChunk
from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationResponse,
    TranscriptChunkCreate,
    TranscriptChunkResponse,
)


class ConsultationService:
    async def create_consultation(
        self, session: AsyncSession, payload: ConsultationCreate
    ) -> ConsultationResponse:
        consultation = Consultation(
            patient_id=payload.patient_id,
            clinician_id=payload.clinician_id,
            department=payload.department,
            status="active",
        )
        session.add(consultation)
        await session.commit()
        await session.refresh(consultation)
        return ConsultationResponse.model_validate(consultation)

    async def add_transcript_chunk(
        self, session: AsyncSession, consultation_id: str, payload: TranscriptChunkCreate
    ) -> TranscriptChunkResponse:
        chunk = TranscriptChunk(
            consultation_id=consultation_id,
            speaker=payload.speaker,
            text=payload.text,
            timestamp=payload.timestamp,
        )
        session.add(chunk)
        await session.commit()
        await session.refresh(chunk)
        return TranscriptChunkResponse.model_validate(chunk)

    async def exists(self, session: AsyncSession, consultation_id: str) -> bool:
        consultation = await session.scalar(
            select(Consultation.id).where(Consultation.id == consultation_id)
        )
        return consultation is not None

    async def get_transcript_text(
        self, session: AsyncSession, consultation_id: str
    ) -> list[str]:
        chunks = (
            await session.scalars(
                select(TranscriptChunk)
                .where(TranscriptChunk.consultation_id == consultation_id)
                .order_by(TranscriptChunk.timestamp.asc())
            )
        ).all()
        return [f"{chunk.speaker}: {chunk.text}" for chunk in chunks]

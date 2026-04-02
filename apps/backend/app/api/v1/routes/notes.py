from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.notes import NoteGenerationRequest, NoteGenerationResponse
from app.services.consultation_service import ConsultationService
from app.services.note_service import NoteService

router = APIRouter()
note_service = NoteService()
consultation_service = ConsultationService()


@router.post("/generate", response_model=NoteGenerationResponse)
async def generate_notes(
    payload: NoteGenerationRequest, session: AsyncSession = Depends(get_db_session)
) -> NoteGenerationResponse:
    if not await consultation_service.exists(session, payload.consultation_id):
        raise HTTPException(status_code=404, detail="Consultation not found")
    if not payload.transcript:
        payload = payload.model_copy(
            update={
                "transcript": await consultation_service.get_transcript_text(
                    session,
                    payload.consultation_id
                )
            }
        )
    response = note_service.generate_note(payload)
    await note_service.persist_note(session, payload, response)
    return response

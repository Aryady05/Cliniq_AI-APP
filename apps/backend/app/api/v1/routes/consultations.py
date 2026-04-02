from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationResponse,
    TranscriptChunkCreate,
    TranscriptChunkResponse,
)
from app.services.consultation_service import ConsultationService
from app.services.patient_service import PatientService
from app.websocket.manager import manager

router = APIRouter()
consultation_service = ConsultationService()
patient_service = PatientService()


@router.post("", response_model=ConsultationResponse, status_code=status.HTTP_201_CREATED)
async def create_consultation(
    payload: ConsultationCreate, session: AsyncSession = Depends(get_db_session)
) -> ConsultationResponse:
    if not await patient_service.exists(session, payload.patient_id):
        raise HTTPException(status_code=404, detail="Patient not found")
    return await consultation_service.create_consultation(session, payload)


@router.post(
    "/{consultation_id}/transcript",
    response_model=TranscriptChunkResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_transcript_chunk(
    consultation_id: str,
    payload: TranscriptChunkCreate,
    session: AsyncSession = Depends(get_db_session),
) -> TranscriptChunkResponse:
    if not await consultation_service.exists(session, consultation_id):
        raise HTTPException(status_code=404, detail="Consultation not found")
    chunk = await consultation_service.add_transcript_chunk(
        session, consultation_id, payload
    )
    await manager.broadcast(
        consultation_id,
        {"event": "transcript.chunk", "data": chunk.model_dump(mode="json")},
    )
    return chunk


@router.websocket("/ws/{consultation_id}")
async def consultation_websocket(websocket: WebSocket, consultation_id: str) -> None:
    await manager.connect(consultation_id, websocket)
    try:
        while True:
            message = await websocket.receive_text()
            await manager.broadcast(
                consultation_id,
                {"event": "heartbeat", "message": message},
            )
    except WebSocketDisconnect:
        manager.disconnect(consultation_id, websocket)

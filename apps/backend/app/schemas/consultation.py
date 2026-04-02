from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.common import BaseSchema


Speaker = Literal["doctor", "patient", "nurse", "system"]


class ConsultationCreate(BaseModel):
    patient_id: str
    clinician_id: str
    department: str


class ConsultationResponse(BaseSchema):
    id: str
    patient_id: str
    clinician_id: str
    department: str
    status: str
    created_at: datetime


class TranscriptChunkCreate(BaseModel):
    speaker: Speaker
    text: str = Field(min_length=1)
    timestamp: datetime


class TranscriptChunkResponse(TranscriptChunkCreate, BaseSchema):
    id: str
    consultation_id: str

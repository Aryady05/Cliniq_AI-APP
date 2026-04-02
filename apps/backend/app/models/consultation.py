from datetime import datetime
import uuid

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class Consultation(TimestampMixin, Base):
    __tablename__ = "consultations"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    clinician_id: Mapped[str] = mapped_column(String(100), index=True)
    department: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(30), default="active")


class TranscriptChunk(TimestampMixin, Base):
    __tablename__ = "transcript_chunks"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    consultation_id: Mapped[str] = mapped_column(
        ForeignKey("consultations.id"), index=True
    )
    speaker: Mapped[str] = mapped_column(String(20))
    text: Mapped[str] = mapped_column(Text)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True))

import uuid

from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class ClinicalNote(TimestampMixin, Base):
    __tablename__ = "clinical_notes"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    consultation_id: Mapped[str] = mapped_column(
        ForeignKey("consultations.id"), index=True
    )
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    source: Mapped[str] = mapped_column(String(50), default="gemini")
    model_name: Mapped[str] = mapped_column(String(100))
    symptoms: Mapped[list[str]] = mapped_column(JSON, default=list)
    diagnosis: Mapped[list[str]] = mapped_column(JSON, default=list)
    prescription: Mapped[list[str]] = mapped_column(JSON, default=list)
    notes: Mapped[list[str]] = mapped_column(JSON, default=list)
    follow_up: Mapped[list[str]] = mapped_column(JSON, default=list)

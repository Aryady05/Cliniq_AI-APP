import uuid

from sqlalchemy import JSON, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class IntakeSession(TimestampMixin, Base):
    __tablename__ = "intake_sessions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    chief_complaint: Mapped[str] = mapped_column(Text)
    symptoms: Mapped[list[str]] = mapped_column(JSON, default=list)
    red_flags: Mapped[list[str]] = mapped_column(JSON, default=list)
    symptom_onset: Mapped[str | None] = mapped_column(String(100), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    vitals: Mapped[dict] = mapped_column(JSON, default=dict)

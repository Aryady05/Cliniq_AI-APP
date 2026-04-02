import uuid

from sqlalchemy import JSON, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class TriageAssessment(TimestampMixin, Base):
    __tablename__ = "triage_assessments"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    intake_id: Mapped[str | None] = mapped_column(
        ForeignKey("intake_sessions.id"), nullable=True, index=True
    )
    patient_id: Mapped[str | None] = mapped_column(
        ForeignKey("patients.id"), nullable=True, index=True
    )
    urgency: Mapped[str] = mapped_column(String(20), index=True)
    triage_score: Mapped[int] = mapped_column(Integer)
    recommended_route: Mapped[str] = mapped_column(String(255))
    rationale: Mapped[list[str]] = mapped_column(JSON, default=list)
    risk_factors: Mapped[list[str]] = mapped_column(JSON, default=list)

import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class MedicalReport(TimestampMixin, Base):
    __tablename__ = "medical_reports"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    consultation_id: Mapped[str] = mapped_column(
        ForeignKey("consultations.id"), index=True
    )
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    file_path: Mapped[str] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(50), default="generated")

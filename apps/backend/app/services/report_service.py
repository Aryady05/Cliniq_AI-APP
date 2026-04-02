from pathlib import Path
from uuid import uuid4

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.report import MedicalReport
from app.schemas.report import ReportRequest, ReportResponse


class ReportService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def generate_report(
        self, session: AsyncSession, payload: ReportRequest
    ) -> ReportResponse:
        output_dir = Path(self.settings.pdf_output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        report_id = str(uuid4())
        file_path = output_dir / f"{report_id}.pdf"

        pdf = canvas.Canvas(str(file_path), pagesize=A4)
        width, height = A4
        y = height - 50

        for line in [
            "Cliniq AI Medical Report",
            f"Patient: {payload.patient_name}",
            f"Clinician: {payload.clinician_name}",
            f"Triage: {payload.triage.urgency} ({payload.triage.triage_score})",
            f"Recommended route: {payload.triage.recommended_route}",
            "",
            "Symptoms:",
            *payload.notes.symptoms,
            "",
            "Diagnosis:",
            *payload.notes.diagnosis,
            "",
            "Prescription:",
            *payload.notes.prescription,
            "",
            "Clinical Notes:",
            *payload.notes.notes,
            "",
            "Follow up:",
            *payload.notes.follow_up,
        ]:
            pdf.drawString(40, y, line[:110])
            y -= 18
            if y < 50:
                pdf.showPage()
                y = height - 50

        pdf.save()

        response = ReportResponse(
            report_id=report_id,
            file_path=str(file_path),
            status="generated",
        )
        report = MedicalReport(
            id=report_id,
            consultation_id=payload.consultation_id,
            patient_id=payload.patient_id,
            file_path=str(file_path),
            status="generated",
        )
        session.add(report)
        await session.commit()
        return response

    async def get_report_file_path(
        self, session: AsyncSession, report_id: str
    ) -> Path | None:
        report = await session.scalar(
            select(MedicalReport).where(MedicalReport.id == report_id)
        )
        if report is None:
            return None

        file_path = Path(report.file_path)
        if not file_path.is_absolute():
            file_path = Path.cwd() / file_path

        return file_path if file_path.exists() else None

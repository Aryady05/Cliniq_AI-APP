from pydantic import BaseModel

from app.schemas.notes import ClinicalSections
from app.schemas.triage import TriageResult


class ReportRequest(BaseModel):
    patient_id: str
    consultation_id: str
    patient_name: str
    clinician_name: str
    triage: TriageResult
    notes: ClinicalSections


class ReportResponse(BaseModel):
    report_id: str
    file_path: str
    status: str

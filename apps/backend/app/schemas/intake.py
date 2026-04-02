from pydantic import BaseModel, Field

from app.schemas.triage import TriageResult, VitalSigns


class IntakeCreate(BaseModel):
    patient_id: str
    chief_complaint: str = Field(min_length=5)
    symptoms: list[str] = Field(default_factory=list)
    red_flags: list[str] = Field(default_factory=list)
    symptom_onset: str | None = None
    notes: str | None = None
    vitals: VitalSigns | None = None


class IntakeResponse(BaseModel):
    intake_id: str
    patient_id: str
    triage: TriageResult
    notes: str | None = None

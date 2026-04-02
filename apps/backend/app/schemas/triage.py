from typing import Literal

from pydantic import BaseModel, Field


UrgencyLevel = Literal["low", "moderate", "high", "critical"]


class VitalSigns(BaseModel):
    systolic_bp: int | None = None
    diastolic_bp: int | None = None
    pulse: int | None = None
    spo2: int | None = None
    temperature_c: float | None = None


class TriageInput(BaseModel):
    patient_id: str | None = None
    chief_complaint: str = Field(min_length=5)
    symptoms: list[str] = Field(default_factory=list)
    red_flags: list[str] = Field(default_factory=list)
    vitals: VitalSigns | None = None
    symptom_onset: str | None = None
    age: int | None = Field(default=None, ge=0, le=120)


class TriageResult(BaseModel):
    urgency: UrgencyLevel
    triage_score: int = Field(ge=0, le=100)
    recommended_route: str
    rationale: list[str]
    risk_factors: list[str]

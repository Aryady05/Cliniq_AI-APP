from pydantic import BaseModel, Field


class ClinicalSections(BaseModel):
    symptoms: list[str] = Field(default_factory=list)
    diagnosis: list[str] = Field(default_factory=list)
    prescription: list[str] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)
    follow_up: list[str] = Field(default_factory=list)


class NoteGenerationRequest(BaseModel):
    patient_id: str
    consultation_id: str
    transcript: list[str] = Field(default_factory=list)
    chief_complaint: str


class NoteGenerationResponse(BaseModel):
    patient_id: str
    consultation_id: str
    draft: ClinicalSections
    source: str
    model: str

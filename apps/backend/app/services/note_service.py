from sqlalchemy.ext.asyncio import AsyncSession

from app.models.note import ClinicalNote
from app.core.config import get_settings
from app.schemas.notes import ClinicalSections, NoteGenerationRequest, NoteGenerationResponse
from app.services.gemini_service import GeminiService


class NoteService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.gemini_service = GeminiService()

    @staticmethod
    def _fallback_sections(payload: NoteGenerationRequest) -> ClinicalSections:
        transcript_blob = " ".join(payload.transcript).lower()
        symptoms = [payload.chief_complaint]
        diagnosis = ["Requires clinician review"]
        prescription = ["Pending doctor confirmation"]
        notes = ["Generated from fallback parser because Gemini was unavailable"]
        follow_up = ["Monitor symptoms and escalate if they worsen"]

        if "chest" in transcript_blob or "breath" in transcript_blob:
            symptoms.append("Possible cardiopulmonary concern")
            diagnosis = ["Rule out acute cardiopulmonary event"]
            prescription = ["ECG / vitals / immediate physician review"]

        return ClinicalSections(
            symptoms=symptoms,
            diagnosis=diagnosis,
            prescription=prescription,
            notes=notes,
            follow_up=follow_up,
        )

    def generate_note(self, payload: NoteGenerationRequest) -> NoteGenerationResponse:
        prompt = (
            "You are a medical documentation assistant. "
            "Return structured JSON with keys symptoms, diagnosis, prescription, notes, follow_up. "
            "Use concise clinical phrasing only.\n\n"
            f"Chief complaint: {payload.chief_complaint}\n"
            f"Transcript:\n" + "\n".join(payload.transcript)
        )

        source = "fallback"
        sections = self._fallback_sections(payload)

        if self.gemini_service.enabled:
            try:
                sections = self.gemini_service.extract_sections(prompt)
                source = "gemini"
            except Exception:
                source = "fallback"

        response = NoteGenerationResponse(
            patient_id=payload.patient_id,
            consultation_id=payload.consultation_id,
            draft=sections,
            source=source,
            model=self.settings.gemini_model,
        )
        return response

    async def persist_note(
        self,
        session: AsyncSession,
        payload: NoteGenerationRequest,
        response: NoteGenerationResponse,
    ) -> None:
        note = ClinicalNote(
            consultation_id=payload.consultation_id,
            patient_id=payload.patient_id,
            source=response.source,
            model_name=response.model,
            symptoms=response.draft.symptoms,
            diagnosis=response.draft.diagnosis,
            prescription=response.draft.prescription,
            notes=response.draft.notes,
            follow_up=response.draft.follow_up,
        )
        session.add(note)
        await session.commit()

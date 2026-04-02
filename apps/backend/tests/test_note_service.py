from app.schemas.notes import NoteGenerationRequest
from app.services.note_service import NoteService


def test_note_service_fallback_generates_sections() -> None:
    service = NoteService()

    result = service.generate_note(
        NoteGenerationRequest(
            patient_id="patient-1",
            consultation_id="consult-1",
            chief_complaint="Chest pain on exertion",
            transcript=[
                "doctor: Tell me about the pain",
                "patient: I feel chest pressure and shortness of breath",
            ],
        )
    )

    assert result.draft.symptoms
    assert result.model

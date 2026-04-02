from fastapi import APIRouter

from app.schemas.triage import TriageInput, TriageResult
from app.services.triage_service import TriageService

router = APIRouter()
triage_service = TriageService()


@router.post("/score", response_model=TriageResult)
async def score_triage(payload: TriageInput) -> TriageResult:
    return triage_service.assess(payload)

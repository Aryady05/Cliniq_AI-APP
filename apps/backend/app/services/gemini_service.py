from typing import Any

from google import genai
from tenacity import retry, stop_after_attempt, wait_fixed

from app.core.config import get_settings
from app.schemas.notes import ClinicalSections


class GeminiService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.enabled = bool(self.settings.gemini_api_key)
        self.client = (
            genai.Client(api_key=self.settings.gemini_api_key) if self.enabled else None
        )

    @retry(stop=stop_after_attempt(2), wait=wait_fixed(1))
    def extract_sections(self, prompt: str) -> ClinicalSections:
        if not self.enabled or self.client is None:
            raise RuntimeError("Gemini is not configured")

        response = self.client.models.generate_content(
            model=self.settings.gemini_model,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": ClinicalSections,
            },
        )

        parsed: Any = getattr(response, "parsed", None)
        if isinstance(parsed, ClinicalSections):
            return parsed
        if isinstance(parsed, dict):
            return ClinicalSections.model_validate(parsed)
        raise ValueError("Gemini response could not be parsed into ClinicalSections")

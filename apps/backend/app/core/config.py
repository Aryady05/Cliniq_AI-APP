from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="Cliniq AI Backend", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    app_debug: bool = Field(default=True, alias="APP_DEBUG")
    api_v1_prefix: str = Field(default="/api/v1", alias="API_V1_PREFIX")

    secret_key: str = Field(default="change-me", alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(
        default=1440, alias="ACCESS_TOKEN_EXPIRE_MINUTES"
    )

    database_url: str = Field(
        default="sqlite+aiosqlite:///./cliniq_ai.db",
        alias="DATABASE_URL",
    )
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")

    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-2.5-flash", alias="GEMINI_MODEL")
    gemini_timeout_seconds: int = Field(default=30, alias="GEMINI_TIMEOUT_SECONDS")

    msg91_auth_key: str = Field(default="", alias="MSG91_AUTH_KEY")
    msg91_sender_id: str = Field(default="CLINIQ", alias="MSG91_SENDER_ID")

    default_region: str = Field(default="IN", alias="DEFAULT_REGION")
    pdf_output_dir: Path = Field(default=Path("generated_reports"), alias="PDF_OUTPUT_DIR")
    cors_allowed_origins: list[str] = Field(
        default_factory=lambda: ["http://127.0.0.1:5173", "http://localhost:5173"],
        alias="CORS_ALLOWED_ORIGINS",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        populate_by_name=True,
    )

    @field_validator("cors_allowed_origins", mode="before")
    @classmethod
    def parse_cors_allowed_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class APIMessage(BaseModel):
    message: str


class HealthResponse(BaseModel):
    status: str
    environment: str
    version: str
    timestamp: datetime


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class TimestampedSchema(BaseSchema):
    created_at: datetime | None = None
    updated_at: datetime | None = None

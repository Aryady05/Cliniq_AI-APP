from pydantic import BaseModel, Field

from app.schemas.common import TimestampedSchema


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    age: int = Field(ge=0, le=120)
    gender: str
    phone: str | None = None
    email: str | None = None


class PatientResponse(TimestampedSchema):
    id: str
    first_name: str
    last_name: str
    age: int
    gender: str
    phone: str | None = None
    email: str | None = None

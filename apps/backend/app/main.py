from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import get_settings
from app.db.session import init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    settings.pdf_output_dir.mkdir(parents=True, exist_ok=True)
    await init_db()
    yield


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    debug=settings.app_debug,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Cliniq AI backend is running"}

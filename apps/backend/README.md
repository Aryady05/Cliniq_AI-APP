# Cliniq AI Backend

FastAPI backend for patient intake, urgency scoring, consultation capture, Gemini-powered note extraction, and medical report generation.

## Run locally

1. Copy `.env.example` to `.env`
2. Install Python 3.12 or 3.13
3. Install dependencies with `pip install -r requirements.txt`
4. Start PostgreSQL and Redis, or use `docker-compose.yml` from the repo root
5. Run `uvicorn app.main:app --reload`

## Current scope

- Patient intake APIs
- Triage scoring service with deterministic + ML-style features
- Consultation and transcript APIs
- Gemini 2.5 Flash integration layer for structured note extraction
- PDF report generation scaffold
- WebSocket connection manager for live consultation updates

## Local development note

The backend defaults to SQLite for zero-friction local boot in environments where PostgreSQL drivers or compiled ML packages are not available yet. Production and Docker configuration still target PostgreSQL and Redis.

Python 3.14 is currently too new for several core FastAPI dependencies in typical Windows setups because `pydantic-core` and other compiled packages may not have working wheels yet. Use Python 3.12 or 3.13 for local development until upstream wheel support catches up.

## Gemini model choice

The backend now defaults to `gemini-2.5-flash` via environment variable. Keep `GEMINI_MODEL` configurable so the integration can be upgraded without changing application code.

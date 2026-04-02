# Cliniq AI

> AI-powered patient triage and clinical documentation platform.

Cliniq AI accelerates front-desk screening, surfaces high-risk patients on a live queue board, captures doctor–patient consultations, and uses **Google Gemini 2.5 Flash** to turn raw transcripts into structured clinical notes and PDF reports — all from a single, responsive web interface.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Prerequisites](#prerequisites)
7. [Getting Started](#getting-started)
   - [Option A — Docker Compose (recommended)](#option-a--docker-compose-recommended)
   - [Option B — Local development (Windows / PowerShell)](#option-b--local-development-windows--powershell)
   - [Option C — Manual setup](#option-c--manual-setup)
8. [Environment Variables](#environment-variables)
9. [API Reference](#api-reference)
10. [Running Tests](#running-tests)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview

Cliniq AI is a full-stack monorepo that addresses two of the most time-intensive tasks in a clinical setting:

| Problem | Solution |
|---|---|
| Manual urgency assessment at intake | AI-assisted triage scoring with deterministic + ML-style features |
| Handwritten / ad-hoc consultation notes | Gemini-powered structured note extraction from transcripts |
| Scattered post-visit documentation | One-click PDF medical report generation |
| No visibility into patient queue priority | Real-time queue board sorted by urgency score |

---

## Architecture

```
Cliniq_AI-APP/
├── apps/
│   ├── backend/    # FastAPI · PostgreSQL · Redis · Gemini AI
│   └── frontend/   # React 19 · TypeScript · Vite · Tailwind CSS 4
├── docker-compose.yml
├── start-backend.ps1
├── start-frontend.ps1
└── start-local-dev.ps1
```

The backend exposes a versioned REST API (`/api/v1`) and a WebSocket endpoint for live consultation updates. The frontend is a single-page Progressive Web App (PWA) that communicates exclusively with this API.

---

## Features

- **Patient Intake & Symptom Checker** — Front-desk or self-service form that captures chief complaint, symptoms, and basic demographics.
- **AI Triage Scoring** — Deterministic + ML-style scoring engine assigns a numeric urgency score and routes patients to emergency, specialty, or remote care pathways.
- **Live Queue Board** — Patients sorted by triage score in real time; highest-risk cases remain impossible to miss.
- **Consultation Workspace** — Doctors capture consultation transcripts directly in the browser; WebSocket push keeps the view current.
- **Gemini Note Extraction** — Transcripts are sent to Gemini 2.5 Flash, which returns structured SOAP-style clinical notes with zero manual effort.
- **PDF Report Generation** — One-click generation of formatted medical reports saved to `generated_reports/`.
- **Authentication** — JWT-based login with configurable token expiry.
- **Care Pathways** — Post-triage routing UI for emergency, specialist referral, and telehealth flows.

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | FastAPI 0.115 |
| ORM | SQLAlchemy 2 (async) |
| Migrations | Alembic |
| Primary DB | PostgreSQL 16 |
| Cache / Queue | Redis 7 |
| AI | Google Gemini (`google-genai`) |
| PDF | ReportLab |
| Auth | `python-jose` + `passlib[bcrypt]` |
| Server | Uvicorn |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5 |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Routing | React Router v7 |
| PWA | `vite-plugin-pwa` |

---

## Project Structure

```
apps/backend/
├── app/
│   ├── api/v1/routes/   # auth · patients · intake · triage
│   │                    # consultations · notes · reports · health
│   ├── core/            # config · security · dependencies
│   ├── db/              # session · base model
│   ├── ml/              # triage scoring engine
│   ├── models/          # SQLAlchemy ORM models
│   ├── schemas/         # Pydantic request/response schemas
│   ├── services/        # Gemini integration · PDF generation
│   ├── websocket/       # connection manager
│   └── workers/         # background task workers
├── alembic/             # database migrations
├── tests/
├── .env.example
├── Dockerfile
└── requirements.txt

apps/frontend/
└── src/
    ├── components/
    │   ├── care/         # CarePathways
    │   ├── consultation/ # TranscriptPanel
    │   ├── dashboard/    # MetricCard · PatientQueue · ClinicalNotesPreview · FeatureTimeline
    │   ├── intake/       # SymptomChecker
    │   ├── layout/       # AppShell · SectionHeader
    │   └── pwa/
    ├── types/            # TypeScript clinical domain types
    └── utils/
```

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Python | 3.12 or 3.13 |
| Node.js | 20+ |
| Docker + Compose | any recent version (for Docker path) |
| PostgreSQL | 16 (or use Docker) |
| Redis | 7 (or use Docker) |

> **Windows note:** Python 3.14 is currently too new for several compiled wheels (`pydantic-core`, etc.). Stick with 3.12 or 3.13.

---

## Getting Started

### Option A — Docker Compose (recommended)

Spins up the backend, PostgreSQL 16, and Redis 7 in isolated containers.

```bash
# 1. Copy and fill in environment variables
cp apps/backend/.env.example apps/backend/.env

# 2. Add your Gemini API key to apps/backend/.env
#    GEMINI_API_KEY=<your-key>

# 3. Start all services
docker compose up --build

# Backend:  http://localhost:8000
# API docs: http://localhost:8000/docs
```

> The frontend is not containerised yet. Start it separately with the steps in **Option C**.

---

### Option B — Local development (Windows / PowerShell)

```powershell
# Launch backend and frontend in two separate PowerShell windows
.\start-local-dev.ps1
```

Individual scripts:

```powershell
.\start-backend.ps1   # starts Uvicorn
.\start-frontend.ps1  # starts Vite dev server
```

---

### Option C — Manual setup

**Backend**

```bash
cd apps/backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # Linux/macOS
.venv\Scripts\Activate.ps1       # Windows PowerShell

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, REDIS_URL, GEMINI_API_KEY, SECRET_KEY

# Apply database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

> The backend falls back to **SQLite** automatically when `DATABASE_URL` is not set, enabling zero-friction local boot without a running PostgreSQL instance.

**Frontend**

```bash
cd apps/frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Environment Variables

All variables are documented in [`apps/backend/.env.example`](apps/backend/.env.example). Key variables:

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | JWT signing key — **change in production** | `change-me` |
| `DATABASE_URL` | Async SQLAlchemy connection string | SQLite fallback |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `GEMINI_API_KEY` | Google AI Studio API key | *(required)* |
| `GEMINI_MODEL` | Gemini model identifier | `gemini-2.5-flash` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `PDF_OUTPUT_DIR` | Directory for generated reports | `generated_reports` |

---

## API Reference

Interactive documentation is available at **`http://localhost:8000/docs`** (Swagger UI) or **`http://localhost:8000/redoc`** (ReDoc) while the backend is running.

Key route groups under `/api/v1`:

| Route prefix | Description |
|---|---|
| `/auth` | Register, login, JWT token refresh |
| `/patients` | Patient CRUD |
| `/intake` | Symptom intake submission |
| `/triage` | Urgency scoring |
| `/consultations` | Consultation session management |
| `/notes` | Gemini-powered note extraction |
| `/reports` | PDF report generation and download |
| `/health` | Liveness / readiness probe |

---

## Running Tests

```bash
cd apps/backend
pytest
```

Tests use `pytest-asyncio` for async route and service coverage.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Follow the existing code style (FastAPI dependency injection on the backend, typed React components on the frontend).
3. Add or update tests for any logic changes.
4. Open a pull request with a clear description of the change and its motivation.

---

## License

This project is released under the [MIT License](LICENSE).

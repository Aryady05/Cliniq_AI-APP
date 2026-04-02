"""initial schema

Revision ID: 20260402_0001
Revises:
Create Date: 2026-04-02
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260402_0001"
down_revision: str | None = None
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "patients",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("first_name", sa.String(length=100), nullable=False),
        sa.Column("last_name", sa.String(length=100), nullable=False),
        sa.Column("age", sa.Integer(), nullable=False),
        sa.Column("gender", sa.String(length=30), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "consultations",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("patient_id", sa.String(length=36), sa.ForeignKey("patients.id")),
        sa.Column("clinician_id", sa.String(length=100), nullable=False),
        sa.Column("department", sa.String(length=100), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "intake_sessions",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("patient_id", sa.String(length=36), sa.ForeignKey("patients.id")),
        sa.Column("chief_complaint", sa.Text(), nullable=False),
        sa.Column("symptoms", sa.JSON(), nullable=False),
        sa.Column("red_flags", sa.JSON(), nullable=False),
        sa.Column("symptom_onset", sa.String(length=100), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("vitals", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "triage_assessments",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("intake_id", sa.String(length=36), sa.ForeignKey("intake_sessions.id")),
        sa.Column("patient_id", sa.String(length=36), sa.ForeignKey("patients.id")),
        sa.Column("urgency", sa.String(length=20), nullable=False),
        sa.Column("triage_score", sa.Integer(), nullable=False),
        sa.Column("recommended_route", sa.String(length=255), nullable=False),
        sa.Column("rationale", sa.JSON(), nullable=False),
        sa.Column("risk_factors", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "transcript_chunks",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("consultation_id", sa.String(length=36), sa.ForeignKey("consultations.id")),
        sa.Column("speaker", sa.String(length=20), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "clinical_notes",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("consultation_id", sa.String(length=36), sa.ForeignKey("consultations.id")),
        sa.Column("patient_id", sa.String(length=36), sa.ForeignKey("patients.id")),
        sa.Column("source", sa.String(length=50), nullable=False),
        sa.Column("model_name", sa.String(length=100), nullable=False),
        sa.Column("symptoms", sa.JSON(), nullable=False),
        sa.Column("diagnosis", sa.JSON(), nullable=False),
        sa.Column("prescription", sa.JSON(), nullable=False),
        sa.Column("notes", sa.JSON(), nullable=False),
        sa.Column("follow_up", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "medical_reports",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("consultation_id", sa.String(length=36), sa.ForeignKey("consultations.id")),
        sa.Column("patient_id", sa.String(length=36), sa.ForeignKey("patients.id")),
        sa.Column("file_path", sa.String(length=500), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("actor_id", sa.String(length=100), nullable=True),
        sa.Column("action", sa.String(length=100), nullable=False),
        sa.Column("entity_type", sa.String(length=100), nullable=False),
        sa.Column("entity_id", sa.String(length=36), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("medical_reports")
    op.drop_table("clinical_notes")
    op.drop_table("transcript_chunks")
    op.drop_table("triage_assessments")
    op.drop_table("intake_sessions")
    op.drop_table("consultations")
    op.drop_table("patients")

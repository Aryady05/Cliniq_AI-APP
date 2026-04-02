from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.report import ReportRequest, ReportResponse
from app.services.report_service import ReportService

router = APIRouter()
report_service = ReportService()


@router.post("/generate", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    payload: ReportRequest, session: AsyncSession = Depends(get_db_session)
) -> ReportResponse:
    return await report_service.generate_report(session, payload)


@router.get("/{report_id}/download")
async def download_report(
    report_id: str, session: AsyncSession = Depends(get_db_session)
) -> FileResponse:
    file_path = await report_service.get_report_file_path(session, report_id)
    if file_path is None:
        raise HTTPException(status_code=404, detail="Report not found")

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=file_path.name,
    )

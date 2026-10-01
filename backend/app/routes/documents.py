from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.schemas.document import DocumentResponse
from app.services.document_parser import DocumentExtractionError, extract_text

router = APIRouter(prefix="/api/documents", tags=["documents"])

MAX_FILE_SIZE = 5 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_CONTENT_TYPES = {
    ".pdf": {"application/pdf", "application/octet-stream"},
    ".docx": {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/octet-stream",
    },
}


async def _process_document(file: UploadFile) -> DocumentResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Please select a file.")

    filename = file.filename
    extension = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415, detail="Unsupported file type. Please upload a PDF or DOCX."
        )
    if file.content_type and file.content_type not in ALLOWED_CONTENT_TYPES[extension]:
        raise HTTPException(status_code=415, detail="The file type does not match its extension.")

    content = await file.read(MAX_FILE_SIZE + 1)
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File is too large. Maximum size is 5 MB.")

    try:
        text, file_type = extract_text(content, filename)
    except DocumentExtractionError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="The document could not be processed.") from exc

    return DocumentResponse(success=True, filename=filename, file_type=file_type, text=text)


@router.post("/resume", response_model=DocumentResponse, status_code=status.HTTP_200_OK)
async def upload_resume(file: UploadFile = File(...)) -> DocumentResponse:
    return await _process_document(file)


@router.post("/job-description", response_model=DocumentResponse, status_code=status.HTTP_200_OK)
async def upload_job_description(file: UploadFile = File(...)) -> DocumentResponse:
    return await _process_document(file)


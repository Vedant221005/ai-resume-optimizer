from io import BytesIO
from pathlib import Path

from docx import Document


class DocumentExtractionError(ValueError):
    """Raised when a supported document cannot produce readable text."""


def _clean_text(text: str) -> str:
    lines = [" ".join(line.split()) for line in text.replace("\x00", "").splitlines()]
    return "\n".join(line for line in lines if line).strip()


def extract_text_from_pdf(content: bytes) -> str:
    try:
        import fitz

        with fitz.open(stream=content, filetype="pdf") as document:
            text = "\n".join(page.get_text("text") for page in document)
    except ImportError as exc:
        raise DocumentExtractionError(
            "PDF processing is unavailable in this environment. "
            "Please install the backend dependencies again."
        ) from exc
    except Exception as exc:
        raise DocumentExtractionError("The PDF could not be read.") from exc

    cleaned = _clean_text(text)
    if not cleaned:
        raise DocumentExtractionError(
            "Could not extract readable text from this PDF. "
            "Please upload a text-based PDF."
        )
    return cleaned


def extract_text_from_docx(content: bytes) -> str:
    try:
        document = Document(BytesIO(content))
        text = "\n".join(paragraph.text for paragraph in document.paragraphs)
    except Exception as exc:
        raise DocumentExtractionError("The DOCX file could not be read.") from exc

    cleaned = _clean_text(text)
    if not cleaned:
        raise DocumentExtractionError(
            "Could not extract readable text from this DOCX document."
        )
    return cleaned


def extract_text(content: bytes, filename: str) -> tuple[str, str]:
    extension = Path(filename).suffix.lower()
    if extension == ".pdf":
        return extract_text_from_pdf(content), "pdf"
    if extension == ".docx":
        return extract_text_from_docx(content), "docx"
    raise DocumentExtractionError("Unsupported document format. Use PDF or DOCX.")

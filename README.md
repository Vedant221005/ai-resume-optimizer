# AI Resume Optimizer for ATS

AI Resume Optimizer is a full-stack application planned to help candidates compare resumes with job descriptions, understand gaps, and improve applications without inventing candidate information.

## Current milestone

**Milestone 1: Completed — Resume and Job Description upload + document text extraction.**

Milestone 1 is complete. The application now supports PDF/DOCX uploads for resumes and job descriptions, plus direct JD text paste. It does not perform ATS scoring or AI analysis yet.

## What is built

### Frontend dashboard

- Professional responsive Next.js dashboard
- Resume upload card with drag-and-drop and browse support
- Job description input with **Upload JD** and **Paste JD** modes
- PDF and DOCX file validation
- Maximum 5 MB file-size validation
- File name and file-size display
- Upload progress, loading, success, and error states
- Replace and remove document actions
- Scrollable extracted-text previews for resume and job description
- Friendly handling for backend/network failures

### Backend document pipeline

- FastAPI application with CORS configured for the local Next.js frontend
- `POST /api/documents/resume` endpoint
- `POST /api/documents/job-description` endpoint
- PDF extraction using PyMuPDF
- DOCX extraction using python-docx
- Text cleanup for common extraction artifacts and unnecessary blank lines
- Extension and practical MIME-type validation
- Empty-file and maximum-size validation
- Useful HTTP errors without exposing Python stack traces
- In-memory processing with no permanent document storage

### Verification completed

- PDF resume upload and extraction verified
- PDF job description upload and extraction verified
- DOCX extraction pipeline implemented
- Direct pasted job description supported
- Frontend production build and TypeScript validation passed
- Backend Python syntax and API upload validation passed

## Tech stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python, Pydantic, Uvicorn
- Document processing: PyMuPDF and python-docx

## Architecture

The `frontend` Next.js application owns the responsive dashboard and calls the separated `backend` FastAPI service through `services/api.ts`. The backend validates uploads in the document routes and delegates extraction to the reusable parser service. Files are processed in memory and are not stored.

## Installation and running locally

### Backend

Windows PowerShell:

```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Python 3.13 is recommended on Windows because PyMuPDF uses native binary
dependencies. If the project already contains `.venv`, use it directly:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If Python 3.13 is not installed, install it and then create the environment:

```powershell
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

On some Windows Python 3.14 installations, `python -m venv` can hang while
bootstrapping pip through `ensurepip`. If that happens, cancel the command,
do not use the incomplete `venv` directory, and install Python 3.13 before
repeating the commands above. If the repository already has a working
`.venv`, no new environment is needed.

Linux/macOS:

```bash
cd backend
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

In a second terminal:

```bash
cd frontend
copy ..\.env.example .env.local
npm install
npm run dev
```

On Linux/macOS, use `cp ../.env.example .env.local` instead of `copy`. Open http://localhost:3000.

Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` if the API is not running at `http://localhost:8000`. The backend accepts comma-separated local frontend origins through `FRONTEND_ORIGINS`.

## API endpoints

- `GET /health` — basic service health check
- `POST /api/documents/resume` — multipart field `file`, PDF or DOCX, maximum 5 MB
- `POST /api/documents/job-description` — multipart field `file`, PDF or DOCX, maximum 5 MB

Successful document responses include `success`, `filename`, `file_type`, and extracted `text`.

## Manual test flow

1. Start the backend and frontend.
2. Drop or browse to a text-based PDF resume and confirm the uploaded state and extracted text preview.
3. Repeat with a DOCX resume.
4. Try a `.txt` or oversized file and confirm a clear validation error.
5. Upload a PDF and DOCX job description using **Upload JD**.
6. Switch to **Paste JD**, paste text, and confirm it appears in the preview.
7. Use **Replace** and **Remove** on both document cards.
8. Stop the backend, attempt an upload, and confirm the frontend reports a friendly network error.

## Current limitations

- No ATS scoring, keyword/skill extraction, embeddings, semantic matching, RAG, or LLM integration
- No OCR for scanned PDFs
- No authentication, accounts, persistence, or resume history
- Uploaded documents are not permanently stored

## Future roadmap

1. Document processing (completed)
2. Keyword and skill extraction
3. Embeddings and semantic matching
4. Explainable ATS score
5. LLM resume suggestions
6. AI-tailored resume generation
7. AI interview preparation
8. Database and authentication
9. Testing and evaluation
10. Deployment

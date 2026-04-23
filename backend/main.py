import os
import fitz
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from analyzer import analyze_tender

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str

class ErrorResponse(BaseModel):
    error: str


def extract_text_from_pdf(file: UploadFile) -> str:
    content = file.file.read()
    try:
        document = fitz.open(stream=content, filetype="pdf")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid PDF file: {exc}")

    text_parts = []
    for page in document:
        page_text = page.get_text().strip()
        if page_text:
            text_parts.append(page_text)
    return "\n\n".join(text_parts)


def chunk_text(text: str, max_chars: int = 100000) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + max_chars, len(text))
        chunk = text[start:end]
        if end < len(text):
            # Avoid splitting in the middle of a word
            last_newline = chunk.rfind("\n")
            if last_newline > max_chars // 2:
                end = start + last_newline
                chunk = text[start:end]
        chunks.append(chunk)
        start = end
    return chunks


@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {"status": "ok"}


@app.post("/upload")
async def upload_tender(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        raw_text = extract_text_from_pdf(file)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error extracting PDF text: {exc}")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="PDF contains no extractable text.")

    try:
        analysis = analyze_tender(raw_text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {exc}")

    return analysis


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")

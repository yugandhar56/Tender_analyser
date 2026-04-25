# TenderAI - Government Tender Document Analyzer POC

A proof-of-concept full-stack application for contractors in Telangana and Andhra Pradesh to upload government tender PDFs and receive an instant plain-English summary of critical information.

## Project Structure

- `backend/`
  - `main.py` - FastAPI backend with PDF upload and AI analysis endpoints
  - `analyzer.py` - Anthropic Claude integration and prompt handling
  - `requirements.txt` - Python dependencies
  - `.env` - Environment variable for Anthropic API key
- `frontend/`
  - `public/` - Static assets
  - `src/` - React app source
  - `index.html` - Main HTML template
  - `package.json` - Frontend dependencies and scripts
  - `vite.config.js` - Vite configuration
  - `tailwind.config.js` - Tailwind CSS configuration
  - `postcss.config.js` - PostCSS configuration
- `.gitignore` - Ignore build, environment, and dependencies

## Backend Setup

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   > Note: this project is configured for Python 3.14, using `PyMuPDF==1.26.0` and `anthropic==0.96.0` for compatibility.
3. Create or update `.env` with your Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=your_claude_api_key_here
   ```
4. Start the backend server:
   ```bash
   python main.py
   ```
5. Backend will run at `http://localhost:8000`

### Sample PDF and Upload Test

Generate a local sample PDF for testing:

```bash
python generate_sample_pdf.py
```

Then run the upload test script:

```bash
python test_upload.py
```

### Health Check

Verify the backend is online:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{"status": "ok"}
```

## Frontend Setup

1. Open a terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Frontend will run at `http://localhost:5173`

## Anthropic API Key

1. Sign in at [https://console.anthropic.com](https://console.anthropic.com)
2. Create a new API key
3. Add it to `backend/.env` as `ANTHROPIC_API_KEY`

## How to Demo to Client

1. Start the backend and frontend servers.
2. Open the app at `http://localhost:5173`.
3. Click **Load Sample Data** to show a ready-made Telangana tender summary.
4. Explain the generated sections: key dates, financial details, eligibility, documents, scope, conditions, penalties, and red flags.
5. Upload a real PDF to demonstrate the actual extraction flow.
6. Show the interactive checklist boxes and the print-ready results view.

## Notes

- The backend uses PyMuPDF (`fitz`) to extract text from uploaded PDF files.
- The frontend uses Vite, React, Tailwind CSS, Axios, `react-icons`, and `react-hot-toast`.
- No database is required for this POC.

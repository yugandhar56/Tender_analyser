import { useState } from 'react'
import { HiDocumentText, HiOutlineInboxArrowDown } from 'react-icons/hi2'

export default function UploadSection({ selectedFile, onFileChange, onAnalyze, onLoadSample, loading, progress, statusMessage }) {
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = (files) => {
    const pdf = files?.[0]
    if (pdf && pdf.type === 'application/pdf') {
      onFileChange(pdf)
    }
  }

  const handleDrag = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === 'dragenter') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">Upload your tender PDF</h2>
          <p className="text-slate-600">Drag and drop a PDF or browse to select a government tender document for instant analysis.</p>
        </div>

        <label
          htmlFor="file-upload"
          className={`group flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed ${dragActive ? 'border-brand bg-slate-50' : 'border-slate-300 bg-white'} px-6 py-12 text-center transition`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <HiOutlineInboxArrowDown className="h-12 w-12 text-brand" />
          <div>
            <p className="text-lg font-semibold text-slate-900">Drop PDF here</p>
            <p className="text-sm text-slate-500">or click to browse files</p>
          </div>
          <p className="text-sm text-slate-400">Only PDF files are supported. Large tenders can take a moment to analyze.</p>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </label>

        {selectedFile && (
          <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
                <HiDocumentText className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{selectedFile.name}</p>
                <p className="text-sm text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200">
              PDF selected
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading}
            onClick={onAnalyze}
            className="rounded-3xl bg-brand px-6 py-4 text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            Analyse Tender
          </button>
          <button
            type="button"
            onClick={onLoadSample}
            className="rounded-3xl border border-slate-300 bg-white px-6 py-4 text-slate-700 transition hover:border-brand hover:text-brand"
          >
            Load Sample Data
          </button>
        </div>

        {loading && (
          <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{statusMessage || 'Working on your document...'}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-slate-50 via-slate-100 to-white p-8 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-xl font-semibold text-slate-900">Why TenderAI?</h3>
        <ul className="mt-4 space-y-3 text-slate-600">
          <li>• Extracts all critical tender information in clear, contractor-friendly language.</li>
          <li>• Designed for Telangana and Andhra Pradesh state tenders.</li>
          <li>• Provides checklists, deadlines, penalties, and red flags at a glance.</li>
        </ul>
      </section>
    </div>
  )
}

import { useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import UploadSection from './components/UploadSection'
import ResultsDashboard from './components/ResultsDashboard'
import LoadingSpinner from './components/LoadingSpinner'

const sampleData = {
  tender_title: 'Telangana State Roads Improvement Works on SH-16',
  department: 'Telangana Roads & Buildings Department',
  tender_number: 'NIT/TSR&B/2026/078',
  key_dates: {
    document_sale_start: '2026-05-05',
    document_sale_end: '2026-05-20',
    submission_deadline: '2026-06-10 15:00',
    bid_opening_date: '2026-06-11',
    work_completion_date: '12 months from work order',
  },
  financial_details: {
    estimated_cost: '₹2.5 crore',
    emd_amount: '₹2.5 lakh',
    security_deposit: '2% of contract value',
    performance_guarantee: '5% of contract value for the defect liability period',
  },
  eligibility_criteria: [
    'Registered Class 2 or above contractor',
    'Valid GST registration for construction activity',
    'Experience in road works for at least 3 years',
    'Turnover of ₹2 crore or more in the last 3 years',
  ],
  required_documents: [
    'Signed tender form and bid cover letter',
    'Class 2 contractor registration certificate',
    'GST and PAN registration documents',
    'Road construction experience certificates',
    'EMD payment receipt or BG',
    'Power of attorney if signing on behalf of firm',
  ],
  scope_of_work:
    'Reinforcement and resurfacing of the 38 km stretch of SH-16, including drainage repairs, shoulder widening, and road marking.',
  important_conditions: [
    'Bid must be submitted before 15:00 on the deadline date',
    'Contractor must follow Telangana R&B specifications',
    'Site visit is mandatory before bid submission',
    'Rates are final and inclusive of all taxes',
    'All materials must meet state quality standards',
  ],
  penalty_clauses: [
    'Liquidated damages of 0.5% per week of delay',
    'Maximum delay penalty capped at 10% of contract value',
    'Penalty applies for non-compliance with safety standards',
  ],
  payment_terms:
    'Progress payments are released monthly after certified work completion, with final payment due after final inspection and handover.',
  red_flags: [
    'Strict 15-day mobilization period after work order',
    'No separate payment for temporary diversion work',
  ],
  contractor_checklist: [
    'Download tender document and check the NIT carefully',
    'Prepare EMD as specified and submit on time',
    'Collect all registration, experience, and tax documents',
    'Fill the bid form and sign the declaration',
    'Submit the sealed packet before the deadline at the office',
  ],
  summary_in_simple_words:
    'This tender is for upgrading a Telangana state road with resurfacing, drainage repair, and widening over one year. Only experienced Class 2 contractors should apply. You must submit your bid with the correct EMD and all registration documents before the closing date. Watch the mobilization period and penalty terms carefully.',
}

export default function App() {
  const [view, setView] = useState('upload')
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (file) => {
    setSelectedFile(file)
  }

  const resetToUpload = () => {
    setSelectedFile(null)
    setAnalysis(null)
    setLoading(false)
    setStatusMessage('')
    setUploadProgress(0)
    setView('upload')
  }

  const handleLoadSample = () => {
    setAnalysis(sampleData)
    setView('results')
    toast.success('Sample tender loaded successfully')
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file first.')
      return
    }

    setLoading(true)
    setUploadProgress(0)
    setStatusMessage('Extracting text...')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const api = axios.create({
        baseURL: 'http://localhost:8000',
        timeout: 120000,
      })

      setTimeout(() => setStatusMessage('Analysing with AI...'), 1200)
      setTimeout(() => setStatusMessage('Preparing your report...'), 2600)

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        },
      })

      setAnalysis(response.data)
      setView('results')
      toast.success('Tender analysis completed successfully')
    } catch (error) {
      const message =
        error?.response?.data?.detail || error?.response?.data?.error || error?.message || 'Upload failed'
      toast.error(message)
    } finally {
      setLoading(false)
      setStatusMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-dark">TenderAI</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Smart Tender Analysis for Telangana & AP Contractors
              </h1>
            </div>
            <div className="rounded-3xl bg-brand text-white px-5 py-3 text-sm font-medium shadow-sm">
              Instant government tender summaries and checklists
            </div>
          </div>
        </header>

        <main className="flex-1">
          {view === 'upload' && (
            <UploadSection
              selectedFile={selectedFile}
              onFileChange={handleFileChange}
              onAnalyze={handleUpload}
              onLoadSample={handleLoadSample}
              loading={loading}
              progress={uploadProgress}
              statusMessage={statusMessage}
            />
          )}

          {view === 'results' && analysis && (
            <ResultsDashboard analysis={analysis} onBack={resetToUpload} />
          )}
        </main>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
      {loading && <LoadingSpinner />}
    </div>
  )
}

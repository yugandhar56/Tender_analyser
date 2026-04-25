import { useEffect, useState } from 'react'

const statusMessages = [
  'Reading your tender document...',
  'Identifying key dates and deadlines...',
  'Extracting financial requirements...',
  'Checking eligibility conditions...',
  'Preparing your easy summary...',
]

export default function LoadingSpinner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % statusMessages.length)
    }, 2000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-sm">
        <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-8 border-brand border-t-transparent" />
        <p className="text-lg font-semibold text-slate-900">Analyzing your tender</p>
        <p className="mt-3 text-sm text-slate-600">{statusMessages[index]}</p>
      </div>
    </div>
  )
}

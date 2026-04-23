import InfoCard from './InfoCard'
import Checklist from './Checklist'
import { HiPrinter, HiArrowPath } from 'react-icons/hi2'

function formatDate(value) {
  if (!value) return 'N/A'
  return value
}

export default function ResultsDashboard({ analysis, onBack }) {
  const { key_dates, financial_details, eligibility_criteria, required_documents, scope_of_work, important_conditions, penalty_clauses, payment_terms, red_flags, contractor_checklist } = analysis

  const submissionDate = new Date(key_dates?.submission_deadline || '')
  const deadlineText = isNaN(submissionDate.getTime()) ? 'N/A' : submissionDate.toLocaleDateString()
  const today = new Date()
  const daysRemaining = !isNaN(submissionDate.getTime())
    ? Math.max(0, Math.ceil((submissionDate - today) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{analysis.department}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">{analysis.tender_title}</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">Tender No: {analysis.tender_number}</span>
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">Submission in {daysRemaining !== null ? `${daysRemaining} days` : deadlineText}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-3xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              <HiPrinter className="h-5 w-5" /> Print
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
            >
              <HiArrowPath className="h-5 w-5" /> Analyse Another Tender
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-sky-50 p-8 text-slate-900 shadow-sm ring-1 ring-slate-200">
        <p className="text-lg font-semibold">Summary</p>
        <p className="mt-3 max-w-4xl text-base leading-8">{analysis.summary_in_simple_words}</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <InfoCard title="📅 Key Dates" icon="📅" color="border-red-500" >
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div><span className="block font-semibold text-slate-900">Sale Start</span>{formatDate(key_dates?.document_sale_start)}</div>
            <div><span className="block font-semibold text-slate-900">Sale End</span>{formatDate(key_dates?.document_sale_end)}</div>
            <div><span className="block font-semibold text-slate-900">Submission</span><span className="block font-semibold text-red-600">{key_dates?.submission_deadline}</span></div>
            <div><span className="block font-semibold text-slate-900">Bid Opening</span>{formatDate(key_dates?.bid_opening_date)}</div>
            <div className="sm:col-span-2"><span className="block font-semibold text-slate-900">Completion</span>{formatDate(key_dates?.work_completion_date)}</div>
          </div>
        </InfoCard>

        <InfoCard title="💰 Financial Details" icon="💰" color="border-emerald-500">
          <div className="space-y-3 text-sm">
            <div><span className="block text-slate-900 text-lg font-semibold">{financial_details?.estimated_cost || 'N/A'}</span><span className="text-slate-600">Estimated project cost</span></div>
            <div><span className="font-semibold text-slate-900">EMD</span><div className="text-slate-600">{financial_details?.emd_amount || 'N/A'}</div></div>
            <div><span className="font-semibold text-slate-900">Security Deposit</span><div className="text-slate-600">{financial_details?.security_deposit || 'N/A'}</div></div>
            <div><span className="font-semibold text-slate-900">Performance Guarantee</span><div className="text-slate-600">{financial_details?.performance_guarantee || 'N/A'}</div></div>
          </div>
        </InfoCard>

        <InfoCard title="✅ Eligibility Criteria" icon="✅" color="border-sky-500">
          <ul className="space-y-2 text-sm text-slate-600">
            {eligibility_criteria?.map((item, index) => (
              <li key={index} className="flex gap-3"><span className="text-emerald-600">✓</span>{item}</li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard title="📄 Required Documents" icon="📄" color="border-amber-500">
          <Checklist items={required_documents || []} />
        </InfoCard>

        <InfoCard title="🏗️ Scope of Work" icon="🏗️" color="border-slate-500">
          <p className="text-sm leading-7 text-slate-700">{scope_of_work || 'No scope details available.'}</p>
        </InfoCard>

        <InfoCard title="⚠️ Important Conditions" icon="⚠️" color="border-orange-500">
          <ol className="space-y-3 text-sm text-slate-600 list-decimal list-inside">
            {important_conditions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </InfoCard>

        <InfoCard title="💸 Penalty Clauses" icon="💸" color="border-red-500">
          <ul className="space-y-2 text-sm text-slate-600">
            {penalty_clauses?.map((item, index) => (
              <li key={index} className="flex gap-2"><span className="text-red-600">!</span>{item}</li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard title="💳 Payment Terms" icon="💳" color="border-purple-500">
          <p className="text-sm leading-7 text-slate-700">{payment_terms || 'No payment terms detected.'}</p>
        </InfoCard>

        {red_flags?.length > 0 && (
          <InfoCard title="🚩 Red Flags" icon="🚩" color="border-rose-600">
            <ul className="space-y-3 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">
              {red_flags.map((item, index) => (
                <li key={index} className="font-semibold">{item}</li>
              ))}
            </ul>
          </InfoCard>
        )}

        <InfoCard title="📋 Contractor Action Checklist" icon="📋" color="border-emerald-500">
          <Checklist items={contractor_checklist || []} />
        </InfoCard>
      </div>
    </div>
  )
}

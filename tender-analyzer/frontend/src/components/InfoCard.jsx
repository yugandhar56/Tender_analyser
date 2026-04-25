export default function InfoCard({ title, icon, color, children }) {
  return (
    <div className={`rounded-3xl border-t-4 ${color} bg-white p-6 shadow-sm ring-1 ring-slate-200`}>
      <div className="mb-5 flex items-center gap-3 text-sm font-semibold text-slate-900">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="space-y-3 text-slate-700">{children}</div>
    </div>
  )
}

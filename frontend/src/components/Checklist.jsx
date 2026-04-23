import { useState } from 'react'

export default function Checklist({ items }) {
  const [checkedItems, setCheckedItems] = useState(() => items.map(() => false))
  const completed = checkedItems.filter(Boolean).length

  const toggleIndex = (index) => {
    setCheckedItems((current) =>
      current.map((value, idx) => (idx === index ? !value : value))
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-slate-50 p-4">
        <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-700">
          <span>Checklist progress</span>
          <span>{completed}/{items.length}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-brand" style={{ width: `${Math.round((completed / Math.max(items.length, 1)) * 100)}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <label key={index} className="flex cursor-pointer items-start gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-sm transition hover:border-brand">
            <input
              type="checkbox"
              checked={checkedItems[index]}
              onChange={() => toggleIndex(index)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            <span className="text-slate-700">{item}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

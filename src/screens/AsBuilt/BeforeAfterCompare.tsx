import { useState } from 'react'
import { ArrowRight, ImageOff } from 'lucide-react'
import { fieldChanges } from '../../data/fieldChanges'
import { formatDate } from '../../utils/format'

const OPTIONS = [...fieldChanges].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20)

export function BeforeAfterCompare() {
  const [selectedId, setSelectedId] = useState(OPTIONS[0]?.id ?? '')
  const change = OPTIONS.find((c) => c.id === selectedId) ?? OPTIONS[0]

  return (
    <div className="rounded-xl glass p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white/90">So sánh trước / sau thay đổi</p>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="rounded-lg border border-navy-700 bg-navy-850 px-2.5 py-1.5 text-xs text-white/75 focus:outline-none"
        >
          {OPTIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {formatDate(c.date)} · Block {c.block} · {c.description.slice(0, 40)}...
            </option>
          ))}
        </select>
      </div>

      {change && (
        <>
          <p className="mb-3 text-xs text-white/45">{change.description}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex h-40 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-white/35">
                <div className="flex flex-col items-center gap-1.5">
                  <ImageOff size={22} />
                  <span className="text-[11px]">Trước thay đổi (minh hoạ)</span>
                </div>
              </div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-white/35" />
            <div className="flex-1">
              <div className="flex h-40 items-center justify-center rounded-lg border border-status-success/40 bg-status-success/5 text-white/35">
                <div className="flex flex-col items-center gap-1.5">
                  <ImageOff size={22} />
                  <span className="text-[11px]">Sau thay đổi (minh hoạ)</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

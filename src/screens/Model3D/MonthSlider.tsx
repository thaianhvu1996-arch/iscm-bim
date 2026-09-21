import { PlayCircle } from 'lucide-react'
import { MIN_MONTH, MAX_MONTH } from './constructionStages'
import { PROJECT_START } from '../../data/constants'
import { formatMonthShort } from '../../utils/format'
import { addMonths } from '../../utils/random'

interface MonthSliderProps {
  month: number
  onChange: (month: number) => void
}

const MONTH_MARKS = Array.from({ length: MAX_MONTH - MIN_MONTH + 1 }, (_, i) => MIN_MONTH + i)

export function MonthSlider({ month, onChange }: MonthSliderProps) {
  return (
    <div className="glass shrink-0 rounded-2xl px-6 py-3">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/45">
          <PlayCircle size={13} /> Tiến độ thi công (mô phỏng 4D)
        </p>
        <p className="text-sm font-semibold text-brand">
          Tháng {Math.min(9, Math.max(1, Math.round(month)))}/9 ·{' '}
          {formatMonthShort(addMonths(PROJECT_START, Math.round(month) - 1))}
        </p>
      </div>
      <input
        type="range"
        min={MIN_MONTH}
        max={MAX_MONTH}
        step={0.05}
        value={month}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand"
      />
      <div className="mt-1 flex justify-between px-0.5 text-[10px] text-white/35">
        {MONTH_MARKS.map((m) => (
          <span key={m}>T{m}</span>
        ))}
      </div>
    </div>
  )
}

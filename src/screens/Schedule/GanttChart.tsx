import { Flame } from 'lucide-react'
import type { ScheduleItem } from '../../types'
import { PROJECT_START, ELAPSED_DAYS, TOTAL_PROJECT_DAYS, CURRENT_DATE } from '../../data/constants'
import { addMonths } from '../../utils/random'
import { formatMonthShort } from '../../utils/format'
import { rangePercent, datePercent } from './ganttMath'
import { useLang } from '../../i18n/LanguageContext'

interface GanttChartProps {
  items: ScheduleItem[]
}

const MONTHS = Array.from({ length: 9 }, (_, i) => addMonths(PROJECT_START, i))

function barColor(status: ScheduleItem['status']): string {
  if (status === 'Chậm tiến độ') return '#ef4444'
  if (status === 'Chưa bắt đầu') return 'transparent'
  return '#22c55e'
}

export function GanttChart({ items }: GanttChartProps) {
  const { lang } = useLang()
  const todayPercent = (ELAPSED_DAYS / TOTAL_PROJECT_DAYS) * 100

  return (
    <div className="rounded-xl glass p-4">
      <div className="flex">
        <div className="w-56 shrink-0" />
        <div className="relative flex-1">
          <div className="flex text-[11px] text-white/45">
            {MONTHS.map((m, i) => (
              <div key={i} className="flex-1 border-l border-navy-700 pl-1.5 first:border-l-0">
                {formatMonthShort(m, lang)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-1 max-h-[420px] overflow-y-auto pr-1">
        {items.map((item) => {
          const planned = rangePercent(item.plannedStart, item.plannedEnd)
          const hasActual = item.status !== 'Chưa bắt đầu'
          const actualEnd = item.actualEnd ?? CURRENT_DATE
          const actual = hasActual ? rangePercent(item.actualStart ?? item.plannedStart, actualEnd) : null

          return (
            <div key={item.id} className="flex items-center border-t border-navy-800 py-1.5 first:border-t-0">
              <div className="w-56 shrink-0 truncate pr-3 text-xs text-white/75" title={item.name[lang]}>
                <div className="flex items-center gap-1">
                  {item.isCriticalPath && <Flame size={11} className="shrink-0 text-status-danger" />}
                  <span className="truncate">{item.name[lang]}</span>
                </div>
              </div>
              <div className="relative h-6 flex-1 rounded bg-navy-850">
                {MONTHS.map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full border-l border-navy-800"
                    style={{ left: `${(i / 9) * 100}%` }}
                  />
                ))}
                <div
                  className="absolute z-10 h-1.5 rounded-full bg-white/40"
                  style={{ left: `${planned.left}%`, width: `${planned.width}%`, top: '4px' }}
                  title={`${lang === 'vi' ? 'Kế hoạch' : 'Planned'}: ${item.name[lang]}`}
                />
                {actual && (
                  <div
                    className="absolute z-10 h-1.5 rounded-full"
                    style={{
                      left: `${actual.left}%`,
                      width: `${actual.width}%`,
                      top: '14px',
                      backgroundColor: barColor(item.status),
                    }}
                    title={`${lang === 'vi' ? 'Thực tế' : 'Actual'}: ${item.name[lang]}`}
                  />
                )}
                <div
                  className="absolute top-0 z-20 h-full w-px bg-status-info/70"
                  style={{ left: `${todayPercent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center gap-5 border-t border-navy-700 pt-3 text-[11px] text-white/45">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-white/40" /> {lang === 'vi' ? 'Kế hoạch' : 'Planned'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-status-success" />{' '}
          {lang === 'vi' ? 'Đúng/hoàn thành' : 'On track / done'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-status-danger" /> {lang === 'vi' ? 'Chậm tiến độ' : 'Delayed'}
        </span>
        <span className="flex items-center gap-1.5">
          <Flame size={11} className="text-status-danger" /> {lang === 'vi' ? 'Đường găng' : 'Critical path'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-px bg-status-info" />{' '}
          {lang === 'vi' ? 'Hôm nay' : 'Today'} ({Math.round(datePercent(CURRENT_DATE))}%)
        </span>
      </div>
    </div>
  )
}

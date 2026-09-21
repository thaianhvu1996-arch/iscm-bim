import { Flame } from 'lucide-react'
import type { ScheduleItem } from '../../types'
import { Badge } from '../../components/common/Badge'
import { scheduleStatusTone } from '../../utils/tone'
import { formatDate, formatNumber } from '../../utils/format'
import { useLang } from '../../i18n/LanguageContext'
import { blockLabel, disciplineLabel, scheduleStatusLabel, unitLabel } from '../../i18n/labels'

interface ScheduleTableProps {
  items: ScheduleItem[]
}

export function ScheduleTable({ items }: ScheduleTableProps) {
  const { lang } = useLang()
  return (
    <div className="shrink-0 overflow-hidden rounded-xl glass">
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[920px] text-left text-xs">
          <thead className="sticky top-0 z-10 bg-navy-850 text-white/60">
            <tr>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Hạng mục' : 'Item'}</th>
              <th className="px-3 py-2.5 font-medium">Block</th>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Bộ môn' : 'Discipline'}</th>
              <th className="px-3 py-2.5 font-medium text-right">{lang === 'vi' ? 'KL kế hoạch' : 'Planned qty'}</th>
              <th className="px-3 py-2.5 font-medium text-right">{lang === 'vi' ? 'KL thực hiện' : 'Actual qty'}</th>
              <th className="px-3 py-2.5 font-medium text-right">{lang === 'vi' ? '% hoàn thành' : '% complete'}</th>
              <th className="px-3 py-2.5 font-medium">
                {lang === 'vi' ? 'Bắt đầu - Kết thúc (KH)' : 'Start - End (planned)'}
              </th>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Trạng thái' : 'Status'}</th>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Ghi chú' : 'Note'}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-navy-800 text-white/75 hover:bg-navy-850/60">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5 font-medium text-white/90">
                    {item.isCriticalPath && <Flame size={11} className="shrink-0 text-status-danger" />}
                    {item.name[lang]}
                  </div>
                </td>
                <td className="px-3 py-2.5">{blockLabel(item.block, lang)}</td>
                <td className="px-3 py-2.5">{disciplineLabel(item.discipline, lang)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {formatNumber(item.plannedQty)} {unitLabel(item.unit, lang)}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {formatNumber(item.actualQty)} {unitLabel(item.unit, lang)}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">{item.percentComplete}%</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-white/60">
                  {formatDate(item.plannedStart)} - {formatDate(item.plannedEnd)}
                </td>
                <td className="px-3 py-2.5">
                  <Badge tone={scheduleStatusTone(item.status)}>
                    {scheduleStatusLabel(item.status, lang)}
                    {item.delayDays > 0 ? ` (+${item.delayDays}d)` : ''}
                  </Badge>
                </td>
                <td className="px-3 py-2.5 text-white/45">{item.note[lang] || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

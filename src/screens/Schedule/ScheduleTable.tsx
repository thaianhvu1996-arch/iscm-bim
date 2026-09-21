import { Flame } from 'lucide-react'
import type { ScheduleItem } from '../../types'
import { Badge } from '../../components/common/Badge'
import { scheduleStatusTone } from '../../utils/tone'
import { formatDate, formatNumber } from '../../utils/format'

interface ScheduleTableProps {
  items: ScheduleItem[]
}

export function ScheduleTable({ items }: ScheduleTableProps) {
  return (
    <div className="shrink-0 overflow-hidden rounded-xl glass">
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[920px] text-left text-xs">
          <thead className="sticky top-0 z-10 bg-navy-850 text-white/60">
            <tr>
              <th className="px-3 py-2.5 font-medium">Hạng mục</th>
              <th className="px-3 py-2.5 font-medium">Block</th>
              <th className="px-3 py-2.5 font-medium">Bộ môn</th>
              <th className="px-3 py-2.5 font-medium text-right">KL kế hoạch</th>
              <th className="px-3 py-2.5 font-medium text-right">KL thực hiện</th>
              <th className="px-3 py-2.5 font-medium text-right">% hoàn thành</th>
              <th className="px-3 py-2.5 font-medium">Bắt đầu - Kết thúc (KH)</th>
              <th className="px-3 py-2.5 font-medium">Trạng thái</th>
              <th className="px-3 py-2.5 font-medium">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-navy-800 text-white/75 hover:bg-navy-850/60">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5 font-medium text-white/90">
                    {item.isCriticalPath && <Flame size={11} className="shrink-0 text-status-danger" />}
                    {item.name}
                  </div>
                </td>
                <td className="px-3 py-2.5">{item.block}</td>
                <td className="px-3 py-2.5">{item.discipline}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {formatNumber(item.plannedQty)} {item.unit}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {formatNumber(item.actualQty)} {item.unit}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">{item.percentComplete}%</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-white/60">
                  {formatDate(item.plannedStart)} - {formatDate(item.plannedEnd)}
                </td>
                <td className="px-3 py-2.5">
                  <Badge tone={scheduleStatusTone(item.status)}>
                    {item.status}
                    {item.delayDays > 0 ? ` (+${item.delayDays}d)` : ''}
                  </Badge>
                </td>
                <td className="px-3 py-2.5 text-white/45">{item.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

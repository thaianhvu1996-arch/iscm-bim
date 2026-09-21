import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import type { Clash } from '../../types'
import { Badge } from '../../components/common/Badge'
import { clashSeverityTone, clashStatusTone } from '../../utils/tone'
import { formatDate, formatVNDShort } from '../../utils/format'

export type SortKey = 'id' | 'severity' | 'block' | 'estimatedCost' | 'status' | 'dueDate'
export interface SortState {
  key: SortKey
  direction: 'asc' | 'desc'
}

interface ClashTableProps {
  items: Clash[]
  selectedId: string | null
  onSelect: (clash: Clash) => void
  sort: SortState
  onSortChange: (sort: SortState) => void
}

const COLUMNS: Array<{ key: SortKey; label: string; align?: 'right' }> = [
  { key: 'id', label: 'Mã' },
  { key: 'severity', label: 'Mức độ' },
  { key: 'block', label: 'Block' },
  { key: 'estimatedCost', label: 'Chi phí ước tính', align: 'right' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'dueDate', label: 'Hạn xử lý' },
]

export function ClashTable({ items, selectedId, onSelect, sort, onSortChange }: ClashTableProps) {
  const toggleSort = (key: SortKey) => {
    if (sort.key === key) {
      onSortChange({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' })
    } else {
      onSortChange({ key, direction: 'asc' })
    }
  }

  return (
    <div className="shrink-0 overflow-hidden rounded-xl glass">
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full min-w-[880px] text-left text-xs">
          <thead className="sticky top-0 z-10 bg-navy-850 text-white/60">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className={`px-3 py-2.5 font-medium ${col.align === 'right' ? 'text-right' : ''}`}>
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={`flex items-center gap-1 hover:text-white/90 ${col.align === 'right' ? 'ml-auto' : ''}`}
                  >
                    {col.label}
                    {sort.key === col.key ? (
                      sort.direction === 'asc' ? (
                        <ArrowUp size={11} />
                      ) : (
                        <ArrowDown size={11} />
                      )
                    ) : (
                      <ArrowUpDown size={11} className="opacity-40" />
                    )}
                  </button>
                </th>
              ))}
              <th className="px-3 py-2.5 font-medium">Mô tả</th>
              <th className="px-3 py-2.5 font-medium">Phụ trách</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelect(c)}
                className={`cursor-pointer border-t border-navy-800 text-white/75 hover:bg-navy-850/60 ${
                  selectedId === c.id ? 'bg-brand/10' : ''
                }`}
              >
                <td className="px-3 py-2.5 font-mono text-white/60">{c.id}</td>
                <td className="px-3 py-2.5">
                  <Badge tone={clashSeverityTone(c.severity)}>{c.severity}</Badge>
                </td>
                <td className="px-3 py-2.5">{c.block}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-white/90">
                  {formatVNDShort(c.estimatedCost)}
                </td>
                <td className="px-3 py-2.5">
                  <Badge tone={clashStatusTone(c.status)}>{c.status}</Badge>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-white/60">{formatDate(c.dueDate)}</td>
                <td className="max-w-xs truncate px-3 py-2.5 text-white/60" title={c.description}>
                  {c.description}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-white/60">{c.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-white/45">Không có xung đột phù hợp bộ lọc.</p>
        )}
      </div>
    </div>
  )
}

import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import type { QuantityItem, QuantityStatus } from '../../data/quantities'
import { Badge } from '../../components/common/Badge'
import type { BadgeTone } from '../../components/common/Badge'
import { formatNumber, formatVNDShort } from '../../utils/format'

function statusTone(status: QuantityStatus): BadgeTone {
  if (status === 'Chênh lệch lớn') return 'danger'
  if (status === 'Cần rà soát') return 'warning'
  return 'success'
}

function rowTint(status: QuantityStatus): string {
  if (status === 'Chênh lệch lớn') return 'bg-status-danger/5'
  if (status === 'Cần rà soát') return 'bg-status-warning/5'
  return ''
}

interface QuantityTableProps {
  items: QuantityItem[]
  selectedId: string | null
  onSelect: (item: QuantityItem) => void
}

export function QuantityTable({ items, selectedId, onSelect }: QuantityTableProps) {
  return (
    <div className="glass shrink-0 overflow-hidden rounded-xl">
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full min-w-[1000px] text-left text-xs">
          <thead className="sticky top-0 z-10 bg-navy-850/95 text-white/55 backdrop-blur">
            <tr>
              <th className="px-3 py-3 font-medium">Mã</th>
              <th className="px-3 py-3 font-medium">Tên công tác</th>
              <th className="px-3 py-3 font-medium">ĐVT</th>
              <th className="px-3 py-3 text-right font-medium">KL hợp đồng</th>
              <th className="px-3 py-3 text-right font-medium">KL mô hình</th>
              <th className="px-3 py-3 text-right font-medium">Chênh lệch</th>
              <th className="px-3 py-3 text-right font-medium">Đơn giá</th>
              <th className="px-3 py-3 text-right font-medium">Ảnh hưởng chi phí</th>
              <th className="px-3 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelect(item)}
                className={`cursor-pointer border-t border-white/8 text-white/75 hover:bg-white/5 ${rowTint(item.status)} ${
                  selectedId === item.id ? 'bg-brand/10' : ''
                }`}
              >
                <td className="px-3 py-3 font-mono text-white/50">{item.id}</td>
                <td className="max-w-[220px] truncate px-3 py-3 font-medium text-white/90" title={item.name}>
                  {item.name}
                </td>
                <td className="px-3 py-3 text-white/50">{item.unit}</td>
                <td className="px-3 py-3 text-right tabular-nums">{formatNumber(item.contractQty)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{formatNumber(item.modelQty)}</td>
                <td className="px-3 py-3 text-right tabular-nums">
                  <span
                    className={`inline-flex items-center gap-0.5 ${
                      item.diffPercent > 0
                        ? 'text-status-warning'
                        : item.diffPercent < 0
                          ? 'text-status-info'
                          : 'text-white/40'
                    }`}
                  >
                    {item.diffPercent > 0 ? (
                      <ArrowUp size={11} />
                    ) : item.diffPercent < 0 ? (
                      <ArrowDown size={11} />
                    ) : (
                      <Minus size={11} />
                    )}
                    {item.diffPercent > 0 ? '+' : ''}
                    {item.diffPercent}%
                  </span>
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-white/60">{formatVNDShort(item.unitPrice)}</td>
                <td className="px-3 py-3 text-right tabular-nums font-medium text-white/90">
                  {item.costImpact > 0 ? '+' : ''}
                  {formatVNDShort(item.costImpact)}
                </td>
                <td className="px-3 py-3">
                  <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-white/40">Không có hạng mục phù hợp bộ lọc.</p>
        )}
      </div>
    </div>
  )
}

import { PackageCheck, PackageOpen } from 'lucide-react'
import { procurementBatches } from '../../data/quantities'
import { Badge } from '../../components/common/Badge'
import { formatDate } from '../../utils/format'

export function ProcurementBatches() {
  return (
    <div className="glass rounded-xl p-4">
      <p className="mb-3 text-sm font-semibold text-white/85">Bóc khối lượng phục vụ mua sắm</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {procurementBatches.map((b) => {
          const Icon = b.status === 'Đã phát hành' ? PackageCheck : PackageOpen
          return (
            <div key={b.id} className="rounded-lg border border-white/10 bg-white/5 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand">
                  <Icon size={16} />
                </div>
                <Badge tone={b.status === 'Đã phát hành' ? 'success' : 'warning'}>{b.status}</Badge>
              </div>
              <p className="text-sm font-medium text-white/90">{b.materialGroup}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">{b.quantitySummary}</p>
              <p className="mt-2 text-[11px] text-white/40">Ngày phát hành: {formatDate(b.releaseDate)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

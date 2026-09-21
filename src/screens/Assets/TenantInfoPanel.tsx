import { Zap, Ruler, DoorOpen, ArrowUpDown } from 'lucide-react'
import { tenantInfo } from '../../data/tenantInfo'
import { Badge } from '../../components/common/Badge'
import { formatNumber } from '../../utils/format'

export function TenantInfoPanel() {
  return (
    <div className="rounded-xl glass p-4">
      <p className="mb-3 text-sm font-semibold text-white/90">Thông tin cho khách thuê</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tenantInfo.map((t) => (
          <div key={t.block} className="rounded-lg border border-navy-700 bg-navy-850 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-white/95">Block {t.block}</p>
              <Badge tone={t.status === 'Đã thuê' ? 'success' : 'info'}>{t.status}</Badge>
            </div>
            {t.tenantName && <p className="mb-2 truncate text-[11px] text-white/45">{t.tenantName}</p>}
            <div className="space-y-1.5 text-xs text-white/60">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Ruler size={12} /> Diện tích cho thuê
                </span>
                <span className="text-white/90">{formatNumber(t.leasableAreaM2)} m²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ArrowUpDown size={12} /> Tải trọng sàn
                </span>
                <span className="text-white/90">{t.floorLoadTonPerM2} tấn/m²</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tĩnh không dưới dầm</span>
                <span className="text-white/90">{t.clearHeightM} m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Zap size={12} /> Điện cấp / còn dư
                </span>
                <span className="text-white/90">
                  {t.powerSupplyKVA} kVA / {formatNumber(t.powerSupplyKVA - t.powerUsedKVA)} kVA
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DoorOpen size={12} /> Cửa container
                </span>
                <span className="text-white/90">{t.containerDoors} cửa</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { X, Box, Layers3, MapPin, History } from 'lucide-react'
import type { QuantityItem } from '../../data/quantities'
import { Badge } from '../../components/common/Badge'
import { formatNumber, formatVNDShort } from '../../utils/format'
import { modelVersions } from '../../data/modelVersions'
import { useLang, type Lang } from '../../i18n/LanguageContext'
import { blockLabel, disciplineLabel, quantityGroupLabel, quantityStatusLabel, unitLabel } from '../../i18n/labels'

interface QuantityDetailPanelProps {
  item: QuantityItem
  onClose: () => void
  onViewOn3D: (item: QuantityItem) => void
}

function componentBreakdown(item: QuantityItem, lang: Lang): string[] {
  if (lang === 'vi') {
    const base = item.block === 'Toàn dự án' ? 'toàn bộ mặt bằng dự án' : `Block ${item.block}`
    return [
      `Toàn bộ cấu kiện thuộc bộ môn ${item.discipline} trong phạm vi ${base} có gắn thuộc tính "${item.name.vi}"`,
      `Khối lượng tính từ hình học 3D (kích thước thực) nhân với thuộc tính vật liệu gán trên từng cấu kiện`,
      `Không bao gồm hao hụt thi công - khối lượng mô hình là khối lượng tịnh (net)`,
    ]
  }
  const base = item.block === 'Toàn dự án' ? 'the entire project site' : `Block ${item.block}`
  return [
    `All ${disciplineLabel(item.discipline, lang)} components within ${base} tagged with "${item.name.en}"`,
    `Quantity computed from 3D geometry (actual dimensions) times the material property assigned to each component`,
    `Excludes construction waste allowance — model quantity is net quantity`,
  ]
}

export function QuantityDetailPanel({ item, onClose, onViewOn3D }: QuantityDetailPanelProps) {
  const { lang } = useLang()
  const relevantVersions = modelVersions.slice(-3)

  return (
    <div className="glass flex h-full w-96 shrink-0 flex-col rounded-2xl p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="font-mono text-xs text-white/50">{item.id}</span>
        <button type="button" onClick={onClose} className="rounded p-0.5 text-white/50 hover:bg-white/10 hover:text-white/90">
          <X size={16} />
        </button>
      </div>

      <p className="mb-3 font-heading text-sm font-semibold text-white/92">{item.name[lang]}</p>

      <div className="space-y-1.5 text-xs text-white/60">
        <div className="flex items-center gap-1.5">
          <Layers3 size={13} className="text-white/40" />
          {quantityGroupLabel(item.group, lang)}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-white/40" />
          {item.block === 'Toàn dự án' ? blockLabel('Toàn dự án', lang) : `Block ${item.block}`}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
          <p className="text-[10px] text-white/45">{lang === 'vi' ? 'KL hợp đồng' : 'Contract qty'}</p>
          <p className="font-heading text-sm font-semibold text-white/90">
            {formatNumber(item.contractQty)} {unitLabel(item.unit, lang)}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
          <p className="text-[10px] text-white/45">{lang === 'vi' ? 'KL từ mô hình' : 'Model qty'}</p>
          <p className="font-heading text-sm font-semibold text-white/90">
            {formatNumber(item.modelQty)} {unitLabel(item.unit, lang)}
          </p>
        </div>
      </div>

      <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-white/45">{lang === 'vi' ? 'Ảnh hưởng chi phí' : 'Cost impact'}</p>
          <Badge tone={item.status === 'Chênh lệch lớn' ? 'danger' : item.status === 'Cần rà soát' ? 'warning' : 'success'}>
            {quantityStatusLabel(item.status, lang)}
          </Badge>
        </div>
        <p className="font-heading text-lg font-semibold text-white/92">
          {item.costImpact > 0 ? '+' : ''}
          {formatVNDShort(item.costImpact, lang)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onViewOn3D(item)}
        className="glow-brand mt-3 flex items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.01]"
      >
        <Box size={15} /> {lang === 'vi' ? 'Xem trên mô hình 3D' : 'View on 3D model'}
      </button>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-white/55">
          {lang === 'vi' ? 'Diễn giải bóc khối lượng từ mô hình' : 'How the quantity was derived from the model'}
        </p>
        <ul className="space-y-1.5">
          {componentBreakdown(item, lang).map((line, i) => (
            <li key={i} className="flex gap-1.5 text-[11px] leading-relaxed text-white/55">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-white/30" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white/55">
          <History size={12} /> {lang === 'vi' ? 'Lịch sử thay đổi khối lượng qua các phiên bản' : 'Quantity change history across versions'}
        </p>
        <div className="space-y-1.5">
          {relevantVersions.map((v) => (
            <div key={v.version} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs">
              <span className="font-mono text-white/60">{v.version}</span>
              <span className="text-white/45">
                {v.changesIntegrated} {lang === 'vi' ? 'thay đổi tích hợp' : 'changes integrated'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

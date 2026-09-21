import { X, MapPin, Layers3, Calendar, User, CircleDollarSign } from 'lucide-react'
import type { Clash } from '../../types'
import { Badge } from '../../components/common/Badge'
import { clashSeverityTone, clashStatusTone } from '../../utils/tone'
import { formatDate, formatVNDShort } from '../../utils/format'
import { useLang } from '../../i18n/LanguageContext'
import { clashSeverityLabel, clashStatusLabel, disciplineLabel } from '../../i18n/labels'

interface ClashInfoPanelProps {
  clash: Clash
  onClose: () => void
}

export function ClashInfoPanel({ clash, onClose }: ClashInfoPanelProps) {
  const { lang } = useLang()
  return (
    <div className="glass-strong absolute right-4 top-4 w-80 rounded-xl p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/45">{clash.id}</span>
          <Badge tone={clashSeverityTone(clash.severity)}>{clashSeverityLabel(clash.severity, lang)}</Badge>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 text-white/45 hover:bg-navy-700 hover:text-white/90"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mb-3 flex h-28 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-[11px] text-white/35">
        {lang === 'vi' ? 'Ảnh chụp vị trí xung đột (minh hoạ)' : 'Clash location photo (illustrative)'}
      </div>

      <p className="mb-3 text-sm leading-relaxed text-white/90">{clash.description[lang]}</p>

      <div className="space-y-1.5 text-xs text-white/60">
        <div className="flex items-center gap-1.5">
          <Layers3 size={13} className="text-white/45" />
          {disciplineLabel(clash.disciplineA, lang)} – {disciplineLabel(clash.disciplineB, lang)}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-white/45" />
          Block {clash.block} · {lang === 'vi' ? 'cao độ' : 'elevation'} {clash.elevation}
        </div>
        <div className="flex items-center gap-1.5">
          <CircleDollarSign size={13} className="text-white/45" />
          {lang === 'vi' ? 'Chi phí ước tính' : 'Estimated cost'}:{' '}
          <span className="font-medium text-white/90">{formatVNDShort(clash.estimatedCost, lang)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User size={13} className="text-white/45" />
          {lang === 'vi' ? 'Phụ trách' : 'Assigned to'}: {clash.assignee}
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-white/45" />
          {lang === 'vi' ? 'Hạn xử lý' : 'Due date'}: {formatDate(clash.dueDate)}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-navy-700 pt-3">
        <span className="text-xs text-white/45">{lang === 'vi' ? 'Trạng thái' : 'Status'}</span>
        <Badge tone={clashStatusTone(clash.status)}>{clashStatusLabel(clash.status, lang)}</Badge>
      </div>
    </div>
  )
}

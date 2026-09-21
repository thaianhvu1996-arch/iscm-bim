import { X, MapPin, Layers3, Calendar, User, CircleDollarSign } from 'lucide-react'
import type { Clash, ClashStatus } from '../../types'
import { Badge } from '../../components/common/Badge'
import { clashSeverityTone, clashStatusTone } from '../../utils/tone'
import { formatDate, formatVNDShort } from '../../utils/format'
import { useRole } from '../../context/RoleContext'
import { useLang } from '../../i18n/LanguageContext'
import { clashSeverityLabel, clashStatusLabel, disciplineLabel } from '../../i18n/labels'

const STATUS_FLOW: ClashStatus[] = ['Mới', 'Đang xử lý', 'Đã xử lý', 'Bỏ qua']

interface ClashDetailPanelProps {
  clash: Clash
  onClose: () => void
  onChangeStatus: (id: string, status: ClashStatus) => void
}

export function ClashDetailPanel({ clash, onClose, onChangeStatus }: ClashDetailPanelProps) {
  const { permissions } = useRole()
  const { lang } = useLang()

  return (
    <div className="glass flex h-full w-96 shrink-0 flex-col p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-white/45">{clash.id}</span>
          <Badge tone={clashSeverityTone(clash.severity)}>{clashSeverityLabel(clash.severity, lang)}</Badge>
        </div>
        <button type="button" onClick={onClose} className="rounded p-0.5 text-white/45 hover:bg-navy-700 hover:text-white/90">
          <X size={16} />
        </button>
      </div>

      <div className="mb-3 flex h-32 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-[11px] text-white/35">
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

      <div className="mt-4 border-t border-navy-700 pt-3">
        <p className="mb-2 text-xs font-semibold text-white/60">{lang === 'vi' ? 'Trạng thái' : 'Status'}</p>
        {permissions.canEditClashStatus ? (
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FLOW.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChangeStatus(clash.id, s)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  clash.status === s
                    ? 'bg-brand text-white'
                    : 'bg-navy-800 text-white/60 hover:text-white/90'
                }`}
              >
                {clashStatusLabel(s, lang)}
              </button>
            ))}
          </div>
        ) : (
          <Badge tone={clashStatusTone(clash.status)}>{clashStatusLabel(clash.status, lang)}</Badge>
        )}
      </div>

      <div className="mt-4 flex-1 overflow-y-auto border-t border-navy-700 pt-3">
        <p className="mb-2 text-xs font-semibold text-white/60">{lang === 'vi' ? 'Lịch sử trao đổi' : 'Comment history'}</p>
        <div className="space-y-2.5">
          {clash.comments.map((c, i) => (
            <div key={i} className="rounded-lg border border-navy-700 bg-navy-850 p-2.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-white/75">{c.author}</span>
                <span className="text-[10px] text-white/45">{formatDate(c.date)}</span>
              </div>
              <p className="text-xs leading-relaxed text-white/60">{c.message[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

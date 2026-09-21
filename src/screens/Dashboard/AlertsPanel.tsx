import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { alerts } from '../../data/alerts'
import { Badge } from '../../components/common/Badge'
import { alertLevelTone } from '../../utils/tone'
import { formatDate } from '../../utils/format'
import { useRole } from '../../context/RoleContext'
import { useLang } from '../../i18n/LanguageContext'
import { alertLevelLabel } from '../../i18n/labels'
import type { AlertLevel } from '../../types'

const LEVEL_ICON: Record<AlertLevel, typeof AlertTriangle> = {
  'Nghiêm trọng': AlertTriangle,
  'Cảnh báo': AlertCircle,
  'Thông tin': Info,
}

export function AlertsPanel() {
  const { permissions } = useRole()
  const { lang } = useLang()
  const visibleAlerts = permissions.canSeeClashDetail
    ? alerts
    : alerts.filter((a) => !a.id.includes('XD'))

  return (
    <div className="flex h-full flex-col rounded-xl glass p-4">
      <p className="mb-3 text-sm font-semibold text-white/90">
        {lang === 'vi' ? 'Cảnh báo cần xử lý' : 'Alerts requiring action'}
      </p>
      {visibleAlerts.length === 0 ? (
        <p className="text-sm text-white/45">{lang === 'vi' ? 'Không có cảnh báo nào.' : 'No alerts.'}</p>
      ) : (
        <div className="flex-1 space-y-2.5 overflow-y-auto">
          {visibleAlerts.map((a) => {
            const Icon = LEVEL_ICON[a.level]
            return (
              <div key={a.id} className="rounded-lg border border-navy-700 bg-navy-850 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <Badge tone={alertLevelTone(a.level)}>
                    <Icon size={12} />
                    {alertLevelLabel(a.level, lang)}
                  </Badge>
                  <span className="shrink-0 text-[11px] text-white/45">{formatDate(a.time)}</span>
                </div>
                <p className="text-xs leading-relaxed text-white/75">{a.title[lang]}</p>
                <p className="mt-1.5 text-[11px] text-white/45">
                  {lang === 'vi' ? 'Phụ trách' : 'Assigned to'}: {a.assignee}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

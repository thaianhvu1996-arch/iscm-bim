import type { ReactNode } from 'react'
import { X, FileText, Wrench, MapPin, Calendar, ShieldCheck } from 'lucide-react'
import type { Equipment } from '../../types'
import { formatDate } from '../../utils/format'
import { useLang } from '../../i18n/LanguageContext'
import { equipmentSystemLabel } from '../../i18n/labels'

interface EquipmentDetailPanelProps {
  equipment: Equipment
  onClose: () => void
}

export function EquipmentDetailPanel({ equipment, onClose }: EquipmentDetailPanelProps) {
  const { lang } = useLang()
  return (
    <div className="glass flex h-full w-96 shrink-0 flex-col p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-xs text-white/45">{equipment.id}</span>
          <p className="text-sm font-semibold text-white/95">{equipment.name[lang]}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded p-0.5 text-white/45 hover:bg-navy-700 hover:text-white/90">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-1.5 rounded-lg border border-navy-700 bg-navy-850 p-3 text-xs text-white/75">
        <Row label={lang === 'vi' ? 'Hệ thống' : 'System'} value={equipmentSystemLabel(equipment.system, lang)} />
        <Row label={lang === 'vi' ? 'Vị trí' : 'Location'} value={equipment.location[lang]} icon={<MapPin size={12} />} />
        <Row label={lang === 'vi' ? 'Hãng sản xuất' : 'Manufacturer'} value={equipment.manufacturer} />
        <Row label="Model" value={equipment.model} mono />
        <Row label={lang === 'vi' ? 'Công suất / thông số' : 'Capacity / specs'} value={equipment.capacity[lang]} />
        <Row
          label={lang === 'vi' ? 'Ngày lắp đặt' : 'Install date'}
          value={formatDate(equipment.installDate)}
          icon={<Calendar size={12} />}
        />
        <Row
          label={lang === 'vi' ? 'Hạn bảo hành' : 'Warranty until'}
          value={formatDate(equipment.warrantyUntil)}
          icon={<ShieldCheck size={12} />}
        />
        <Row
          label={lang === 'vi' ? 'Chu kỳ bảo trì' : 'Maintenance cycle'}
          value={lang === 'vi' ? `${equipment.maintenanceCycleMonths} tháng` : `${equipment.maintenanceCycleMonths} months`}
          icon={<Wrench size={12} />}
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-white/60">
          {lang === 'vi' ? 'Lịch bảo trì 12 tháng tới' : 'Maintenance schedule, next 12 months'}
        </p>
        <div className="space-y-1.5">
          {equipment.upcomingMaintenance.map((m, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-navy-700 bg-navy-850 px-2.5 py-1.5 text-xs">
              <span className="text-white/75">{m.task[lang]}</span>
              <span className="text-white/45">{formatDate(m.date)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto">
        <p className="mb-2 text-xs font-semibold text-white/60">{lang === 'vi' ? 'Tài liệu đính kèm' : 'Attached documents'}</p>
        <div className="space-y-1.5">
          {equipment.documents[lang].map((doc, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-850 px-2.5 py-1.5 text-xs text-white/60">
              <FileText size={13} className="shrink-0 text-white/45" />
              <span className="truncate">{doc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, icon, mono }: { label: string; value: string; icon?: ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-white/45">
        {icon}
        {label}
      </span>
      <span className={`text-right text-white/90 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

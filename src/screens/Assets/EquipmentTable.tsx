import type { Equipment } from '../../types'
import { formatDate } from '../../utils/format'
import { useLang } from '../../i18n/LanguageContext'
import { equipmentSystemLabel } from '../../i18n/labels'

interface EquipmentTableProps {
  items: Equipment[]
  selectedId: string | null
  onSelect: (item: Equipment) => void
}

export function EquipmentTable({ items, selectedId, onSelect }: EquipmentTableProps) {
  const { lang } = useLang()
  return (
    <div className="shrink-0 overflow-hidden rounded-xl glass">
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full min-w-[880px] text-left text-xs">
          <thead className="sticky top-0 z-10 bg-navy-850 text-white/60">
            <tr>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Mã' : 'Code'}</th>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Tên thiết bị' : 'Equipment name'}</th>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Hệ thống' : 'System'}</th>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Vị trí' : 'Location'}</th>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Hãng SX' : 'Manufacturer'}</th>
              <th className="px-3 py-2.5 font-medium">Model</th>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Ngày lắp đặt' : 'Install date'}</th>
              <th className="px-3 py-2.5 font-medium">{lang === 'vi' ? 'Hạn bảo hành' : 'Warranty until'}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((eq) => (
              <tr
                key={eq.id}
                onClick={() => onSelect(eq)}
                className={`cursor-pointer border-t border-navy-800 text-white/75 hover:bg-navy-850/60 ${
                  selectedId === eq.id ? 'bg-brand/10' : ''
                }`}
              >
                <td className="px-3 py-2.5 font-mono text-white/60">{eq.id}</td>
                <td className="max-w-xs truncate px-3 py-2.5 font-medium text-white/90" title={eq.name[lang]}>
                  {eq.name[lang]}
                </td>
                <td className="px-3 py-2.5">{equipmentSystemLabel(eq.system, lang)}</td>
                <td className="px-3 py-2.5 text-white/60">{eq.location[lang]}</td>
                <td className="px-3 py-2.5">{eq.manufacturer}</td>
                <td className="px-3 py-2.5 font-mono text-white/60">{eq.model}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-white/60">{formatDate(eq.installDate)}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-white/60">{formatDate(eq.warrantyUntil)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-white/45">
            {lang === 'vi' ? 'Không có thiết bị phù hợp bộ lọc.' : 'No equipment matches the current filters.'}
          </p>
        )}
      </div>
    </div>
  )
}

import { Camera } from 'lucide-react'
import { sitePhotos } from '../../data/sitePhotos'
import { formatDate } from '../../utils/format'
import { useLang } from '../../i18n/LanguageContext'

export function SitePhotoGrid() {
  const { lang } = useLang()
  return (
    <div className="rounded-xl glass p-4">
      <p className="mb-3 text-sm font-semibold text-white/90">
        {lang === 'vi' ? 'Hình ảnh hiện trường theo mốc thời gian' : 'Site photos by timeline milestone'}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {sitePhotos.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-lg border border-navy-700">
            <div
              className="flex h-24 items-center justify-center"
              style={{ backgroundColor: `${p.color}33` }}
            >
              <Camera size={22} style={{ color: p.color }} />
            </div>
            <div className="bg-navy-850 px-2.5 py-2">
              <p className="truncate text-[11px] font-medium text-white/75" title={p.location[lang]}>
                {p.location[lang]}
              </p>
              <p className="mt-0.5 text-[10px] text-white/45">
                Block {p.block} · {formatDate(p.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

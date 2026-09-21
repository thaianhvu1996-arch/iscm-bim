import {
  LayoutDashboard,
  Box,
  CalendarRange,
  Calculator,
  AlertTriangle,
  History,
  Package,
  type LucideIcon,
} from 'lucide-react'
import type { ScreenId } from '../../types'
import { screenLabel } from '../../data/roles'
import { useRole } from '../../context/RoleContext'
import { useLang } from '../../i18n/LanguageContext'
import iscmShorten from '../../assets/logos/iscm_shorten.png'

const NAV_ICONS: Record<ScreenId, LucideIcon> = {
  dashboard: LayoutDashboard,
  model3d: Box,
  schedule: CalendarRange,
  quantity: Calculator,
  clash: AlertTriangle,
  asbuilt: History,
  assets: Package,
}

interface SidebarProps {
  active: ScreenId
  onNavigate: (screen: ScreenId) => void
  onLogoClick: () => void
}

export function Sidebar({ active, onNavigate, onLogoClick }: SidebarProps) {
  const { permissions } = useRole()
  const { lang, setLang } = useLang()

  return (
    <aside className="glass flex h-full w-64 shrink-0 flex-col rounded-2xl">
      <div className="flex items-center justify-between gap-2 rounded-t-2xl border-b border-white/10 px-5 py-5">
        <button
          type="button"
          onClick={onLogoClick}
          className="glass-hover -m-1 flex min-w-0 items-center gap-2.5 rounded-lg p-1 text-left"
          title={lang === 'vi' ? 'Về màn hình giới thiệu' : 'Back to intro screen'}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
            <img src={iscmShorten} alt="ISCM" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-white/92">BIM Monitoring</p>
            <p className="truncate text-xs text-white/50">ISCM–UEH</p>
          </div>
        </button>

        <div
          className="flex shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            onClick={() => setLang('vi')}
            className={`rounded-full px-2 py-1 text-[11px] font-semibold transition-colors ${
              lang === 'vi' ? 'bg-brand text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            VI
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`rounded-full px-2 py-1 text-[11px] font-semibold transition-colors ${
              lang === 'en' ? 'bg-brand text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {permissions.visibleScreens.map((screen) => {
          const Icon = NAV_ICONS[screen]
          const isActive = screen === active
          return (
            <button
              key={screen}
              type="button"
              onClick={() => onNavigate(screen)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-brand/15 text-brand'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              <span className="truncate">{screenLabel(screen, lang)}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[11px] leading-relaxed text-white/40">
          {lang === 'vi' ? 'Demo trình bày · Dữ liệu mẫu minh hoạ' : 'Presentation demo · Illustrative sample data'}
        </p>
      </div>
    </aside>
  )
}

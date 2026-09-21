import type { ScreenId, UserRole } from '../../types'
import { ROLE_LABELS, ROLE_ORDER, SCREEN_LABELS } from '../../data/roles'
import { useRole } from '../../context/RoleContext'
import { useLiveMinutesAgo } from '../../hooks/useLiveMinutesAgo'
import { PLATFORM_TITLE } from '../../data/constants'

interface TopBarProps {
  active: ScreenId
}

export function TopBar({ active }: TopBarProps) {
  const { role, setRole } = useRole()
  const minutesAgo = useLiveMinutesAgo()

  return (
    <header className="glass flex h-20 shrink-0 items-center justify-between rounded-2xl px-6">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-brand">{SCREEN_LABELS[active]}</p>
        <h1 className="truncate font-heading text-base font-semibold text-white/92">{PLATFORM_TITLE}</h1>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-success" />
          </span>
          <span>Cập nhật lần cuối: {minutesAgo} phút trước</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
        {ROLE_ORDER.map((r) => (
          <RoleButton key={r} role={r} active={role === r} onClick={() => setRole(r)} />
        ))}
      </div>
    </header>
  )
}

function RoleButton({
  role,
  active,
  onClick,
}: {
  role: UserRole
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
        active ? 'glow-brand bg-brand text-white' : 'text-white/60 hover:text-white/90'
      }`}
    >
      {ROLE_LABELS[role]}
    </button>
  )
}

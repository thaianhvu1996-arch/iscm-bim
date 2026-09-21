import type { ReactNode } from 'react'

type Accent = 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'neutral'

const ACCENT_CLASSES: Record<Accent, string> = {
  brand: 'bg-brand/15 text-brand',
  info: 'bg-status-info/15 text-status-info',
  success: 'bg-status-success/15 text-status-success',
  warning: 'bg-status-warning/15 text-status-warning',
  danger: 'bg-status-danger/15 text-status-danger',
  neutral: 'bg-white/10 text-white/70',
}

interface KpiCardProps {
  label: string
  value: string
  icon: ReactNode
  accent?: Accent
  sub?: string
}

export function KpiCard({ label, value, icon, accent = 'neutral', sub }: KpiCardProps) {
  return (
    <div className="glass glass-hover animate-countup flex flex-col gap-3 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/55">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${ACCENT_CLASSES[accent]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="font-heading text-2xl font-semibold tabular-nums text-white/92">{value}</p>
        {sub && <p className="mt-1 text-xs text-white/45">{sub}</p>}
      </div>
    </div>
  )
}

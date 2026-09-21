interface ChartTooltipPayloadItem {
  name?: string
  value?: number | string
  color?: string
  payload?: Record<string, unknown>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: ChartTooltipPayloadItem[]
  label?: string | number
  formatter?: (item: ChartTooltipPayloadItem) => string
}

export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  const items = payload?.filter((p) => p.name)
  if (!active || !items || items.length === 0) return null
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      {label !== undefined && <p className="mb-1.5 font-medium text-white/80">{label}</p>}
      <div className="space-y-1">
        {items.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-white/55">{p.name}:</span>
            <span className="font-medium tabular-nums text-white/92">
              {formatter ? formatter(p) : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

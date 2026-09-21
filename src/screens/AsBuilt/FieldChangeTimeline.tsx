import { useState, type ReactNode } from 'react'
import type { BlockId } from '../../types'
import { fieldChanges } from '../../data/fieldChanges'
import { BLOCKS } from '../../data/constants'
import { Badge } from '../../components/common/Badge'
import { fieldChangeStatusTone } from '../../utils/tone'
import { formatDate } from '../../utils/format'
import { useLang } from '../../i18n/LanguageContext'
import { disciplineLabel, fieldChangeStatusLabel } from '../../i18n/labels'

type BlockFilter = 'all' | BlockId

export function FieldChangeTimeline() {
  const { lang } = useLang()
  const [blockFilter, setBlockFilter] = useState<BlockFilter>('all')
  const items = [...fieldChanges]
    .filter((c) => blockFilter === 'all' || c.block === blockFilter)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="rounded-xl glass p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white/90">
          {lang === 'vi' ? 'Dòng thời gian thay đổi hiện trường' : 'Field change timeline'}
        </p>
        <div className="flex gap-1.5">
          <FilterChip active={blockFilter === 'all'} onClick={() => setBlockFilter('all')}>
            {lang === 'vi' ? 'Tất cả' : 'All'}
          </FilterChip>
          {BLOCKS.map((b) => (
            <FilterChip key={b.id} active={blockFilter === b.id} onClick={() => setBlockFilter(b.id)}>
              {b.id}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="max-h-[520px] space-y-0 overflow-y-auto pr-1">
        {items.map((c, i) => (
          <div key={c.id} className="relative flex gap-3 pb-4 pl-1">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand bg-navy-900" />
              {i < items.length - 1 && <span className="mt-1 w-px flex-1 bg-navy-700" />}
            </div>
            <div className="flex-1 pb-1">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-white/45">
                <span className="font-medium text-white/75">{formatDate(c.date)}</span>
                <span>·</span>
                <span>Block {c.block}</span>
                <span>·</span>
                <span>{disciplineLabel(c.discipline, lang)}</span>
                <Badge tone={fieldChangeStatusTone(c.modelStatus)} className="ml-auto">
                  {fieldChangeStatusLabel(c.modelStatus, lang)}
                </Badge>
              </div>
              <p className="text-sm text-white/90">{c.description[lang]}</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-white/45">
                <span>{lang === 'vi' ? 'Lý do' : 'Reason'}: {c.reason[lang]}</span>
                <span>{lang === 'vi' ? 'Người báo' : 'Reported by'}: {c.reporter}</span>
                <span>{lang === 'vi' ? 'Ảnh hưởng KL' : 'Qty impact'}: {c.quantityImpact[lang]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-brand text-white' : 'bg-navy-800 text-white/60 hover:text-white/90'
      }`}
    >
      {children}
    </button>
  )
}

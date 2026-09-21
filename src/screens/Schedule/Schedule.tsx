import { useMemo, useState, type ReactNode } from 'react'
import { Flame } from 'lucide-react'
import type { BlockId, Discipline } from '../../types'
import { scheduleItems } from '../../data/schedule'
import { BLOCKS, DISCIPLINES } from '../../data/constants'
import { GanttChart } from './GanttChart'
import { ScheduleTable } from './ScheduleTable'
import { SitePhotoGrid } from './SitePhotoGrid'
import { useLang } from '../../i18n/LanguageContext'
import { disciplineLabel } from '../../i18n/labels'

type BlockFilter = 'all' | BlockId
type DisciplineFilter = 'all' | Discipline

export function Schedule() {
  const { lang } = useLang()
  const [blockFilter, setBlockFilter] = useState<BlockFilter>('all')
  const [disciplineFilter, setDisciplineFilter] = useState<DisciplineFilter>('all')

  const filteredItems = useMemo(() => {
    return scheduleItems.filter((item) => {
      const blockOk =
        blockFilter === 'all' || item.block === blockFilter || item.block === 'Toàn dự án'
      const disciplineOk = disciplineFilter === 'all' || item.discipline === disciplineFilter
      return blockOk && disciplineOk
    })
  }, [blockFilter, disciplineFilter])

  const criticalDelayed = useMemo(
    () => scheduleItems.filter((i) => i.isCriticalPath && i.status === 'Chậm tiến độ'),
    [],
  )

  return (
    <div className="flex flex-col gap-4 p-6">
      {criticalDelayed.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger/10 px-4 py-3">
          <Flame size={16} className="mt-0.5 shrink-0 text-status-danger" />
          <div className="text-sm text-white/90">
            <span className="font-semibold text-status-danger">
              {lang === 'vi'
                ? `${criticalDelayed.length} hạng mục đường găng đang chậm tiến độ`
                : `${criticalDelayed.length} critical-path items delayed`}
            </span>{' '}
            — {lang === 'vi' ? 'đe doạ tiến độ tổng thể' : 'threatening overall schedule'}:{' '}
            {criticalDelayed
              .map((i) => `${i.name[lang]} (+${i.delayDays} ${lang === 'vi' ? 'ngày' : 'days'})`)
              .join('; ')}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-xl glass p-3">
        <span className="text-xs font-medium text-white/45">{lang === 'vi' ? 'Lọc theo block:' : 'Filter by block:'}</span>
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
        <span className="ml-3 text-xs font-medium text-white/45">{lang === 'vi' ? 'Bộ môn:' : 'Discipline:'}</span>
        <div className="flex gap-1.5">
          <FilterChip active={disciplineFilter === 'all'} onClick={() => setDisciplineFilter('all')}>
            {lang === 'vi' ? 'Tất cả' : 'All'}
          </FilterChip>
          {DISCIPLINES.map((d) => (
            <FilterChip key={d} active={disciplineFilter === d} onClick={() => setDisciplineFilter(d)}>
              {disciplineLabel(d, lang)}
            </FilterChip>
          ))}
        </div>
        <span className="ml-auto text-xs text-white/45">
          {filteredItems.length} {lang === 'vi' ? 'hạng mục' : 'items'}
        </span>
      </div>

      <GanttChart items={filteredItems} />
      <ScheduleTable items={filteredItems} />
      <SitePhotoGrid />
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
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-brand text-white' : 'bg-navy-800 text-white/60 hover:text-white/90'
      }`}
    >
      {children}
    </button>
  )
}

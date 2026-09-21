import { useMemo, useState, type ReactNode } from 'react'
import { ShieldCheck, Search } from 'lucide-react'
import type { BlockId, Clash as ClashType, ClashSeverity, ClashStatus } from '../../types'
import { clashes } from '../../data/clashes'
import { BLOCKS } from '../../data/constants'
import { getPreventedCost } from '../../utils/metrics'
import { formatVNDShort } from '../../utils/format'
import { ClashCharts } from './ClashCharts'
import { ClashTable, type SortState } from './ClashTable'
import { ClashDetailPanel } from './ClashDetailPanel'
import { useLang } from '../../i18n/LanguageContext'
import { clashStatusLabel } from '../../i18n/labels'

type BlockFilter = 'all' | BlockId
type SeverityFilter = 'all' | ClashSeverity
type StatusFilter = 'all' | ClashStatus

const SEVERITIES: ClashSeverity[] = ['A', 'B', 'C']
const STATUSES: ClashStatus[] = ['Mới', 'Đang xử lý', 'Đã xử lý', 'Bỏ qua']

export function Clash() {
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [blockFilter, setBlockFilter] = useState<BlockFilter>('all')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortState>({ key: 'dueDate', direction: 'asc' })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ClashStatus>>({})

  const displayClashes = useMemo<ClashType[]>(
    () => clashes.map((c) => (statusOverrides[c.id] ? { ...c, status: statusOverrides[c.id] } : c)),
    [statusOverrides],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = displayClashes.filter((c) => {
      if (blockFilter !== 'all' && c.block !== blockFilter) return false
      if (severityFilter !== 'all' && c.severity !== severityFilter) return false
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (q && !c.description[lang].toLowerCase().includes(q) && !c.id.toLowerCase().includes(q)) return false
      return true
    })
    const dir = sort.direction === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case 'id':
          return a.id.localeCompare(b.id) * dir
        case 'severity':
          return a.severity.localeCompare(b.severity) * dir
        case 'block':
          return a.block.localeCompare(b.block) * dir
        case 'estimatedCost':
          return (a.estimatedCost - b.estimatedCost) * dir
        case 'status':
          return a.status.localeCompare(b.status) * dir
        case 'dueDate':
          return (a.dueDate.getTime() - b.dueDate.getTime()) * dir
        default:
          return 0
      }
    })
  }, [displayClashes, search, blockFilter, severityFilter, statusFilter, sort, lang])

  const selected = displayClashes.find((c) => c.id === selectedId) ?? null
  const preventedCost = getPreventedCost()

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
        <div className="flex items-center gap-4 rounded-xl border border-status-success/30 bg-status-success/10 px-5 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-status-success/20 text-status-success">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-white/60">
              {lang === 'vi' ? 'Tổng chi phí rủi ro đã ngăn ngừa' : 'Total risk cost prevented'}
            </p>
            <p className="text-3xl font-bold text-status-success">{formatVNDShort(preventedCost, lang)}</p>
          </div>
          <p className="ml-auto max-w-xs text-xs leading-relaxed text-white/60">
            {lang === 'vi'
              ? 'Tổng chi phí ước tính của các xung đột nhóm A, B đã được phát hiện và xử lý qua mô hình BIM trước khi thi công.'
              : 'Total estimated cost of Group A/B clashes detected and resolved on the BIM model before construction.'}
          </p>
        </div>

        <ClashCharts />

        <div className="flex flex-wrap items-center gap-3 rounded-xl glass p-3">
          <div className="flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-850 px-2.5 py-1.5">
            <Search size={13} className="text-white/45" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'vi' ? 'Tìm theo mã hoặc mô tả...' : 'Search by code or description...'}
              className="w-48 bg-transparent text-xs text-white/90 placeholder:text-white/35 focus:outline-none"
            />
          </div>
          <FilterGroup label="Block">
            <FilterChip active={blockFilter === 'all'} onClick={() => setBlockFilter('all')}>
              {lang === 'vi' ? 'Tất cả' : 'All'}
            </FilterChip>
            {BLOCKS.map((b) => (
              <FilterChip key={b.id} active={blockFilter === b.id} onClick={() => setBlockFilter(b.id)}>
                {b.id}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label={lang === 'vi' ? 'Mức độ' : 'Severity'}>
            <FilterChip active={severityFilter === 'all'} onClick={() => setSeverityFilter('all')}>
              {lang === 'vi' ? 'Tất cả' : 'All'}
            </FilterChip>
            {SEVERITIES.map((s) => (
              <FilterChip key={s} active={severityFilter === s} onClick={() => setSeverityFilter(s)}>
                {s}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label={lang === 'vi' ? 'Trạng thái' : 'Status'}>
            <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
              {lang === 'vi' ? 'Tất cả' : 'All'}
            </FilterChip>
            {STATUSES.map((s) => (
              <FilterChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {clashStatusLabel(s, lang)}
              </FilterChip>
            ))}
          </FilterGroup>
          <span className="ml-auto text-xs text-white/45">
            {filtered.length} / {clashes.length} {lang === 'vi' ? 'xung đột' : 'clashes'}
          </span>
        </div>

        <ClashTable items={filtered} selectedId={selectedId} onSelect={(c) => setSelectedId(c.id)} sort={sort} onSortChange={setSort} />
      </div>

      {selected && (
        <ClashDetailPanel
          clash={selected}
          onClose={() => setSelectedId(null)}
          onChangeStatus={(id, status) => setStatusOverrides((prev) => ({ ...prev, [id]: status }))}
        />
      )}
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-white/45">{label}:</span>
      {children}
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

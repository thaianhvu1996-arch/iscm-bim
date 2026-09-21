import { useMemo, useState, type ReactNode } from 'react'
import { FileBarChart, TrendingUp, AlertTriangle, Gauge, Wallet } from 'lucide-react'
import type { BlockId, Discipline } from '../../types'
import { quantityItems, QUANTITY_GROUPS, type QuantityStatus } from '../../data/quantities'
import { BLOCKS, DISCIPLINES } from '../../data/constants'
import {
  getContractValue,
  getExecutedValue,
  getTotalQuantityVariance,
  getFlaggedQuantityCount,
  MODEL_TAKEOFF_COVERAGE,
} from '../../utils/metrics'
import { formatVNDShort } from '../../utils/format'
import { KpiCard } from '../../components/common/KpiCard'
import { QuantityCharts } from './QuantityCharts'
import { QuantityTable } from './QuantityTable'
import { QuantityDetailPanel } from './QuantityDetailPanel'
import { ProcurementBatches } from './ProcurementBatches'
import { useLang } from '../../i18n/LanguageContext'
import { disciplineLabel, quantityStatusLabel } from '../../i18n/labels'

type BlockFilter = 'all' | BlockId
type DisciplineFilter = 'all' | Discipline
type StatusFilter = 'all' | QuantityStatus
type SortKey = 'costImpact' | 'diffPercent' | 'id'

const STATUSES: QuantityStatus[] = ['Khớp', 'Cần rà soát', 'Chênh lệch lớn']

interface QuantityProps {
  onViewOn3D: (block: BlockId | 'all', discipline: Discipline) => void
}

export function Quantity({ onViewOn3D }: QuantityProps) {
  const { lang } = useLang()
  const [blockFilter, setBlockFilter] = useState<BlockFilter>('all')
  const [disciplineFilter, setDisciplineFilter] = useState<DisciplineFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('costImpact')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const list = quantityItems.filter((i) => {
      if (blockFilter !== 'all' && i.block !== blockFilter) return false
      if (disciplineFilter !== 'all' && i.discipline !== disciplineFilter) return false
      if (statusFilter !== 'all' && i.status !== statusFilter) return false
      return true
    })
    return [...list].sort((a, b) => {
      if (sortKey === 'id') return a.id.localeCompare(b.id)
      if (sortKey === 'diffPercent') return Math.abs(b.diffPercent) - Math.abs(a.diffPercent)
      return Math.abs(b.costImpact) - Math.abs(a.costImpact)
    })
  }, [blockFilter, disciplineFilter, statusFilter, sortKey])

  const selected = quantityItems.find((i) => i.id === selectedId) ?? null

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          <KpiCard
            label={lang === 'vi' ? 'Giá trị hợp đồng' : 'Contract value'}
            value={formatVNDShort(getContractValue(), lang)}
            icon={<Wallet size={16} />}
            accent="neutral"
          />
          <KpiCard
            label={lang === 'vi' ? 'Giá trị đã thực hiện' : 'Value executed'}
            value={formatVNDShort(getExecutedValue(), lang)}
            icon={<TrendingUp size={16} />}
            accent="info"
          />
          <KpiCard
            label={lang === 'vi' ? 'Chênh lệch khối lượng phát hiện' : 'Quantity variance detected'}
            value={formatVNDShort(getTotalQuantityVariance(), lang)}
            icon={<FileBarChart size={16} />}
            accent="brand"
          />
          <KpiCard
            label={lang === 'vi' ? 'Hạng mục cảnh báo' : 'Flagged items'}
            value={String(getFlaggedQuantityCount())}
            icon={<AlertTriangle size={16} />}
            accent="warning"
          />
          <KpiCard
            label={lang === 'vi' ? 'KL bóc tự động từ mô hình' : 'Qty auto-derived from model'}
            value={`${MODEL_TAKEOFF_COVERAGE}%`}
            icon={<Gauge size={16} />}
            accent="success"
          />
        </div>

        <QuantityCharts />

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
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
          <FilterGroup label={lang === 'vi' ? 'Bộ môn' : 'Discipline'}>
            <FilterChip active={disciplineFilter === 'all'} onClick={() => setDisciplineFilter('all')}>
              {lang === 'vi' ? 'Tất cả' : 'All'}
            </FilterChip>
            {DISCIPLINES.map((d) => (
              <FilterChip key={d} active={disciplineFilter === d} onClick={() => setDisciplineFilter(d)}>
                {disciplineLabel(d, lang)}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label={lang === 'vi' ? 'Trạng thái' : 'Status'}>
            <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
              {lang === 'vi' ? 'Tất cả' : 'All'}
            </FilterChip>
            {STATUSES.map((s) => (
              <FilterChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {quantityStatusLabel(s, lang)}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label={lang === 'vi' ? 'Sắp xếp' : 'Sort'}>
            <FilterChip active={sortKey === 'costImpact'} onClick={() => setSortKey('costImpact')}>
              {lang === 'vi' ? 'Ảnh hưởng chi phí' : 'Cost impact'}
            </FilterChip>
            <FilterChip active={sortKey === 'diffPercent'} onClick={() => setSortKey('diffPercent')}>
              {lang === 'vi' ? '% chênh lệch' : '% variance'}
            </FilterChip>
            <FilterChip active={sortKey === 'id'} onClick={() => setSortKey('id')}>
              {lang === 'vi' ? 'Mã' : 'Code'}
            </FilterChip>
          </FilterGroup>
          <span className="ml-auto text-xs text-white/45">
            {filtered.length} / {quantityItems.length} {lang === 'vi' ? 'hạng mục' : 'items'} · {QUANTITY_GROUPS.length}{' '}
            {lang === 'vi' ? 'nhóm công tác' : 'work groups'}
          </span>
        </div>

        <QuantityTable items={filtered} selectedId={selectedId} onSelect={(i) => setSelectedId(i.id)} />

        <ProcurementBatches />
      </div>

      {selected && (
        <QuantityDetailPanel
          item={selected}
          onClose={() => setSelectedId(null)}
          onViewOn3D={(item) => onViewOn3D(item.block === 'Toàn dự án' ? 'all' : item.block, item.discipline)}
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

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-brand text-white' : 'bg-white/5 text-white/55 hover:text-white/85'
      }`}
    >
      {children}
    </button>
  )
}

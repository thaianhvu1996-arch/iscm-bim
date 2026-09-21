import { useEffect, useMemo, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import type { BlockId, Clash, Discipline } from '../../types'
import { DISCIPLINES } from '../../data/constants'
import { clashes } from '../../data/clashes'
import { useRole } from '../../context/RoleContext'
import { Scene } from './scene/Scene'
import { DisciplinePanel } from './DisciplinePanel'
import { MonthSlider } from './MonthSlider'
import { ClashInfoPanel } from './ClashInfoPanel'
import { stageMonth } from './constructionStages'

const ALL_VISIBLE: Record<Discipline, boolean> = DISCIPLINES.reduce(
  (acc, d) => ({ ...acc, [d]: true }),
  {} as Record<Discipline, boolean>,
)

const OPEN_CLASHES = clashes.filter((c) => c.status === 'Mới' || c.status === 'Đang xử lý')

export interface Model3DFocus {
  block: BlockId | 'all'
  discipline: Discipline
}

interface Model3DProps {
  focus?: Model3DFocus | null
}

export function Model3D({ focus }: Model3DProps) {
  const { permissions } = useRole()
  const [month, setMonth] = useState(4)
  const [visible, setVisible] = useState<Record<Discipline, boolean>>(ALL_VISIBLE)
  const [selectedBlock, setSelectedBlock] = useState<BlockId | 'all'>('all')
  const [cutEnabled, setCutEnabled] = useState(false)
  const [cutPosition, setCutPosition] = useState(135)
  const [selectedClash, setSelectedClash] = useState<Clash | null>(null)
  const [focusDismissed, setFocusDismissed] = useState(false)

  useEffect(() => {
    if (!focus) return
    setSelectedBlock(focus.block)
    setVisible(
      DISCIPLINES.reduce((acc, d) => ({ ...acc, [d]: d === focus.discipline }), {} as Record<Discipline, boolean>),
    )
    setMonth(9)
    setFocusDismissed(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus])

  const visibleMarkers = useMemo(() => {
    if (!permissions.canSeeClashDetail) return []
    return OPEN_CLASHES.filter((c) => {
      if (selectedBlock !== 'all' && c.block !== selectedBlock) return false
      return month >= stageMonth(c.block, 'foundation')
    })
  }, [selectedBlock, month, permissions.canSeeClashDetail])

  const toggleDiscipline = (d: Discipline) => setVisible((prev) => ({ ...prev, [d]: !prev[d] }))

  const clearFocus = () => {
    setVisible(ALL_VISIBLE)
    setSelectedBlock('all')
    setFocusDismissed(true)
  }

  const showFocusBanner = Boolean(focus) && !focusDismissed

  return (
    <div className="flex h-full gap-4 p-4">
      <DisciplinePanel
        visible={visible}
        onToggle={toggleDiscipline}
        selectedBlock={selectedBlock}
        onSelectBlock={setSelectedBlock}
        cutEnabled={cutEnabled}
        onToggleCut={() => setCutEnabled((v) => !v)}
        cutPosition={cutPosition}
        onCutPositionChange={setCutPosition}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
          <Scene
            currentMonth={month}
            visible={visible}
            selectedBlock={selectedBlock}
            cutEnabled={cutEnabled}
            cutPosition={cutPosition}
            clashMarkers={visibleMarkers}
            selectedClashId={selectedClash?.id ?? null}
            onSelectClash={setSelectedClash}
          />
          {selectedClash && (
            <ClashInfoPanel clash={selectedClash} onClose={() => setSelectedClash(null)} />
          )}
          {showFocusBanner && focus && (
            <div className="glow-brand absolute left-4 top-4 flex items-center gap-2.5 rounded-lg border border-brand/40 bg-brand/15 px-3 py-1.5 text-xs text-white backdrop-blur">
              <Sparkles size={13} className="text-brand" />
              Đang làm nổi bật: {focus.discipline} · {focus.block === 'all' ? 'Toàn dự án' : `Block ${focus.block}`}
              <button type="button" onClick={clearFocus} className="text-white/60 hover:text-white">
                <X size={13} />
              </button>
            </div>
          )}
          {!showFocusBanner && permissions.canSeeClashDetail && (
            <div className="glass pointer-events-none absolute left-4 top-4 rounded-lg px-3 py-1.5 text-xs text-white/60">
              {visibleMarkers.length} xung đột chưa xử lý đang hiển thị
            </div>
          )}
        </div>
        <MonthSlider month={month} onChange={setMonth} />
      </div>
    </div>
  )
}

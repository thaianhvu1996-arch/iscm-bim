import { BLOCKS } from '../../data/constants'
import { MODEL_MATCH_RATE, MODEL_MATCH_RATE_AVG } from '../../data/modelVersions'

export function MatchRateBlock() {
  return (
    <div className="rounded-xl glass p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-white/90">Mức độ trùng khớp mô hình với hiện trạng</p>
        <span className="text-xs text-white/45">Trung bình {MODEL_MATCH_RATE_AVG}%</span>
      </div>
      <div className="space-y-3">
        {BLOCKS.map((b) => {
          const rate = MODEL_MATCH_RATE[b.id]
          return (
            <div key={b.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-white/75">Block {b.id}</span>
                <span className="font-medium tabular-nums text-white/90">{rate}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-navy-800">
                <div
                  className="h-full rounded-full bg-status-success"
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

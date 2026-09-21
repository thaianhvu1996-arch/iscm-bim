import { Download } from 'lucide-react'
import { modelVersions } from '../../data/modelVersions'
import { formatDate } from '../../utils/format'

export function ModelVersionTable() {
  return (
    <div className="rounded-xl glass p-4">
      <p className="mb-3 text-sm font-semibold text-white/90">Phiên bản mô hình</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="text-white/45">
            <tr className="border-b border-navy-700">
              <th className="py-2 pr-3 font-medium">Phiên bản</th>
              <th className="py-2 pr-3 font-medium">Ngày cập nhật</th>
              <th className="py-2 pr-3 font-medium">Số thay đổi tích hợp</th>
              <th className="py-2 pr-3 font-medium">Người thực hiện</th>
              <th className="py-2 pr-3 font-medium">Ghi chú</th>
              <th className="py-2 pr-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {modelVersions.map((v) => (
              <tr key={v.version} className="border-b border-navy-800 text-white/75 last:border-b-0">
                <td className="py-2.5 pr-3 font-mono font-medium text-white/90">{v.version}</td>
                <td className="py-2.5 pr-3 text-white/60">{formatDate(v.date)}</td>
                <td className="py-2.5 pr-3 tabular-nums">{v.changesIntegrated}</td>
                <td className="py-2.5 pr-3">{v.author}</td>
                <td className="py-2.5 pr-3 text-white/45">{v.note}</td>
                <td className="py-2.5 pr-3">
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-md border border-navy-700 px-2 py-1 text-[11px] text-white/60 hover:border-brand hover:text-brand"
                    title="Demo - không tải file thật"
                  >
                    <Download size={11} /> Tải xuống
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

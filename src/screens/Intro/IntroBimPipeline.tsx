import { Boxes, GitMerge, CalendarClock, Calculator, History, Settings, Globe2, ArrowDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface PipelineStage {
  icon: LucideIcon
  number: string
  dimension: string
  label: string
  detail: string
  tools: string[]
  standard?: string
  bridge: string
}

const STAGES: PipelineStage[] = [
  {
    icon: Boxes,
    number: '01',
    dimension: '3D',
    label: 'Mô hình theo bộ môn',
    detail:
      'Mỗi bộ môn dựng mô hình bản địa (native model) theo đúng mức độ chi tiết (LOD) quy định trong EIR/BEP — không phải "mô hình cô đơn" (lonely model) chỉ để xuất bản vẽ, mà phải thể hiện đúng chủ ý thi công (design intent).',
    tools: ['Revit — Kiến trúc, Kết cấu, MEP', 'Civil 3D — Hạ tầng'],
    standard: 'ISO 19650-2 · TCVN 14177 · quy ước đặt tên & hệ toạ độ chung',
    bridge: 'Nộp lên CDE (trạng thái Shared)',
  },
  {
    icon: GitMerge,
    number: '02',
    dimension: '—',
    label: 'Phối hợp — Kiểm tra xung đột',
    detail:
      'Mô hình từng bộ môn được gộp thành một mô hình liên bang (federated model) qua định dạng mở IFC, chạy kiểm tra xung đột, phân loại theo mức ảnh hưởng chi phí rồi xuất báo cáo cho từng bộ môn xử lý — lặp lại đến khi sạch.',
    tools: ['Navisworks', 'Solibri Model Checker', 'BIMSight', 'Bentley Project Navigator'],
    standard: 'Báo cáo xung đột xuất theo chuẩn BCF (BIM Collaboration Format)',
    bridge: 'Mô hình liên bang sạch xung đột nhóm A → chuyển trạng thái Published',
  },
  {
    icon: CalendarClock,
    number: '03',
    dimension: '4D',
    label: 'Tiến độ thi công',
    detail:
      'Mỗi cấu kiện trong mô hình liên bang được liên kết với đúng một dòng tiến độ (WBS — Work Breakdown Structure), tạo ra mô phỏng trình tự thi công theo thời gian thực — không chỉ để trình bày cho chủ đầu tư mà còn để rà soát phương án thi công và hậu cần công trường.',
    tools: ['Synchro Pro', 'Navisworks TimeLiner', 'Vico Office'],
    standard: 'Tiến độ nguồn: Primavera P6 · MS Project · Asta Powerproject',
    bridge: 'Mô hình đã gắn thời gian → làm nền cho 5D',
  },
  {
    icon: Calculator,
    number: '04',
    dimension: '5D',
    label: 'Khối lượng & Chi phí',
    detail:
      'Khối lượng được bóc tự động (QTO) thẳng từ hình học và thuộc tính cấu kiện trong mô hình liên bang — nhưng định dạng xuất ra từ phần mềm dựng mô hình thường không khớp trực tiếp với phần mềm dự toán chuyên dụng, nên cần add-in chuyển đổi định dạng phù hợp.',
    tools: ['CostX', 'Causeway', 'Vico Office', 'iTWO'],
    standard: 'Người phụ trách: kỹ sư dự toán (estimating engineer)',
    bridge: 'Bảng khối lượng liên kết Cấu kiện ↔ Khối lượng ↔ Đơn giá, đối chiếu hợp đồng theo thời gian thực',
  },
  {
    icon: History,
    number: '05',
    dimension: '—',
    label: 'Hoàn công',
    detail:
      'Thay đổi tại hiện trường được ghi nhận bằng phiếu chuẩn hoá trong vòng 5 ngày kể từ khi phát sinh — thay đổi không ghi nhận coi như không tồn tại. Mô hình được cập nhật theo chu kỳ cố định, đối soát lại với hiện trạng trước khi chốt phiên bản.',
    tools: ['Phiếu thay đổi hiện trường (biểu mẫu chuẩn + ảnh)', 'CDE — thư mục hiện trường'],
    bridge: 'Mô hình hoàn công khớp hiện trạng cao, sẵn sàng bàn giao',
  },
  {
    icon: Settings,
    number: '06/07',
    dimension: '6D/7D',
    label: 'Vận hành & Bảo trì',
    detail:
      'Mô hình thiết kế–thi công (PIM) không đủ và cũng không phù hợp để bàn giao thẳng cho chủ đầu tư vận hành — IFC mang quá nhiều thông tin hình học không cần thiết. COBie ra đời làm cầu nối: một file bảng tính có cấu trúc Facility → Floor → Zone → Space cho không gian, và Type → System → Component cho thiết bị, chỉ tập trung vào dữ liệu vận hành (FF&E).',
    tools: ['IBM Maximo', 'ARCHIBUS', 'Autodesk Building Ops', 'Trimble Manhattan'],
    standard: 'PAS 1192-3 · ISO 55000 · khái niệm OIR/AIR · nguyên tắc GSL (đưa đội vận hành tham gia từ sớm, không đợi đến bàn giao)',
    bridge: 'PIM (mô hình dự án) → COBie → AIM (mô hình tài sản vận hành)',
  },
  {
    icon: Globe2,
    number: '08',
    dimension: 'Twin',
    label: 'Digital Twin đô thị',
    detail:
      'Mô hình đã chuẩn hoá và gắn mã định danh công trình được ghép vào hệ thống GIS chung, kết hợp dữ liệu cảm biến thời gian thực — trở thành một lớp dữ liệu trong bản sao số phục vụ ra quyết định ở cấp đô thị.',
    tools: ['Tích hợp BIM–GIS', 'Cảm biến IoT thời gian thực'],
    standard: 'Mã định danh công trình & Cơ sở dữ liệu quốc gia (Thông tư 24/2025/TT-BXD)',
    bridge: 'Một lớp dữ liệu trong bản sao số đô thị',
  },
]

export function IntroBimPipeline() {
  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      <p className="mb-6 text-sm leading-relaxed text-white/60">
        Ba môn phối hợp cốt lõi của BIM — 3D, 4D, 5D — đã phát triển và hiệu quả nhất trong quy trình, vì đây là những việc ngành xây dựng vốn đã làm; BIM giúp hệ thống hoá và loại bỏ các bước thừa của cách làm 2D. Ở mỗi giai đoạn dưới đây, phần quan trọng nhất không phải là công cụ, mà là <strong className="text-white/80">định dạng hoặc quy trình dùng để chuyển giao thông tin sang giai đoạn kế tiếp</strong>.
      </p>

      <div className="relative pl-8">
        <div className="lifecycle-line absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px" />

        {STAGES.map((s) => (
          <div key={s.label} className="relative pb-8 last:pb-0">
            <div className="absolute -left-8 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-brand/40 bg-navy-950 text-brand">
              <s.icon size={15} />
            </div>

            <div className="glass rounded-xl p-4 md:p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-bold text-brand">{s.dimension}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-white/35">Giai đoạn {s.number}</span>
              </div>
              <h4 className="mb-2 font-heading text-base font-bold text-white/92 md:text-lg">{s.label}</h4>
              <p className="mb-3 text-sm leading-relaxed text-white/65">{s.detail}</p>

              <div className="mb-2 flex flex-wrap gap-1.5">
                {s.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/55"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {s.standard && <p className="mb-3 text-[11px] leading-relaxed text-white/35">{s.standard}</p>}

              <div className="flex items-start gap-2 rounded-lg border border-brand/20 bg-brand/[0.06] px-3 py-2">
                <ArrowDown size={13} className="mt-0.5 shrink-0 text-brand" />
                <p className="text-xs leading-relaxed text-white/70">{s.bridge}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

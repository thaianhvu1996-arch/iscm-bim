import { Boxes, GitMerge, CalendarClock, Calculator, History, Settings, Globe2, ArrowDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLang, type Lang } from '../../i18n/LanguageContext'

interface PipelineStage {
  icon: LucideIcon
  number: string
  dimension: string
  label: Record<Lang, string>
  detail: Record<Lang, string>
  tools: Record<Lang, string[]>
  standard?: Record<Lang, string>
  bridge: Record<Lang, string>
}

const STAGES: PipelineStage[] = [
  {
    icon: Boxes,
    number: '01',
    dimension: '3D',
    label: { vi: 'Mô hình theo bộ môn', en: 'Discipline models' },
    detail: {
      vi: 'Mỗi bộ môn dựng mô hình bản địa (native model) theo đúng mức độ chi tiết (LOD) quy định trong EIR/BEP — không phải "mô hình cô đơn" (lonely model) chỉ để xuất bản vẽ, mà phải thể hiện đúng chủ ý thi công (design intent).',
      en: 'Each discipline builds its native model to the Level of Detail (LOD) set out in the EIR/BEP — not a "lonely model" built only to output drawings, but one that faithfully carries the design intent.',
    },
    tools: {
      vi: ['Revit — Kiến trúc, Kết cấu, MEP', 'Civil 3D — Hạ tầng'],
      en: ['Revit — Architecture, Structure, MEP', 'Civil 3D — Infrastructure'],
    },
    standard: {
      vi: 'ISO 19650-2 · TCVN 14177 · quy ước đặt tên & hệ toạ độ chung',
      en: 'ISO 19650-2 · TCVN 14177 · shared naming convention & coordinate system',
    },
    bridge: { vi: 'Nộp lên CDE (trạng thái Shared)', en: 'Uploaded to the CDE (Shared status)' },
  },
  {
    icon: GitMerge,
    number: '02',
    dimension: '—',
    label: { vi: 'Phối hợp — Kiểm tra xung đột', en: 'Coordination — Clash detection' },
    detail: {
      vi: 'Mô hình từng bộ môn được gộp thành một mô hình liên bang (federated model) qua định dạng mở IFC, chạy kiểm tra xung đột, phân loại theo mức ảnh hưởng chi phí rồi xuất báo cáo cho từng bộ môn xử lý — lặp lại đến khi sạch.',
      en: 'Discipline models are merged into a federated model through the open IFC format, run through clash detection, ranked by cost impact, and issued back to each discipline as a report to resolve — repeated until clean.',
    },
    tools: {
      vi: ['Navisworks', 'Solibri Model Checker', 'BIMSight', 'Bentley Project Navigator'],
      en: ['Navisworks', 'Solibri Model Checker', 'BIMSight', 'Bentley Project Navigator'],
    },
    standard: {
      vi: 'Báo cáo xung đột xuất theo chuẩn BCF (BIM Collaboration Format)',
      en: 'Clash reports exported in BCF (BIM Collaboration Format)',
    },
    bridge: {
      vi: 'Mô hình liên bang sạch xung đột nhóm A → chuyển trạng thái Published',
      en: 'Federated model clear of Group A clashes → moved to Published status',
    },
  },
  {
    icon: CalendarClock,
    number: '03',
    dimension: '4D',
    label: { vi: 'Tiến độ thi công', en: 'Construction schedule' },
    detail: {
      vi: 'Mỗi cấu kiện trong mô hình liên bang được liên kết với đúng một dòng tiến độ (WBS — Work Breakdown Structure), tạo ra mô phỏng trình tự thi công theo thời gian thực — không chỉ để trình bày cho chủ đầu tư mà còn để rà soát phương án thi công và hậu cần công trường.',
      en: 'Every component in the federated model is linked to exactly one schedule line (WBS — Work Breakdown Structure), producing a time-based construction sequence simulation — used not just to present to the investor, but to review the construction method and site logistics.',
    },
    tools: {
      vi: ['Synchro Pro', 'Navisworks TimeLiner', 'Vico Office'],
      en: ['Synchro Pro', 'Navisworks TimeLiner', 'Vico Office'],
    },
    standard: {
      vi: 'Tiến độ nguồn: Primavera P6 · MS Project · Asta Powerproject',
      en: 'Source schedule: Primavera P6 · MS Project · Asta Powerproject',
    },
    bridge: { vi: 'Mô hình đã gắn thời gian → làm nền cho 5D', en: 'Time-linked model → the foundation for 5D' },
  },
  {
    icon: Calculator,
    number: '04',
    dimension: '5D',
    label: { vi: 'Khối lượng & Chi phí', en: 'Quantity & Cost' },
    detail: {
      vi: 'Khối lượng được bóc tự động (QTO) thẳng từ hình học và thuộc tính cấu kiện trong mô hình liên bang — nhưng định dạng xuất ra từ phần mềm dựng mô hình thường không khớp trực tiếp với phần mềm dự toán chuyên dụng, nên cần add-in chuyển đổi định dạng phù hợp.',
      en: 'Quantities are auto-extracted (QTO) directly from the geometry and properties of components in the federated model — but the export format from modeling software rarely matches specialized estimating software directly, so a format-conversion add-in is needed.',
    },
    tools: {
      vi: ['CostX', 'Causeway', 'Vico Office', 'iTWO'],
      en: ['CostX', 'Causeway', 'Vico Office', 'iTWO'],
    },
    standard: { vi: 'Người phụ trách: kỹ sư dự toán (estimating engineer)', en: 'Owned by: the estimating engineer' },
    bridge: {
      vi: 'Bảng khối lượng liên kết Cấu kiện ↔ Khối lượng ↔ Đơn giá, đối chiếu hợp đồng theo thời gian thực',
      en: 'A quantity schedule links Component ↔ Quantity ↔ Unit price, reconciled against the contract in real time',
    },
  },
  {
    icon: History,
    number: '05',
    dimension: '—',
    label: { vi: 'Hoàn công', en: 'As-Built' },
    detail: {
      vi: 'Thay đổi tại hiện trường được ghi nhận bằng phiếu chuẩn hoá trong vòng 5 ngày kể từ khi phát sinh — thay đổi không ghi nhận coi như không tồn tại. Mô hình được cập nhật theo chu kỳ cố định, đối soát lại với hiện trạng trước khi chốt phiên bản.',
      en: 'Field changes are logged on a standardized form within 5 days of occurring — an unlogged change is treated as if it never happened. The model is updated on a fixed cycle and reconciled against actual conditions before each version is locked.',
    },
    tools: {
      vi: ['Phiếu thay đổi hiện trường (biểu mẫu chuẩn + ảnh)', 'CDE — thư mục hiện trường'],
      en: ['Field change form (standard template + photos)', 'CDE — site folder'],
    },
    bridge: {
      vi: 'Mô hình hoàn công khớp hiện trạng cao, sẵn sàng bàn giao',
      en: 'A high-fidelity as-built model, ready for handover',
    },
  },
  {
    icon: Settings,
    number: '06/07',
    dimension: '6D/7D',
    label: { vi: 'Vận hành & Bảo trì', en: 'Operations & Maintenance' },
    detail: {
      vi: 'Mô hình thiết kế–thi công (PIM) không đủ và cũng không phù hợp để bàn giao thẳng cho chủ đầu tư vận hành — IFC mang quá nhiều thông tin hình học không cần thiết. COBie ra đời làm cầu nối: một file bảng tính có cấu trúc Facility → Floor → Zone → Space cho không gian, và Type → System → Component cho thiết bị, chỉ tập trung vào dữ liệu vận hành (FF&E).',
      en: 'The design-and-construction model (PIM) is neither sufficient nor suited for direct handover to the operating investor — IFC carries far more geometric information than operations needs. COBie bridges the gap: a structured spreadsheet with Facility → Floor → Zone → Space for spaces, and Type → System → Component for equipment, focused purely on operational data (FF&E).',
    },
    tools: {
      vi: ['IBM Maximo', 'ARCHIBUS', 'Autodesk Building Ops', 'Trimble Manhattan'],
      en: ['IBM Maximo', 'ARCHIBUS', 'Autodesk Building Ops', 'Trimble Manhattan'],
    },
    standard: {
      vi: 'PAS 1192-3 · ISO 55000 · khái niệm OIR/AIR · nguyên tắc GSL (đưa đội vận hành tham gia từ sớm, không đợi đến bàn giao)',
      en: 'PAS 1192-3 · ISO 55000 · the OIR/AIR concepts · the GSL principle (bring the operations team in early, not just at handover)',
    },
    bridge: {
      vi: 'PIM (mô hình dự án) → COBie → AIM (mô hình tài sản vận hành)',
      en: 'PIM (project model) → COBie → AIM (asset information model)',
    },
  },
  {
    icon: Globe2,
    number: '08',
    dimension: 'Twin',
    label: { vi: 'Digital Twin đô thị', en: 'Urban Digital Twin' },
    detail: {
      vi: 'Mô hình đã chuẩn hoá và gắn mã định danh công trình được ghép vào hệ thống GIS chung, kết hợp dữ liệu cảm biến thời gian thực — trở thành một lớp dữ liệu trong bản sao số phục vụ ra quyết định ở cấp đô thị.',
      en: 'The standardized model, tagged with a building identifier, is merged into the shared GIS system and combined with real-time sensor data — becoming a data layer in the digital twin that supports decision-making at the city level.',
    },
    tools: {
      vi: ['Tích hợp BIM–GIS', 'Cảm biến IoT thời gian thực'],
      en: ['BIM–GIS integration', 'Real-time IoT sensors'],
    },
    standard: {
      vi: 'Mã định danh công trình & Cơ sở dữ liệu quốc gia (Thông tư 24/2025/TT-BXD)',
      en: 'Building identifier & national database (Circular 24/2025/TT-BXD)',
    },
    bridge: { vi: 'Một lớp dữ liệu trong bản sao số đô thị', en: 'A data layer in the urban digital twin' },
  },
]

export function IntroBimPipeline() {
  const { lang } = useLang()
  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      <p className="mb-6 text-sm leading-relaxed text-white/60">
        {lang === 'vi' ? (
          <>
            Ba môn phối hợp cốt lõi của BIM — 3D, 4D, 5D — đã phát triển và hiệu quả nhất trong quy trình, vì đây là những việc
            ngành xây dựng vốn đã làm; BIM giúp hệ thống hoá và loại bỏ các bước thừa của cách làm 2D. Ở mỗi giai đoạn dưới đây,
            phần quan trọng nhất không phải là công cụ, mà là{' '}
            <strong className="text-white/80">định dạng hoặc quy trình dùng để chuyển giao thông tin sang giai đoạn kế tiếp</strong>.
          </>
        ) : (
          <>
            The three core BIM disciplines — 3D, 4D, 5D — are the most mature and effective in the process, because they are
            work the construction industry already did; BIM systematizes it and strips out the redundant steps of the 2D way
            of working. At each stage below, what matters most isn't the tool — it's{' '}
            <strong className="text-white/80">the format or process used to hand information off to the next stage</strong>.
          </>
        )}
      </p>

      <div className="relative pl-8">
        <div className="lifecycle-line absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px" />

        {STAGES.map((s) => (
          <div key={s.label.vi} className="relative pb-8 last:pb-0">
            <div className="absolute -left-8 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-brand/40 bg-navy-950 text-brand">
              <s.icon size={15} />
            </div>

            <div className="glass rounded-xl p-4 md:p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-bold text-brand">{s.dimension}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-white/35">
                  {lang === 'vi' ? 'Giai đoạn' : 'Stage'} {s.number}
                </span>
              </div>
              <h4 className="mb-2 font-heading text-base font-bold text-white/92 md:text-lg">{s.label[lang]}</h4>
              <p className="mb-3 text-sm leading-relaxed text-white/65">{s.detail[lang]}</p>

              <div className="mb-2 flex flex-wrap gap-1.5">
                {s.tools[lang].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/55"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {s.standard && <p className="mb-3 text-[11px] leading-relaxed text-white/35">{s.standard[lang]}</p>}

              <div className="flex items-start gap-2 rounded-lg border border-brand/20 bg-brand/[0.06] px-3 py-2">
                <ArrowDown size={13} className="mt-0.5 shrink-0 text-brand" />
                <p className="text-xs leading-relaxed text-white/70">{s.bridge[lang]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

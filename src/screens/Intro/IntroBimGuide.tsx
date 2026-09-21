import { useEffect, useState } from 'react'
import {
  Layers,
  Route,
  ShieldCheck,
  PiggyBank,
  Building2,
  ClipboardCheck,
  Handshake,
  Landmark,
  Compass,
  Eye,
  HardHat,
  Radar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { clashes } from '../../data/clashes'
import type { Discipline } from '../../types'
import { IntroSlideScene, type SlideSceneConfig } from './IntroSlideScene'
import { IntroBimPipeline } from './IntroBimPipeline'
import { useInView } from '../../hooks/useInView'
import { useLang, type Lang } from '../../i18n/LanguageContext'

interface PartyRole {
  icon: LucideIcon
  party: Record<Lang, string>
  action: Record<Lang, string>
  emphasis?: boolean
}

interface Slide {
  icon: LucideIcon
  kicker: Record<Lang, string>
  title: Record<Lang, string>
  subtitle?: Record<Lang, string>
  body: Record<Lang, string>
  bullets?: Record<Lang, string[]>
  roles?: PartyRole[]
  /** Renders a full-width detailed diagram instead of the bullets + 3D-panel layout. */
  diagram?: boolean
  scene: SlideSceneConfig
}

const MEP_FOCUS: Discipline[] = ['Kết cấu', 'MEP']
const CLASH_SAMPLE_A = clashes.filter((c) => c.block === 'A').slice(0, 6)
const CLASH_SAMPLE_B = clashes.filter((c) => c.block === 'B').slice(0, 6)

const INVESTOR: Record<Lang, string> = { vi: 'Chủ đầu tư', en: 'Investor' }
const PMC: Record<Lang, string> = { vi: 'Tư vấn QLDA', en: 'PM Consultant' }
const SUPERVISOR: Record<Lang, string> = { vi: 'Tư vấn giám sát', en: 'Supervision Consultant' }
const DB_CONTRACTOR: Record<Lang, string> = { vi: 'Nhà thầu D&B', en: 'D&B Contractor' }
const BIM_CONSULTANT: Record<Lang, string> = { vi: 'Tư vấn BIM (ISCM–UEH)', en: 'BIM Consultant (ISCM–UEH)' }

const SLIDES: Slide[] = [
  {
    icon: Layers,
    kicker: { vi: '01 · Khái niệm', en: '01 · Concept' },
    title: { vi: 'BIM là gì', en: 'What is BIM' },
    body: {
      vi: 'BIM (Building Information Modeling — Mô hình thông tin công trình) là quy trình tạo lập, khai thác và quản lý thông tin công trình trên nền một mô hình số duy nhất, xuyên suốt từ thiết kế, thi công đến vận hành. Mô hình không chỉ chứa hình học 3D mà còn gắn dữ liệu phi hình học: vật liệu, thông số kỹ thuật, chi phí, tiến độ, nhà sản xuất.',
      en: 'BIM (Building Information Modeling) is the process of creating, using, and managing building information on a single digital model, spanning design, construction, and operations. The model holds more than 3D geometry — it also carries non-geometric data: materials, specifications, cost, schedule, manufacturer.',
    },
    bullets: {
      vi: [
        'Một nguồn dữ liệu duy nhất, thay vì hàng trăm bản vẽ 2D rời rạc dễ sai lệch',
        'Ba trụ cột: Con người – Quy trình – Công nghệ, không chỉ đơn thuần là phần mềm',
        'Áp dụng xuyên suốt vòng đời công trình: từ mô hình 3D đến vận hành 6D/7D',
      ],
      en: [
        'One single source of data, instead of hundreds of disconnected 2D drawings prone to inconsistency',
        'Three pillars: People – Process – Technology, not simply software',
        'Applied across the entire building lifecycle: from the 3D model to 6D/7D operations',
      ],
    },
    scene: { month: 9 },
  },
  {
    icon: Route,
    kicker: { vi: '02 · Quy trình', en: '02 · Process' },
    title: { vi: 'Áp dụng BIM như thế nào', en: 'How BIM is applied' },
    body: {
      vi: 'Một quy trình BIM bài bản bắt đầu từ yêu cầu thông tin của chủ đầu tư (EIR) và kế hoạch triển khai (BEP), theo đúng khung ISO 19650 và TCVN 14177 — không phải cứ dựng mô hình 3D là gọi là làm BIM. Bảy giai đoạn dưới đây là toàn bộ đường đi của thông tin, từ mô hình từng bộ môn đến bản sao số đô thị.',
      en: "A properly run BIM process starts with the investor's Exchange Information Requirements (EIR) and a BIM Execution Plan (BEP), following the ISO 19650 and TCVN 14177 framework — building a 3D model alone doesn't make it BIM. The seven stages below trace the full path information takes, from discipline models to the urban digital twin.",
    },
    diagram: true,
    scene: { month: 5 },
  },
  {
    icon: ShieldCheck,
    kicker: { vi: '03 · Lý do', en: '03 · Rationale' },
    title: { vi: 'Vì sao phải áp dụng BIM', en: 'Why BIM is necessary' },
    body: {
      vi: 'Cách làm truyền thống dựa trên bản vẽ 2D rời rạc giữa các bộ môn khiến xung đột kỹ thuật — đường ống đâm cột, dầm vướng hệ MEP — chỉ được phát hiện khi đã ra công trường, khi chi phí sửa chữa đã cao gấp nhiều lần so với sửa trên mô hình.',
      en: 'The traditional approach — disconnected 2D drawings across disciplines — means technical clashes (a pipe running through a column, a beam fouling the MEP system) only surface on site, when the cost of fixing them is many times higher than fixing them on the model.',
    },
    bullets: {
      vi: [
        'Phát hiện xung đột trên mô hình số trước khi thi công, không phải sau khi đổ bê tông',
        'Một nguồn thông tin duy nhất cho mọi bên: chủ đầu tư, nhà thầu, tư vấn giám sát',
        'Ra quyết định dựa trên dữ liệu, giảm phụ thuộc vào báo cáo một chiều',
      ],
      en: [
        'Catch clashes on the digital model before construction, not after the concrete is poured',
        'One single source of information for every party: investor, contractor, supervision consultant',
        'Decisions grounded in data, less reliance on one-sided reporting',
      ],
    },
    scene: { month: 6, block: 'A', clashSample: CLASH_SAMPLE_A },
  },
  {
    icon: PiggyBank,
    kicker: { vi: '04 · Giá trị cho nhà thầu', en: '04 · Value for contractors' },
    title: { vi: 'Hiệu quả tiết kiệm cho nhà thầu', en: 'Cost savings for contractors' },
    body: {
      vi: 'Giá trị lớn nhất của BIM đối với nhà thầu là ngăn ngừa chi phí phát sinh trước khi xảy ra ngoài công trường, thông qua việc phát hiện và xử lý xung đột kỹ thuật ngay trên mô hình, trước khi cấu kiện được chế tạo hoặc lắp đặt.',
      en: 'The biggest value BIM delivers to contractors is preventing cost overruns before they happen on site, by catching and resolving technical clashes on the model before components are fabricated or installed.',
    },
    bullets: {
      vi: [
        'Giảm khối lượng làm lại (rework) do xung đột bản vẽ phát hiện muộn',
        'Rút ngắn thời gian bóc khối lượng, lập dự toán nhờ bóc tách tự động từ mô hình',
        'Giảm tranh chấp thanh toán nhờ đối chiếu khối lượng hợp đồng – mô hình minh bạch',
      ],
      en: [
        'Less rework caused by drawing clashes discovered too late',
        'Faster quantity takeoff and estimating through automatic extraction from the model',
        'Fewer payment disputes thanks to transparent reconciliation between contract quantities and the model',
      ],
    },
    scene: { month: 6, block: 'A' },
  },
  {
    icon: Building2,
    kicker: { vi: '05 · Giá trị cho chủ đầu tư', en: '05 · Value for investors' },
    title: {
      vi: 'Vì sao chủ đầu tư cần áp dụng BIM từ giai đoạn thi công',
      en: 'Why investors should adopt BIM from the construction stage',
    },
    body: {
      vi: 'Nếu đợi đến khi vận hành mới bắt đầu số hoá công trình, chủ đầu tư đã bỏ lỡ giai đoạn dữ liệu chính xác nhất — lúc vật tư, thiết bị, đường ống còn nhìn thấy được trước khi bị che khuất bởi hoàn thiện. Đo vẽ lại sau bàn giao vừa tốn kém vừa khó chính xác bằng.',
      en: 'Waiting until operations to start digitizing the building means missing the stage where data is most accurate — while materials, equipment, and pipework are still visible, before finishes conceal them. Re-surveying after handover is both costly and never quite as accurate.',
    },
    bullets: {
      vi: [
        'Mô hình được cập nhật hoàn công song song với tiến độ thi công thực tế',
        'Giám sát tiến độ, chi phí, chất lượng độc lập — không phụ thuộc hoàn toàn vào báo cáo nhà thầu',
        'Nhận bàn giao một mô hình đã khớp hiện trạng cao, sẵn sàng cho vận hành',
      ],
      en: [
        'The model is updated as-built in parallel with actual construction progress',
        'Independent oversight of schedule, cost, and quality — not solely dependent on contractor reporting',
        'Receive a handover model that closely matches as-built conditions and is ready for operations',
      ],
    },
    scene: { month: 4 },
  },
  {
    icon: ClipboardCheck,
    kicker: { vi: '06 · Vận hành & O&M', en: '06 · Operations & O&M' },
    title: { vi: 'BIM trong giai đoạn vận hành', en: 'BIM in the operations stage' },
    body: {
      vi: 'Sau bàn giao, mô hình BIM tiếp tục đóng vai trò bản sao số (digital twin) của công trình, lưu trữ đầy đủ hồ sơ kỹ thuật, thời hạn bảo hành và lịch bảo trì của từng thiết bị, thay thế cho hệ thống catalogue giấy.',
      en: "After handover, the BIM model continues to serve as the building's digital twin, holding the full technical record, warranty terms, and maintenance schedule for every piece of equipment — replacing the paper-catalogue system.",
    },
    bullets: {
      vi: [
        'Tra cứu hồ sơ thiết bị tức thời khi có sự cố, không cần tìm lại tài liệu giấy',
        'Bảo trì đúng chu kỳ nhờ nhắc lịch tự động, kéo dài tuổi thọ thiết bị',
        'Nền tảng để tiến tới digital twin công trình và đô thị trong dài hạn',
      ],
      en: [
        'Look up equipment records instantly when something fails, with no paper documents to dig through',
        'Maintenance stays on cycle through automatic reminders, extending equipment lifespan',
        'A foundation for the long-term move toward a building- and city-scale digital twin',
      ],
    },
    scene: { month: 9, disciplines: MEP_FOCUS },
  },
  {
    icon: Handshake,
    kicker: { vi: '07 · Đối tác triển khai', en: '07 · Delivery partner' },
    title: { vi: 'Năng lực BIM của ISCM–UEH', en: "ISCM–UEH's BIM capability" },
    body: {
      vi: 'ISCM–UEH kết hợp nền tảng học thuật, am hiểu khung pháp lý và kinh nghiệm tư vấn triển khai thực tế — một lựa chọn khác với các đơn vị chỉ thuần tuý bán phần mềm hoặc dựng mô hình thuê ngoài.',
      en: 'ISCM–UEH combines an academic foundation, regulatory expertise, and hands-on implementation experience — a different kind of partner from vendors that only sell software or outsource modeling.',
    },
    bullets: {
      vi: [
        'Đào tạo BIM theo vai trò người sử dụng thông tin, không chỉ người dựng mô hình',
        'Vận dụng đúng Quyết định 258/QĐ-TTg, Thông tư 24/2025/TT-BXD, ISO 19650, TCVN 14177',
        'Đồng hành từ kiểm tra xung đột, kiểm soát khối lượng đến bàn giao dữ liệu vận hành',
        'Kết nối BIM với hệ sinh thái đô thị thông minh — không dừng ở một công trình đơn lẻ',
      ],
      en: [
        'BIM training built around the role of information users, not just model authors',
        'Correct application of Decision 258/QĐ-TTg, Circular 24/2025/TT-BXD, ISO 19650, and TCVN 14177',
        'Support from clash detection and quantity control through to operational data handover',
        'Connecting BIM to the smart-city ecosystem — not stopping at a single building',
      ],
    },
    scene: { month: 9 },
  },
  {
    icon: Radar,
    kicker: { vi: '08 · Giai đoạn 1/4', en: '08 · Stage 1/4' },
    title: { vi: 'Khởi động & Thiết lập', en: 'Kickoff & Setup' },
    subtitle: { vi: 'Tháng 1', en: 'Month 1' },
    body: {
      vi: 'Nếu ISCM–UEH đồng hành cùng dự án trong vai trò Tư vấn BIM, đây là công việc của từng bên qua bốn giai đoạn thi công, theo quy trình ISCM đang áp dụng trên thực tế.',
      en: 'If ISCM–UEH joins the project as BIM Consultant, here is what each party does across the four construction stages, following the process ISCM applies in practice.',
    },
    roles: [
      { icon: Landmark, party: INVESTOR, action: { vi: 'Ban hành yêu cầu thông tin (EIR)', en: 'Issue the Exchange Information Requirements (EIR)' } },
      { icon: Compass, party: PMC, action: { vi: 'Rà soát & trình Chủ đầu tư duyệt', en: 'Review and submit for investor approval' } },
      { icon: Eye, party: SUPERVISOR, action: { vi: 'Nắm quy trình, cam kết thời hạn', en: 'Understand the process, commit to deadlines' } },
      { icon: HardHat, party: DB_CONTRACTOR, action: { vi: 'Bàn giao mô hình 4 bộ môn', en: 'Deliver models for all 4 disciplines' } },
      {
        icon: Radar,
        party: BIM_CONSULTANT,
        action: {
          vi: 'Kiểm tra hiện trạng mô hình, lập kế hoạch BIM (BEP) và bộ quy tắc kiểm tra xung đột',
          en: 'Assess model status, draft the BIM Execution Plan (BEP) and the clash-detection rule set',
        },
        emphasis: true,
      },
    ],
    scene: { month: 2.5 },
  },
  {
    icon: Radar,
    kicker: { vi: '09 · Giai đoạn 2/4', en: '09 · Stage 2/4' },
    title: { vi: 'Phối hợp trước thi công', en: 'Pre-construction coordination' },
    subtitle: { vi: 'Tháng 1 – 3', en: 'Months 1–3' },
    body: {
      vi: 'Giai đoạn ưu tiên cao nhất trong toàn bộ quy trình — phải hoàn tất trước ngày khởi công của từng hạng mục.',
      en: 'The highest-priority stage in the whole process — it must be complete before each work package breaks ground.',
    },
    roles: [
      { icon: Landmark, party: INVESTOR, action: { vi: 'Phê duyệt kế hoạch BIM (BEP)', en: 'Approve the BIM Execution Plan (BEP)' } },
      { icon: Compass, party: PMC, action: { vi: 'Điều phối các bên, chủ trì họp định kỳ', en: 'Coordinate all parties, chair periodic meetings' } },
      { icon: Eye, party: SUPERVISOR, action: { vi: 'Rà soát khả năng thi công trên mô hình', en: 'Review constructability on the model' } },
      { icon: HardHat, party: DB_CONTRACTOR, action: { vi: 'Xử lý xung đột, cập nhật mô hình', en: 'Resolve clashes, update the model' } },
      {
        icon: Radar,
        party: BIM_CONSULTANT,
        action: {
          vi: 'Gộp mô hình, chạy kiểm tra xung đột, theo dõi đến khi đóng',
          en: 'Federate the models, run clash detection, track issues through to close-out',
        },
        emphasis: true,
      },
    ],
    scene: { month: 4.5, clashSample: CLASH_SAMPLE_B },
  },
  {
    icon: Radar,
    kicker: { vi: '10 · Giai đoạn 3/4', en: '10 · Stage 3/4' },
    title: { vi: 'Thi công & Hoàn công', en: 'Construction & As-Built' },
    subtitle: { vi: 'Tháng 3 – 11', en: 'Months 3–11' },
    body: {
      vi: 'Giai đoạn dài nhất — mô hình phải theo kịp những gì thực sự đang xảy ra ngoài công trường, không phải bản vẽ gốc chưa từng cập nhật.',
      en: 'The longest stage — the model has to keep pace with what is actually happening on site, not remain the original drawing that was never updated.',
    },
    roles: [
      { icon: Landmark, party: INVESTOR, action: { vi: 'Theo dõi qua báo cáo định kỳ', en: 'Track progress through periodic reports' } },
      { icon: Compass, party: PMC, action: { vi: 'Kiểm soát tiến độ cập nhật mô hình', en: 'Control the pace of model updates' } },
      { icon: Eye, party: SUPERVISOR, action: { vi: 'Ghi nhận & xác nhận thay đổi hiện trường', en: 'Record and verify field changes' } },
      { icon: HardHat, party: DB_CONTRACTOR, action: { vi: 'Cung cấp thông tin thi công & thiết bị', en: 'Supply construction and equipment information' } },
      {
        icon: Radar,
        party: BIM_CONSULTANT,
        action: { vi: 'Cập nhật mô hình hoàn công theo chu kỳ 6 tuần', en: 'Update the as-built model on a 6-week cycle' },
        emphasis: true,
      },
    ],
    scene: { month: 7 },
  },
  {
    icon: Radar,
    kicker: { vi: '11 · Giai đoạn 4/4', en: '11 · Stage 4/4' },
    title: { vi: 'Bàn giao & Vận hành', en: 'Handover & Operations' },
    subtitle: { vi: 'Tháng 10 – 13', en: 'Months 10–13' },
    body: {
      vi: 'Kết quả cuối cùng là một bộ dữ liệu vận hành hoàn chỉnh bàn giao cho chủ đầu tư — không chỉ một bản vẽ hoàn công nằm trong tủ hồ sơ.',
      en: 'The end result is a complete operations dataset handed over to the investor — not just an as-built drawing sitting in a filing cabinet.',
    },
    roles: [
      { icon: Landmark, party: INVESTOR, action: { vi: 'Nghiệm thu bộ hồ sơ BIM bàn giao', en: 'Accept the BIM handover package' } },
      { icon: Compass, party: PMC, action: { vi: 'Rà soát trước khi trình nghiệm thu', en: 'Review before submitting for acceptance' } },
      { icon: Eye, party: SUPERVISOR, action: { vi: 'Xác nhận mô hình khớp hiện trạng', en: 'Confirm the model matches as-built conditions' } },
      { icon: HardHat, party: DB_CONTRACTOR, action: { vi: 'Hoàn thiện dữ liệu thiết bị bàn giao', en: 'Finalize equipment data for handover' } },
      {
        icon: Radar,
        party: BIM_CONSULTANT,
        action: {
          vi: 'Kết xuất & bàn giao bộ dữ liệu vận hành cho chủ đầu tư',
          en: 'Export and hand over the operations dataset to the investor',
        },
        emphasis: true,
      },
    ],
    scene: { month: 9, disciplines: MEP_FOCUS },
  },
]

export function IntroBimGuide() {
  const { lang } = useLang()
  const { ref, inView } = useInView<HTMLElement>()
  const [page, setPage] = useState(0)
  const total = SLIDES.length
  const slide = SLIDES[page]
  const isFirst = page === 0
  const isLast = page === total - 1

  const goPrev = () => setPage((p) => Math.max(0, p - 1))
  const goNext = () => setPage((p) => Math.min(total - 1, p + 1))

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <section ref={ref} className="mx-auto w-full max-w-6xl px-6 py-20">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-brand">
        {lang === 'vi' ? 'Cẩm nang BIM' : 'BIM Guide'}
      </p>
      <h2 className="mb-12 text-center font-heading text-3xl font-bold text-white/92 md:text-4xl">
        {lang === 'vi' ? 'Vì sao & làm thế nào để áp dụng BIM' : 'Why & how to apply BIM'}
      </h2>

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-brand/10 opacity-70 blur-3xl"
        />
        <div className="glass-strong relative flex min-h-[560px] flex-col rounded-3xl p-8 md:min-h-[480px] md:p-12">
          <div key={page} className="animate-fadein flex flex-1 flex-col">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                  <slide.icon size={28} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">{slide.kicker[lang]}</p>
                  <h3 className="font-heading text-2xl font-bold text-white/92 md:text-3xl">{slide.title[lang]}</h3>
                  {slide.subtitle && <p className="mt-0.5 text-xs font-medium text-white/40">{slide.subtitle[lang]}</p>}
                </div>
              </div>
              <span className="shrink-0 pt-1 text-xs tabular-nums text-white/35">
                {page + 1} / {total}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-white/65 md:text-base">{slide.body[lang]}</p>

            {slide.diagram ? (
              <div className="mt-6 flex-1">
                <IntroBimPipeline />
              </div>
            ) : (
              <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col">
                  {slide.bullets && (
                    <ul className="mt-5 space-y-2.5">
                      {slide.bullets[lang].map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {slide.roles && (
                    <div className="mt-6 space-y-2">
                      {slide.roles.map((r) => (
                        <div
                          key={r.party.vi}
                          className={`flex items-center gap-4 rounded-xl p-3.5 ${
                            r.emphasis ? 'border border-brand/35 bg-brand/10' : 'border border-white/8 bg-white/[0.03]'
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                              r.emphasis ? 'bg-brand text-white' : 'bg-white/10 text-white/60'
                            }`}
                          >
                            <r.icon size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs font-semibold uppercase tracking-wide ${
                                r.emphasis ? 'text-brand' : 'text-white/40'
                              }`}
                            >
                              {r.party[lang]}
                            </p>
                            <p className={`text-sm leading-snug ${r.emphasis ? 'text-white/92' : 'text-white/70'}`}>
                              {r.action[lang]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 h-64 overflow-hidden rounded-2xl border border-white/10 bg-black/20 md:mt-0 md:h-full">
                  {inView && <IntroSlideScene scene={slide.scene} />}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={goPrev}
              disabled={isFirst}
              className="glass-hover flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white/70 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={15} /> {lang === 'vi' ? 'Trước' : 'Back'}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.title.vi}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`${lang === 'vi' ? 'Trang' : 'Page'} ${i + 1}: ${s.title[lang]}`}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === page ? 'w-6 bg-brand' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={isLast}
              className="glow-brand flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
            >
              {lang === 'vi' ? 'Tiếp' : 'Next'} <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

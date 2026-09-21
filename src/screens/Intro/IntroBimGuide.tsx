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

interface PartyRole {
  icon: LucideIcon
  party: string
  action: string
  emphasis?: boolean
}

interface Slide {
  icon: LucideIcon
  kicker: string
  title: string
  subtitle?: string
  body: string
  bullets?: string[]
  roles?: PartyRole[]
  /** Renders a full-width detailed diagram instead of the bullets + 3D-panel layout. */
  diagram?: boolean
  scene: SlideSceneConfig
}

const MEP_FOCUS: Discipline[] = ['Kết cấu', 'MEP']
const CLASH_SAMPLE_A = clashes.filter((c) => c.block === 'A').slice(0, 6)
const CLASH_SAMPLE_B = clashes.filter((c) => c.block === 'B').slice(0, 6)

const SLIDES: Slide[] = [
  {
    icon: Layers,
    kicker: '01 · Khái niệm',
    title: 'BIM là gì',
    body: 'BIM (Building Information Modeling — Mô hình thông tin công trình) là quy trình tạo lập, khai thác và quản lý thông tin công trình trên nền một mô hình số duy nhất, xuyên suốt từ thiết kế, thi công đến vận hành. Mô hình không chỉ chứa hình học 3D mà còn gắn dữ liệu phi hình học: vật liệu, thông số kỹ thuật, chi phí, tiến độ, nhà sản xuất.',
    bullets: [
      'Một nguồn dữ liệu duy nhất, thay vì hàng trăm bản vẽ 2D rời rạc dễ sai lệch',
      'Ba trụ cột: Con người – Quy trình – Công nghệ, không chỉ đơn thuần là phần mềm',
      'Áp dụng xuyên suốt vòng đời công trình: từ mô hình 3D đến vận hành 6D/7D',
    ],
    scene: { month: 9 },
  },
  {
    icon: Route,
    kicker: '02 · Quy trình',
    title: 'Áp dụng BIM như thế nào',
    body: 'Một quy trình BIM bài bản bắt đầu từ yêu cầu thông tin của chủ đầu tư (EIR) và kế hoạch triển khai (BEP), theo đúng khung ISO 19650 và TCVN 14177 — không phải cứ dựng mô hình 3D là gọi là làm BIM. Bảy giai đoạn dưới đây là toàn bộ đường đi của thông tin, từ mô hình từng bộ môn đến bản sao số đô thị.',
    diagram: true,
    scene: { month: 5 },
  },
  {
    icon: ShieldCheck,
    kicker: '03 · Lý do',
    title: 'Vì sao phải áp dụng BIM',
    body: 'Cách làm truyền thống dựa trên bản vẽ 2D rời rạc giữa các bộ môn khiến xung đột kỹ thuật — đường ống đâm cột, dầm vướng hệ MEP — chỉ được phát hiện khi đã ra công trường, khi chi phí sửa chữa đã cao gấp nhiều lần so với sửa trên mô hình.',
    bullets: [
      'Phát hiện xung đột trên mô hình số trước khi thi công, không phải sau khi đổ bê tông',
      'Một nguồn thông tin duy nhất cho mọi bên: chủ đầu tư, nhà thầu, tư vấn giám sát',
      'Ra quyết định dựa trên dữ liệu, giảm phụ thuộc vào báo cáo một chiều',
    ],
    scene: { month: 6, block: 'A', clashSample: CLASH_SAMPLE_A },
  },
  {
    icon: PiggyBank,
    kicker: '04 · Giá trị cho nhà thầu',
    title: 'Hiệu quả tiết kiệm cho nhà thầu',
    body: 'Giá trị lớn nhất của BIM đối với nhà thầu là ngăn ngừa chi phí phát sinh trước khi xảy ra ngoài công trường, thông qua việc phát hiện và xử lý xung đột kỹ thuật ngay trên mô hình, trước khi cấu kiện được chế tạo hoặc lắp đặt.',
    bullets: [
      'Giảm khối lượng làm lại (rework) do xung đột bản vẽ phát hiện muộn',
      'Rút ngắn thời gian bóc khối lượng, lập dự toán nhờ bóc tách tự động từ mô hình',
      'Giảm tranh chấp thanh toán nhờ đối chiếu khối lượng hợp đồng – mô hình minh bạch',
    ],
    scene: { month: 6, block: 'A' },
  },
  {
    icon: Building2,
    kicker: '05 · Giá trị cho chủ đầu tư',
    title: 'Vì sao chủ đầu tư cần áp dụng BIM từ giai đoạn thi công',
    body: 'Nếu đợi đến khi vận hành mới bắt đầu số hoá công trình, chủ đầu tư đã bỏ lỡ giai đoạn dữ liệu chính xác nhất — lúc vật tư, thiết bị, đường ống còn nhìn thấy được trước khi bị che khuất bởi hoàn thiện. Đo vẽ lại sau bàn giao vừa tốn kém vừa khó chính xác bằng.',
    bullets: [
      'Mô hình được cập nhật hoàn công song song với tiến độ thi công thực tế',
      'Giám sát tiến độ, chi phí, chất lượng độc lập — không phụ thuộc hoàn toàn vào báo cáo nhà thầu',
      'Nhận bàn giao một mô hình đã khớp hiện trạng cao, sẵn sàng cho vận hành',
    ],
    scene: { month: 4 },
  },
  {
    icon: ClipboardCheck,
    kicker: '06 · Vận hành & O&M',
    title: 'BIM trong giai đoạn vận hành',
    body: 'Sau bàn giao, mô hình BIM tiếp tục đóng vai trò bản sao số (digital twin) của công trình, lưu trữ đầy đủ hồ sơ kỹ thuật, thời hạn bảo hành và lịch bảo trì của từng thiết bị, thay thế cho hệ thống catalogue giấy.',
    bullets: [
      'Tra cứu hồ sơ thiết bị tức thời khi có sự cố, không cần tìm lại tài liệu giấy',
      'Bảo trì đúng chu kỳ nhờ nhắc lịch tự động, kéo dài tuổi thọ thiết bị',
      'Nền tảng để tiến tới digital twin công trình và đô thị trong dài hạn',
    ],
    scene: { month: 9, disciplines: MEP_FOCUS },
  },
  {
    icon: Handshake,
    kicker: '07 · Đối tác triển khai',
    title: 'Năng lực BIM của ISCM–UEH',
    body: 'ISCM–UEH kết hợp nền tảng học thuật, am hiểu khung pháp lý và kinh nghiệm tư vấn triển khai thực tế — một lựa chọn khác với các đơn vị chỉ thuần tuý bán phần mềm hoặc dựng mô hình thuê ngoài.',
    bullets: [
      'Đào tạo BIM theo vai trò người sử dụng thông tin, không chỉ người dựng mô hình',
      'Vận dụng đúng Quyết định 258/QĐ-TTg, Thông tư 24/2025/TT-BXD, ISO 19650, TCVN 14177',
      'Đồng hành từ kiểm tra xung đột, kiểm soát khối lượng đến bàn giao dữ liệu vận hành',
      'Kết nối BIM với hệ sinh thái đô thị thông minh — không dừng ở một công trình đơn lẻ',
    ],
    scene: { month: 9 },
  },
  {
    icon: Radar,
    kicker: '08 · Giai đoạn 1/4',
    title: 'Khởi động & Thiết lập',
    subtitle: 'Tháng 1',
    body: 'Nếu ISCM–UEH đồng hành cùng dự án trong vai trò Tư vấn BIM, đây là công việc của từng bên qua bốn giai đoạn thi công, theo quy trình ISCM đang áp dụng trên thực tế.',
    roles: [
      { icon: Landmark, party: 'Chủ đầu tư', action: 'Ban hành yêu cầu thông tin (EIR)' },
      { icon: Compass, party: 'Tư vấn QLDA', action: 'Rà soát & trình Chủ đầu tư duyệt' },
      { icon: Eye, party: 'Tư vấn giám sát', action: 'Nắm quy trình, cam kết thời hạn' },
      { icon: HardHat, party: 'Nhà thầu D&B', action: 'Bàn giao mô hình 4 bộ môn' },
      {
        icon: Radar,
        party: 'Tư vấn BIM (ISCM–UEH)',
        action: 'Kiểm tra hiện trạng mô hình, lập kế hoạch BIM (BEP) và bộ quy tắc kiểm tra xung đột',
        emphasis: true,
      },
    ],
    scene: { month: 2.5 },
  },
  {
    icon: Radar,
    kicker: '09 · Giai đoạn 2/4',
    title: 'Phối hợp trước thi công',
    subtitle: 'Tháng 1 – 3',
    body: 'Giai đoạn ưu tiên cao nhất trong toàn bộ quy trình — phải hoàn tất trước ngày khởi công của từng hạng mục.',
    roles: [
      { icon: Landmark, party: 'Chủ đầu tư', action: 'Phê duyệt kế hoạch BIM (BEP)' },
      { icon: Compass, party: 'Tư vấn QLDA', action: 'Điều phối các bên, chủ trì họp định kỳ' },
      { icon: Eye, party: 'Tư vấn giám sát', action: 'Rà soát khả năng thi công trên mô hình' },
      { icon: HardHat, party: 'Nhà thầu D&B', action: 'Xử lý xung đột, cập nhật mô hình' },
      {
        icon: Radar,
        party: 'Tư vấn BIM (ISCM–UEH)',
        action: 'Gộp mô hình, chạy kiểm tra xung đột, theo dõi đến khi đóng',
        emphasis: true,
      },
    ],
    scene: { month: 4.5, clashSample: CLASH_SAMPLE_B },
  },
  {
    icon: Radar,
    kicker: '10 · Giai đoạn 3/4',
    title: 'Thi công & Hoàn công',
    subtitle: 'Tháng 3 – 11',
    body: 'Giai đoạn dài nhất — mô hình phải theo kịp những gì thực sự đang xảy ra ngoài công trường, không phải bản vẽ gốc chưa từng cập nhật.',
    roles: [
      { icon: Landmark, party: 'Chủ đầu tư', action: 'Theo dõi qua báo cáo định kỳ' },
      { icon: Compass, party: 'Tư vấn QLDA', action: 'Kiểm soát tiến độ cập nhật mô hình' },
      { icon: Eye, party: 'Tư vấn giám sát', action: 'Ghi nhận & xác nhận thay đổi hiện trường' },
      { icon: HardHat, party: 'Nhà thầu D&B', action: 'Cung cấp thông tin thi công & thiết bị' },
      {
        icon: Radar,
        party: 'Tư vấn BIM (ISCM–UEH)',
        action: 'Cập nhật mô hình hoàn công theo chu kỳ 6 tuần',
        emphasis: true,
      },
    ],
    scene: { month: 7 },
  },
  {
    icon: Radar,
    kicker: '11 · Giai đoạn 4/4',
    title: 'Bàn giao & Vận hành',
    subtitle: 'Tháng 10 – 13',
    body: 'Kết quả cuối cùng là một bộ dữ liệu vận hành hoàn chỉnh bàn giao cho chủ đầu tư — không chỉ một bản vẽ hoàn công nằm trong tủ hồ sơ.',
    roles: [
      { icon: Landmark, party: 'Chủ đầu tư', action: 'Nghiệm thu bộ hồ sơ BIM bàn giao' },
      { icon: Compass, party: 'Tư vấn QLDA', action: 'Rà soát trước khi trình nghiệm thu' },
      { icon: Eye, party: 'Tư vấn giám sát', action: 'Xác nhận mô hình khớp hiện trạng' },
      { icon: HardHat, party: 'Nhà thầu D&B', action: 'Hoàn thiện dữ liệu thiết bị bàn giao' },
      {
        icon: Radar,
        party: 'Tư vấn BIM (ISCM–UEH)',
        action: 'Kết xuất & bàn giao bộ dữ liệu vận hành cho chủ đầu tư',
        emphasis: true,
      },
    ],
    scene: { month: 9, disciplines: MEP_FOCUS },
  },
]

export function IntroBimGuide() {
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
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-brand">Cẩm nang BIM</p>
      <h2 className="mb-12 text-center font-heading text-3xl font-bold text-white/92 md:text-4xl">
        Vì sao & làm thế nào để áp dụng BIM
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">{slide.kicker}</p>
                  <h3 className="font-heading text-2xl font-bold text-white/92 md:text-3xl">{slide.title}</h3>
                  {slide.subtitle && <p className="mt-0.5 text-xs font-medium text-white/40">{slide.subtitle}</p>}
                </div>
              </div>
              <span className="shrink-0 pt-1 text-xs tabular-nums text-white/35">
                {page + 1} / {total}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-white/65 md:text-base">{slide.body}</p>

            {slide.diagram ? (
              <div className="mt-6 flex-1">
                <IntroBimPipeline />
              </div>
            ) : (
              <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col">
                  {slide.bullets && (
                    <ul className="mt-5 space-y-2.5">
                      {slide.bullets.map((b) => (
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
                          key={r.party}
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
                              {r.party}
                            </p>
                            <p className={`text-sm leading-snug ${r.emphasis ? 'text-white/92' : 'text-white/70'}`}>
                              {r.action}
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
              <ChevronLeft size={15} /> Trước
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Trang ${i + 1}: ${s.title}`}
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
              Tiếp <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

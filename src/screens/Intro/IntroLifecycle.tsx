import { Boxes, GitMerge, CalendarClock, Calculator, History, Settings, Globe2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AppView } from '../../types'
import { useLang, type Lang } from '../../i18n/LanguageContext'

interface Stage {
  icon: LucideIcon
  label: Record<Lang, string>
  description: Record<Lang, string>
  target: AppView
}

const STAGES: Stage[] = [
  {
    icon: Boxes,
    label: { vi: '3D — Mô hình', en: '3D — Model' },
    description: { vi: 'Dựng mô hình thông tin cho từng bộ môn', en: 'Build the information model for each discipline' },
    target: 'model3d',
  },
  {
    icon: GitMerge,
    label: { vi: 'Phối hợp', en: 'Coordination' },
    description: {
      vi: 'Gộp mô hình, phát hiện và xử lý xung đột trước khi thi công',
      en: 'Merge models, detect and resolve clashes before construction',
    },
    target: 'clash',
  },
  {
    icon: CalendarClock,
    label: { vi: '4D — Tiến độ', en: '4D — Schedule' },
    description: {
      vi: 'Gắn thời gian vào cấu kiện, mô phỏng trình tự thi công',
      en: 'Link time to components, simulate the construction sequence',
    },
    target: 'schedule',
  },
  {
    icon: Calculator,
    label: { vi: '5D — Chi phí', en: '5D — Cost' },
    description: {
      vi: 'Bóc khối lượng từ mô hình, kiểm soát chi phí minh bạch',
      en: 'Take off quantities from the model, keep cost control transparent',
    },
    target: 'quantity',
  },
  {
    icon: History,
    label: { vi: 'Hoàn công', en: 'As-Built' },
    description: {
      vi: 'Cập nhật thay đổi hiện trường, mô hình phản ánh đúng thực tế',
      en: 'Update field changes so the model reflects reality',
    },
    target: 'asbuilt',
  },
  {
    icon: Settings,
    label: { vi: '6D/7D — Vận hành', en: '6D/7D — Operations' },
    description: {
      vi: 'Bàn giao dữ liệu tài sản phục vụ vận hành, bảo trì',
      en: 'Hand over asset data for operations and maintenance',
    },
    target: 'assets',
  },
  {
    icon: Globe2,
    label: { vi: 'Digital Twin', en: 'Digital Twin' },
    description: {
      vi: 'Ghép dữ liệu công trình vào bản sao số đô thị',
      en: 'Merge building data into the urban digital twin',
    },
    target: 'dashboard',
  },
]

interface IntroLifecycleProps {
  onNavigate: (view: AppView) => void
}

export function IntroLifecycle({ onNavigate }: IntroLifecycleProps) {
  const { lang } = useLang()
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <h2 className="mb-3 text-center font-heading text-2xl font-bold text-white/92 md:text-3xl">
        {lang === 'vi' ? 'Vòng đời thông tin công trình' : 'Building information lifecycle'}
      </h2>
      <p className="mb-12 text-center text-sm text-white/50">
        {lang === 'vi' ? 'Bấm vào một chặng để xem trực tiếp trên nền tảng' : 'Click a stage to view it live on the platform'}
      </p>

      <div className="relative">
        <div className="lifecycle-line absolute left-0 right-0 top-9 hidden h-px md:block" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-7 md:gap-3">
          {STAGES.map((s, i) => (
            <button
              key={s.label.vi}
              type="button"
              onClick={() => onNavigate(s.target)}
              className="glass glass-hover group relative flex flex-col items-center rounded-2xl p-4 text-center"
            >
              <span className="absolute right-2 top-2 font-heading text-[10px] font-semibold text-white/25">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand transition-transform duration-200 group-hover:scale-110">
                <s.icon size={18} />
              </div>
              <p className="font-heading text-xs font-semibold text-white/90">{s.label[lang]}</p>
              <p className="mt-1.5 text-[11px] leading-snug text-white/45">{s.description[lang]}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

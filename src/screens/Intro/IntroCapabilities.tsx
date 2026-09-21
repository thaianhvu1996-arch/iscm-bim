import { GraduationCap, Scale, Wrench, Network } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLang, type Lang } from '../../i18n/LanguageContext'

interface Capability {
  icon: LucideIcon
  title: Record<Lang, string>
  description: Record<Lang, string>
}

const CAPABILITIES: Capability[] = [
  {
    icon: GraduationCap,
    title: { vi: 'Nền tảng học thuật và đào tạo', en: 'Academic and training foundation' },
    description: {
      vi: 'Chương trình bồi dưỡng BIM dành cho cán bộ quản lý nhà nước và doanh nghiệp, gồm khoá cơ bản và khoá nâng cao, thiết kế theo vai trò người sử dụng thông tin chứ không phải người dựng mô hình.',
      en: 'BIM training programs for government officials and enterprise managers, spanning foundational and advanced courses, designed around the role of information users rather than model authors.',
    },
  },
  {
    icon: Scale,
    title: { vi: 'Am hiểu khung pháp lý và tiêu chuẩn', en: 'Regulatory and standards expertise' },
    description: {
      vi: 'Vận dụng thành thạo Quyết định 258/QĐ-TTg, Quyết định 348/QĐ-BXD, Thông tư 24/2025/TT-BXD, cùng hệ tiêu chuẩn ISO 19650 và TCVN 14177 vào hồ sơ EIR, BEP và quy trình thẩm định.',
      en: 'Fluent application of Decision 258/QĐ-TTg, Decision 348/QĐ-BXD, and Circular 24/2025/TT-BXD, together with the ISO 19650 and TCVN 14177 standards, to EIR and BEP documentation and appraisal workflows.',
    },
  },
  {
    icon: Wrench,
    title: { vi: 'Tư vấn triển khai thực tế', en: 'Hands-on implementation consulting' },
    description: {
      vi: 'Đồng hành cùng chủ đầu tư và nhà thầu từ kiểm tra xung đột, kiểm soát khối lượng, mô hình hoàn công đến bàn giao dữ liệu vận hành.',
      en: 'Working alongside investors and contractors from clash detection and quantity control through as-built modeling to operational data handover.',
    },
  },
  {
    icon: Network,
    title: { vi: 'Kết nối BIM với hệ sinh thái đô thị thông minh', en: 'Connecting BIM to the smart-city ecosystem' },
    description: {
      vi: 'Đưa dữ liệu công trình vào bức tranh lớn hơn: BIM → GIS → bản sao số đô thị, phục vụ ra quyết định ở cấp địa phương.',
      en: 'Bringing building data into the bigger picture: BIM → GIS → urban digital twin, supporting decision-making at the local government level.',
    },
  },
]

export function IntroCapabilities() {
  const { lang } = useLang()
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-brand">ISCM–UEH</p>
      <h2 className="mb-12 text-center font-heading text-2xl font-bold text-white/92 md:text-3xl">
        {lang === 'vi' ? 'Vì sao là ISCM–UEH' : 'Why ISCM–UEH'}
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {CAPABILITIES.map((c) => (
          <div key={c.title.vi} className="glass glass-hover rounded-2xl p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <c.icon size={22} />
            </div>
            <h3 className="mb-2 font-heading text-base font-semibold text-white/92">{c.title[lang]}</h3>
            <p className="text-sm leading-relaxed text-white/55">{c.description[lang]}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

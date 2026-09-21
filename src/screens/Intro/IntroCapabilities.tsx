import { GraduationCap, Scale, Wrench, Network } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Capability {
  icon: LucideIcon
  title: string
  description: string
}

const CAPABILITIES: Capability[] = [
  {
    icon: GraduationCap,
    title: 'Nền tảng học thuật và đào tạo',
    description:
      'Chương trình bồi dưỡng BIM dành cho cán bộ quản lý nhà nước và doanh nghiệp, gồm khoá cơ bản và khoá nâng cao, thiết kế theo vai trò người sử dụng thông tin chứ không phải người dựng mô hình.',
  },
  {
    icon: Scale,
    title: 'Am hiểu khung pháp lý và tiêu chuẩn',
    description:
      'Vận dụng thành thạo Quyết định 258/QĐ-TTg, Quyết định 348/QĐ-BXD, Thông tư 24/2025/TT-BXD, cùng hệ tiêu chuẩn ISO 19650 và TCVN 14177 vào hồ sơ EIR, BEP và quy trình thẩm định.',
  },
  {
    icon: Wrench,
    title: 'Tư vấn triển khai thực tế',
    description:
      'Đồng hành cùng chủ đầu tư và nhà thầu từ kiểm tra xung đột, kiểm soát khối lượng, mô hình hoàn công đến bàn giao dữ liệu vận hành.',
  },
  {
    icon: Network,
    title: 'Kết nối BIM với hệ sinh thái đô thị thông minh',
    description:
      'Đưa dữ liệu công trình vào bức tranh lớn hơn: BIM → GIS → bản sao số đô thị, phục vụ ra quyết định ở cấp địa phương.',
  },
]

export function IntroCapabilities() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-brand">ISCM–UEH</p>
      <h2 className="mb-12 text-center font-heading text-2xl font-bold text-white/92 md:text-3xl">
        Vì sao là ISCM–UEH
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {CAPABILITIES.map((c) => (
          <div key={c.title} className="glass glass-hover rounded-2xl p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <c.icon size={22} />
            </div>
            <h3 className="mb-2 font-heading text-base font-semibold text-white/92">{c.title}</h3>
            <p className="text-sm leading-relaxed text-white/55">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

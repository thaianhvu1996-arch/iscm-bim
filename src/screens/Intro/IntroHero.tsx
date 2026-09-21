import { ArrowRight } from 'lucide-react'
import { WireframeBackground } from './WireframeBackground'
import { useInView } from '../../hooks/useInView'
import ctdLogo from '../../assets/logos/ctdlogo_white.png'
import iscmLogo from '../../assets/logos/iscm_white_text_v1.png'

interface IntroHeroProps {
  onEnter: () => void
}

export function IntroHero({ onEnter }: IntroHeroProps) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <div className="absolute inset-0 opacity-60 saturate-[0.35]">{inView && <WireframeBackground />}</div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/70 to-navy-950" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-10 flex items-center gap-6">
          <img src={ctdLogo} alt="College of Technology and Design" className="h-9 w-auto object-contain" />
          <span className="h-8 w-px bg-white/25" />
          <img src={iscmLogo} alt="ISCM - Institute of Smart City and Management" className="h-9 w-auto object-contain" />
        </div>

        <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-white/95 md:text-5xl">
          BIM-based Construction Monitoring Platform
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/60">
          Viện Đô thị Thông minh và Quản lý — Đại học Kinh tế TP.HCM
        </p>
        <p className="mt-6 max-w-lg font-heading text-lg text-brand">
          Từ mô hình thông tin công trình đến bản sao số đô thị
        </p>

        <button
          type="button"
          onClick={onEnter}
          className="glow-brand mt-10 flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-105"
        >
          Khám phá nền tảng
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}

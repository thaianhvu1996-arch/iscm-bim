import type { AppView } from '../../types'
import { IntroHero } from './IntroHero'
import { IntroCapabilities } from './IntroCapabilities'
import { IntroBimGuide } from './IntroBimGuide'
import { IntroLifecycle } from './IntroLifecycle'
import ctdLogo from '../../assets/logos/ctdlogo_white.png'
import iscmLogo from '../../assets/logos/iscm_white_text_v1.png'

interface IntroProps {
  onNavigate: (view: AppView) => void
}

export function Intro({ onNavigate }: IntroProps) {
  return (
    <div className="h-full w-full overflow-y-auto bg-navy-950">
      <IntroHero onEnter={() => onNavigate('dashboard')} />
      <IntroCapabilities />
      <IntroBimGuide />
      <IntroLifecycle onNavigate={onNavigate} />

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={ctdLogo} alt="College of Technology and Design" className="h-6 w-auto object-contain opacity-70" />
            <span className="h-5 w-px bg-white/20" />
            <img src={iscmLogo} alt="ISCM" className="h-6 w-auto object-contain opacity-70" />
          </div>
          <p className="text-[11px] text-white/35">© ISCM–UEH</p>
        </div>
      </footer>
    </div>
  )
}

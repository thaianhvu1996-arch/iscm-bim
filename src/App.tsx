import { useEffect, useState } from 'react'
import type { AppView, BlockId, Discipline, ScreenId } from './types'
import { RoleProvider, useRole } from './context/RoleContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { AppShell } from './components/layout/AppShell'
import { Intro } from './screens/Intro/Intro'
import { Dashboard } from './screens/Dashboard/Dashboard'
import { Model3D, type Model3DFocus } from './screens/Model3D/Model3D'
import { Schedule } from './screens/Schedule/Schedule'
import { Quantity } from './screens/Quantity/Quantity'
import { Clash } from './screens/Clash/Clash'
import { AsBuilt } from './screens/AsBuilt/AsBuilt'
import { Assets } from './screens/Assets/Assets'

function Shell() {
  const [view, setView] = useState<AppView>('intro')
  const [model3DFocus, setModel3DFocus] = useState<Model3DFocus | null>(null)
  const { permissions } = useRole()

  useEffect(() => {
    if (view !== 'intro' && !permissions.visibleScreens.includes(view)) {
      setView('dashboard')
    }
  }, [permissions, view])

  if (view === 'intro') {
    return <Intro onNavigate={setView} />
  }

  const active = view as ScreenId

  const goToModel3D = (block: BlockId | 'all', discipline: Discipline) => {
    setModel3DFocus({ block, discipline })
    setView('model3d')
  }

  return (
    <AppShell active={active} onNavigate={setView} onLogoClick={() => setView('intro')}>
      {active === 'dashboard' && <Dashboard />}
      {active === 'model3d' && <Model3D focus={model3DFocus} />}
      {active === 'schedule' && <Schedule />}
      {active === 'quantity' && <Quantity onViewOn3D={goToModel3D} />}
      {active === 'clash' && <Clash />}
      {active === 'asbuilt' && <AsBuilt />}
      {active === 'assets' && <Assets />}
    </AppShell>
  )
}

function App() {
  return (
    <LanguageProvider>
      <RoleProvider>
        <Shell />
      </RoleProvider>
    </LanguageProvider>
  )
}

export default App

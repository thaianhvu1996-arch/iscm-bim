import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { BlockId, Clash, Discipline } from '../../types'
import { DISCIPLINES } from '../../data/constants'
import { SITE_BOUNDS } from '../../utils/geometry'
import { Warehouse } from '../Model3D/scene/Warehouse'
import { useIntroSceneMaterials } from './introSceneMaterials'

function RotatingRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12
  })
  return (
    <group position={[-SITE_BOUNDS.width / 2, -14, -SITE_BOUNDS.depth / 2]}>
      <group ref={ref} position={[SITE_BOUNDS.width / 2, 0, SITE_BOUNDS.depth / 2]}>
        {children}
      </group>
    </group>
  )
}

export interface SlideSceneConfig {
  month: number
  block?: BlockId | 'all'
  disciplines?: Discipline[]
  clashSample?: Clash[]
}

interface IntroSlideSceneProps {
  scene: SlideSceneConfig
}

// Rendered once and kept alive for the whole card — creating a fresh WebGLRenderer
// per slide (mount/unmount on every page turn) can exhaust the browser's WebGL
// context budget if the user pages quickly.
//
// `remountKey` is a defensive backstop: two `<Canvas>`-based sections sitting on
// one scrolling page (this one and the hero's wireframe background) can briefly
// overlap while their visibility observers settle, and that overlap has been
// observed to crash a WebGL context in some environments (`Context Lost`, no
// browser auto-recovery). `useInView` already debounces mounting to make that
// overlap unlikely, but if a loss slips through anyway, this listens for it and
// forces a clean remount rather than leaving the panel permanently blank.
export function IntroSlideScene({ scene }: IntroSlideSceneProps) {
  const [remountKey, setRemountKey] = useState(0)

  return (
    <Canvas
      key={remountKey}
      dpr={[1, 1.5]}
      camera={{ position: [210, 150, 230], fov: 40, near: 1, far: 1200 }}
      onCreated={({ gl }) => {
        const canvasEl = gl.domElement
        const handleLost = (e: Event) => {
          e.preventDefault()
          setTimeout(() => setRemountKey((k) => k + 1), 300)
        }
        canvasEl.addEventListener('webglcontextlost', handleLost, { once: true })
      }}
    >
      <SceneContent scene={scene} />
    </Canvas>
  )
}

function SceneContent({ scene }: IntroSlideSceneProps) {
  const materials = useIntroSceneMaterials()
  const activeDisciplines = scene.disciplines ?? DISCIPLINES
  const visible = DISCIPLINES.reduce(
    (acc, d) => ({ ...acc, [d]: activeDisciplines.includes(d) }),
    {} as Record<Discipline, boolean>,
  )

  return (
    <>
      <color attach="background" args={['#0a0f1c']} />

      <RotatingRig>
        <Warehouse
          currentMonth={scene.month}
          visible={visible}
          selectedBlock={scene.block ?? 'all'}
          materials={materials}
          clashMarkers={scene.clashSample ?? []}
          selectedClashId={null}
          onSelectClash={() => {}}
        />
      </RotatingRig>
    </>
  )
}

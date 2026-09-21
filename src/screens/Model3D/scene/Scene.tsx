import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { BlockId, Clash, Discipline } from '../../../types'
import { SITE_BOUNDS } from '../../../utils/geometry'
import { useSceneMaterials } from './materials'
import { Warehouse } from './Warehouse'

interface SceneProps {
  currentMonth: number
  visible: Record<Discipline, boolean>
  selectedBlock: BlockId | 'all'
  cutEnabled: boolean
  cutPosition: number
  clashMarkers: Clash[]
  selectedClashId: string | null
  onSelectClash: (clash: Clash | null) => void
}

const CENTER: [number, number, number] = [SITE_BOUNDS.width / 2, 4, SITE_BOUNDS.depth / 2]

export function Scene({
  currentMonth,
  visible,
  selectedBlock,
  cutEnabled,
  cutPosition,
  clashMarkers,
  selectedClashId,
  onSelectClash,
}: SceneProps) {
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), [])
  clipPlane.constant = cutPosition
  const materials = useSceneMaterials(clipPlane, cutEnabled)

  return (
    <Canvas
      shadows="basic"
      dpr={[1, 1.5]}
      gl={{ localClippingEnabled: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [200, 140, 240], fov: 42, near: 1, far: 2000 }}
      onPointerMissed={() => onSelectClash(null)}
    >
      <color attach="background" args={['#0a0f1c']} />
      <fog attach="fog" args={['#0a0f1c', 260, 620]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[160, 220, 120]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-220}
        shadow-camera-right={220}
        shadow-camera-top={220}
        shadow-camera-bottom={-220}
        shadow-camera-far={500}
        shadow-bias={-0.0015}
      />
      <hemisphereLight args={['#3d5478', '#0a0f1c', 0.4]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[SITE_BOUNDS.width / 2, -0.05, SITE_BOUNDS.depth / 2]} receiveShadow>
        <planeGeometry args={[SITE_BOUNDS.width + 200, SITE_BOUNDS.depth + 200]} />
        <meshStandardMaterial color="#141d2e" roughness={1} />
      </mesh>
      <gridHelper
        args={[Math.max(SITE_BOUNDS.width, SITE_BOUNDS.depth) + 200, 60, '#1e2c4a', '#16213c']}
        position={[SITE_BOUNDS.width / 2, 0, SITE_BOUNDS.depth / 2]}
      />

      <Warehouse
        currentMonth={currentMonth}
        visible={visible}
        selectedBlock={selectedBlock}
        materials={materials}
        clashMarkers={clashMarkers}
        selectedClashId={selectedClashId}
        onSelectClash={onSelectClash}
      />

      <OrbitControls
        target={CENTER}
        minDistance={40}
        maxDistance={520}
        maxPolarAngle={Math.PI / 2 - 0.02}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  )
}

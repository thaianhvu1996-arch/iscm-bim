import { useMemo } from 'react'
import * as THREE from 'three'
import { DISCIPLINE_COLORS } from '../../../data/constants'

export interface SceneMaterials {
  ketCau: THREE.Material
  kienTruc: THREE.Material
  mep: THREE.Material
  mepDuct: THREE.Material
  mepPipe: THREE.Material
  mepTray: THREE.Material
  haTang: THREE.Material
  roof: THREE.Material
  door: THREE.Material
  office: THREE.Material
  officeAccent: THREE.Material
  glass: THREE.Material
  footing: THREE.Material
  slab: THREE.Material
  road: THREE.Material
  fence: THREE.Material
}

export function useSceneMaterials(clipPlane: THREE.Plane, cutEnabled: boolean) {
  return useMemo(() => {
    const clippingPlanes = cutEnabled ? [clipPlane] : []
    const make = (color: string, metalness = 0.3, roughness = 0.6) =>
      new THREE.MeshStandardMaterial({ color, metalness, roughness, clippingPlanes })

    const glass = make('#38bdf8', 0.1, 0.2)
    glass.transparent = true
    glass.opacity = 0.55

    return {
      ketCau: make(DISCIPLINE_COLORS['Kết cấu'], 0.65, 0.35),
      kienTruc: make(DISCIPLINE_COLORS['Kiến trúc'], 0.1, 0.85),
      mep: make(DISCIPLINE_COLORS.MEP, 0.4, 0.5),
      mepDuct: make('#c084fc', 0.35, 0.5),
      mepPipe: make('#f472b6', 0.4, 0.45),
      mepTray: make('#818cf8', 0.5, 0.4),
      haTang: make(DISCIPLINE_COLORS['Hạ tầng'], 0.1, 0.9),
      roof: make('#4b5b74', 0.55, 0.5),
      door: make('#f59e0b', 0.4, 0.55),
      office: make('#cbd5e1', 0.1, 0.7),
      officeAccent: make('#1e2c4a', 0.2, 0.6),
      glass,
      footing: make('#7d8590', 0.1, 0.9),
      slab: make('#5b6472', 0.05, 0.95),
      road: make('#293548', 0.05, 0.95),
      fence: make('#64748b', 0.4, 0.6),
    }
  }, [clipPlane, cutEnabled])
}

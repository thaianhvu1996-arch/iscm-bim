import { useMemo } from 'react'
import * as THREE from 'three'
import { DISCIPLINE_COLORS } from '../../data/constants'
import type { SceneMaterials } from '../Model3D/scene/materials'

// A lightweight, fully-unlit material set for the small Intro showcase panels.
// Lit materials (MeshStandardMaterial *and* the much cheaper MeshLambertMaterial)
// reliably tripped Chrome/ANGLE's GPU driver watchdog (TDR → "Context Lost") on
// mount in this environment as soon as any light was present, regardless of
// shader cost — so this stays on the same unlit MeshBasicMaterial family already
// proven stable by the Intro hero's wireframe background, just with solid,
// per-discipline color fills instead of thin gray lines for a bolder look.
export function useIntroSceneMaterials(): SceneMaterials {
  return useMemo(() => {
    const make = (color: string) => new THREE.MeshBasicMaterial({ color })

    const glass = make('#38bdf8')
    glass.transparent = true
    glass.opacity = 0.45

    return {
      ketCau: make(DISCIPLINE_COLORS['Kết cấu']),
      kienTruc: make(DISCIPLINE_COLORS['Kiến trúc']),
      mep: make(DISCIPLINE_COLORS.MEP),
      mepDuct: make('#c084fc'),
      mepPipe: make('#f472b6'),
      mepTray: make('#818cf8'),
      haTang: make(DISCIPLINE_COLORS['Hạ tầng']),
      roof: make('#3d4c66'),
      door: make('#f59e0b'),
      office: make('#94a3b8'),
      officeAccent: make('#1e2c4a'),
      glass,
      footing: make('#5b6472'),
      slab: make('#3d4760'),
      road: make('#202b40'),
      fence: make('#475569'),
    }
  }, [])
}

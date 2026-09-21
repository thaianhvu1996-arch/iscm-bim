import { useEffect, useRef, useState } from 'react'

/**
 * True while the referenced element is at least partially in the viewport.
 * Used to pause/unmount off-screen WebGL canvases — a long scrolling page can
 * otherwise keep several `<Canvas>` render loops (and GPU contexts) alive at
 * once, which wastes GPU/battery and can exhaust the browser's WebGL context
 * budget.
 *
 * The transition to `true` is debounced by `mountDelayMs`; the transition to
 * `false` is immediate. This matters when two such canvases sit back-to-back
 * on one scrolling page (e.g. a hero background and a showcase panel further
 * down) — without the delay, a fast scroll can make the incoming canvas start
 * initializing before the outgoing one has finished tearing down, and two
 * WebGL contexts briefly racing during initialization has been observed to
 * crash one of them (`THREE.WebGLRenderer: Context Lost`, no auto-recovery).
 * The delay gives the outgoing canvas a head start to fully unmount first.
 */
export function useInView<T extends HTMLElement>(rootMargin = '200px', mountDelayMs = 400) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout> | undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setInView(true), mountDelayMs)
        } else {
          if (timer) clearTimeout(timer)
          setInView(false)
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [rootMargin, mountDelayMs])

  return { ref, inView }
}

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function useGsapTimeline(build: (timeline: gsap.core.Timeline) => void, dependencies: unknown[] = []) {
  const timeline = useRef<gsap.core.Timeline | null>(null)
  useEffect(() => {
    const next = gsap.timeline({ paused: true })
    timeline.current = next
    build(next)
    return () => { next.kill(); timeline.current = null }
    // The caller controls the stable dependency list for the educational sequence.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
  return timeline
}

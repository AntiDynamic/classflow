import { Html, useProgress } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

function SceneLoading() {
  const { active } = useProgress()
  if (!active) return null
  return <Html center><span className="scene-loading">Building your learning world…</span></Html>
}

export function SceneCanvas({ children, camera = [6, 5, 7], className }: { children: ReactNode; camera?: [number, number, number]; className?: string }) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => { const query = window.matchMedia('(max-width: 760px), (pointer: coarse)'); const update = () => setMobile(query.matches); update(); query.addEventListener('change', update); return () => query.removeEventListener('change', update) }, [])
  return <div className={className || 'scene-canvas'}>
    <Canvas shadows={!mobile} dpr={mobile ? 1 : [1, 1.35]} camera={{ position: camera, fov: 42 }} gl={{ antialias: !mobile, alpha: false, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#0a1830']} />
      <Suspense fallback={<SceneLoading />}>{children}</Suspense>
    </Canvas>
  </div>
}

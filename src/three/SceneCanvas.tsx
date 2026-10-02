import { Html, useProgress } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import type { ReactNode } from 'react'

function SceneLoading() {
  const { active } = useProgress()
  if (!active) return null
  return <Html center><span className="scene-loading">Building your learning world…</span></Html>
}

export function SceneCanvas({ children, camera = [6, 5, 7], className }: { children: ReactNode; camera?: [number, number, number]; className?: string }) {
  return <div className={className || 'scene-canvas'}>
    <Canvas shadows dpr={[1, 1.65]} camera={{ position: camera, fov: 42 }} gl={{ antialias: true, alpha: false }}>
      <color attach="background" args={['#0a1830']} />
      <Suspense fallback={<SceneLoading />}>{children}</Suspense>
    </Canvas>
  </div>
}

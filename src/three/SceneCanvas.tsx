import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'

export function SceneCanvas({ children, camera = [6, 5, 7], className }: { children: ReactNode; camera?: [number, number, number]; className?: string }) {
  return <div className={className || 'scene-canvas'}>
    <Canvas shadows dpr={[1, 1.65]} camera={{ position: camera, fov: 42 }} gl={{ antialias: true, alpha: false }}>
      <color attach="background" args={['#0a1830']} />
      {children}
    </Canvas>
  </div>
}

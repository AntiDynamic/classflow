import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'

export function DimensionLabel({ from, to, label, color = '#ffe084' }: { from: [number, number, number]; to: [number, number, number]; label: string; color?: string }) {
  const middle = new THREE.Vector3().addVectors(new THREE.Vector3(...from), new THREE.Vector3(...to)).multiplyScalar(.5)
  return <group>
    <Line points={[from, to]} color={color} lineWidth={1.25} dashed dashScale={4} dashSize={.12} gapSize={.08} />
    <Html position={middle} center transform sprite distanceFactor={9}><span className="scene-dimension-label" style={{ borderColor: color }}>{label}</span></Html>
  </group>
}

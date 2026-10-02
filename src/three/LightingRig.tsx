import { ContactShadows, Environment } from '@react-three/drei'

export function LightingRig({ floor = true }: { floor?: boolean }) {
  return <>
    <ambientLight intensity={1.35} />
    <hemisphereLight args={['#b8ebff', '#14233d', 1.25]} />
    <directionalLight castShadow position={[5, 7, 5]} intensity={3} color="#fff1cf" shadow-mapSize={[1024, 1024]} />
    <directionalLight position={[-5, 2, -4]} intensity={1.4} color="#72d5e6" />
    <Environment preset="city" environmentIntensity={.22} />
    {floor && <ContactShadows position={[0, -2, 0]} opacity={.32} scale={12} blur={2.6} far={4.4} />}
  </>
}

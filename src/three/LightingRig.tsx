import { ContactShadows, Environment } from '@react-three/drei'
import { useEffect, useState } from 'react'

export function LightingRig({ floor = true }: { floor?: boolean }) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => { const query = window.matchMedia('(max-width: 760px), (pointer: coarse)'); const update = () => setMobile(query.matches); update(); query.addEventListener('change', update); return () => query.removeEventListener('change', update) }, [])
  return <>
    <ambientLight intensity={mobile ? 1.5 : 1.35} />
    <hemisphereLight args={['#b8ebff', '#14233d', 1.25]} />
    <directionalLight castShadow={!mobile} position={[5, 7, 5]} intensity={3} color="#fff1cf" shadow-mapSize={mobile ? [512, 512] : [1024, 1024]} />
    <directionalLight position={[-5, 2, -4]} intensity={1.4} color="#72d5e6" />
    {!mobile && <Environment preset="city" environmentIntensity={.22} />}
    {floor && !mobile && <ContactShadows position={[0, -2, 0]} opacity={.32} scale={12} blur={2.6} far={4.4} />}
  </>
}

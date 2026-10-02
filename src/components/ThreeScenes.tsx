import { CameraControls, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Fragment, Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { LightingRig } from '../three/LightingRig'

export type SolarPlanet = { name: string; color: string; size: number }
type SolarSceneProps = { planets: SolarPlanet[]; selected: number; onSelect: (index: number, position: [number, number]) => void; playing: boolean; speed: number; focus: boolean; focusTarget: [number, number] }

function Planet({ planet, index, selected, onSelect, playing, speed, focus }: { planet: SolarPlanet; index: number; selected: boolean; onSelect: (position: [number, number]) => void; playing: boolean; speed: number; focus: boolean }) {
  const ref = useRef<THREE.Group>(null); const moon = useRef<THREE.Group>(null); const angle = useRef(index * .78); const radius = 1.25 + index * .43; const scaled = .055 + planet.size * .006
  const targetScale = focus && selected ? 6.2 : focus ? .62 : 1
  useFrame((state, delta) => { if (!ref.current) return; if (playing) angle.current += delta * (.42 * speed) / (1 + index * .13); const tilt = (index % 4 - 1.5) * .045; ref.current.position.set(Math.cos(angle.current) * radius, Math.sin(angle.current) * radius * Math.sin(tilt), Math.sin(angle.current) * radius * Math.cos(tilt)); ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), .055); ref.current.rotation.y += delta * (.3 + index * .025); if (moon.current) moon.current.rotation.y += delta * 2.1 })
  const selectPlanet = (event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect([ref.current?.position.x || 0, ref.current?.position.z || 0]) }
  return <group ref={ref}>
    {planet.name === 'Earth' ? <EarthVisual size={scaled} selected={selected} faded={focus && !selected} onSelect={selectPlanet} /> : <mesh onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'auto' }} onClick={selectPlanet}><sphereGeometry args={[scaled, 32, 22]} /><meshStandardMaterial color={planet.color} emissive={selected ? planet.color : '#000000'} emissiveIntensity={selected ? .48 : 0} roughness={.58} transparent opacity={focus && !selected ? .22 : 1} /></mesh>}
    <PlanetDetails name={planet.name} size={scaled} visible={planet.name !== 'Earth' && (!focus || selected)} />
    <PlanetBands name={planet.name} size={scaled} visible={focus && selected} />
    {planet.name === 'Saturn' && <mesh rotation={[Math.PI / 2.5, .25, .2]}><ringGeometry args={[scaled * 1.45, scaled * 2.35, 64]} /><meshBasicMaterial color="#dbc38b" transparent opacity={.82} side={THREE.DoubleSide} /></mesh>}
    {planet.name === 'Earth' && <group ref={moon}><mesh position={[scaled * 2.25, 0, 0]}><sphereGeometry args={[scaled * .25, 16, 12]} /><meshStandardMaterial color="#d8e2e8" roughness={.8} /></mesh></group>}
  </group>
}

function PlanetBands({ name, size, visible }: { name: string; size: number; visible: boolean }) {
  if (!visible) return null
  const bands = name === 'Jupiter' ? [['#f3d7b2',.52,.045],['#9c604d',.26,.06],['#e5b98b',-.05,.05],['#a86651',-.34,.045]] : name === 'Saturn' ? [['#f4ddb0',.36,.04],['#b99162',.06,.045],['#f1d3a0',-.26,.04]] : name === 'Neptune' ? [['#6c9ee1',.34,.035],['#355ea9',-.2,.04]] : name === 'Venus' ? [['#f3d39a',.3,.055],['#bd844e',-.18,.05]] : []
  return <group>{bands.map(([color,y,thickness], index) => <mesh key={index} position={[0, Number(y) * size, size * .92]} scale={[size * 1.04, size * Number(thickness), size * .07]}><sphereGeometry args={[1,24,12]} /><meshBasicMaterial color={String(color)} transparent opacity={.55} /></mesh>)}{name === 'Jupiter' && <mesh position={[size*.46,-size*.17,size*.9]} scale={[size*.12,size*.07,size*.025]}><sphereGeometry args={[1,18,10]} /><meshBasicMaterial color="#b65745" transparent opacity={.9} /></mesh>}</group>
}

function EarthVisual({ size, selected, faded, onSelect }: { size: number; selected: boolean; faded: boolean; onSelect: (event: { stopPropagation: () => void }) => void }) {
  const texture = useTexture('/assets/earth-surface.png')
  const clouds = useRef<THREE.Group>(null)
  useFrame((_, delta) => { if (clouds.current) clouds.current.rotation.y += delta * .055 })
  return <group onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'auto' }} onClick={onSelect}>
    <mesh><sphereGeometry args={[size, 48, 32]} /><meshStandardMaterial map={texture} emissive="#104d6c" emissiveIntensity={selected ? .12 : .04} roughness={.72} transparent opacity={faded ? .22 : 1} /></mesh>
    <group ref={clouds}>{[[-.42,.25,.88,.24], [.32,.42,.82,.18], [.45,-.22,.82,.2], [-.2,-.48,.85,.15]].map(([x,y,z,s], index) => <mesh key={index} position={[x * size, y * size, z * size]} scale={[size * 1.4, size * .3, size * .05]}><sphereGeometry args={[s, 16, 10]} /><meshBasicMaterial color="#eef8ff" transparent opacity={faded ? .05 : .48} /></mesh>)}</group>
    <mesh scale={1.045}><sphereGeometry args={[size, 48, 32]} /><meshBasicMaterial color="#84d6ff" transparent opacity={faded ? .03 : .1} side={THREE.BackSide} /></mesh>
  </group>
}

function PlanetDetails({ name, size, visible }: { name: string; size: number; visible: boolean }) {
  const marks = useMemo(() => {
    if (name === 'Earth') return [[-.42,.32,.72,.14,'#cce8df'], [.38,-.1,.77,.12,'#6da66d'], [.05,.5,.72,.09,'#e8f0f3']]
    if (name === 'Jupiter') return [[0,.34,.94,.12,'#ead1b1'], [0,0,.99,.14,'#9c654f'], [0,-.35,.94,.11,'#f0d3ad'], [.48,-.12,.93,.08,'#bd5c4d']]
    if (name === 'Mars') return [[-.25,.22,.9,.11,'#8e4037'], [.35,-.25,.88,.08,'#ffad80']]
    if (name === 'Mercury') return [[-.2,.23,.88,.1,'#75716c'], [.35,-.15,.88,.13,'#d0cbc2']]
    if (name === 'Venus') return [[0,.3,.95,.1,'#f3c484'], [0,-.2,.96,.12,'#b66d42']]
    if (name === 'Neptune' || name === 'Uranus') return [[0,.25,.96,.09,'#bcecf0'], [0,-.25,.96,.08,'#4e79b9']]
    return []
  }, [name])
  if (!visible) return null
  return <group>{marks.map(([x, y, z, s, color], index) => <mesh key={index} position={[Number(x) * size, Number(y) * size, Number(z) * size]} scale={[size * 1.3, size * .35, size * .1]}><sphereGeometry args={[Number(s), 14, 8]} /><meshBasicMaterial color={String(color)} transparent opacity={.72} /></mesh>)}</group>
}
function OrbitRing({ radius, index }: { radius: number; index: number }) { return <mesh rotation={[-Math.PI / 2 + (index % 4 - 1.5) * .045, 0, 0]}><ringGeometry args={[radius - .007, radius, 96]} /><meshBasicMaterial color="#467393" transparent opacity={.35} side={THREE.DoubleSide} /></mesh> }
function SolarCamera({ focus, target, planet }: { focus: boolean; target: [number, number]; planet: string }) { const controls = useRef<CameraControls>(null); useEffect(() => { if (!controls.current) return; if (!focus) { controls.current.setLookAt(0, 6.2, 8.2, 0, 0, 0, true); return } const approach: Record<string,[number,number,number]> = { Earth:[.82,.48,1.38], Saturn:[1.72,.92,2.1], Jupiter:[1.1,.25,1.7], Mars:[.7,.28,1.2], Neptune:[.82,.58,1.48], Venus:[.78,.45,1.35], Mercury:[.65,.3,1.05], Uranus:[1.15,.65,1.65] }; const view=approach[planet]||approach.Earth; controls.current.setLookAt(target[0]+view[0],view[1],target[1]+view[2],target[0],0,target[1],true) }, [focus, target, planet]); return <CameraControls ref={controls} makeDefault smoothTime={1.25} minDistance={.85} maxDistance={12} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.1} /> }

function StarField() { const stars = useMemo(() => Array.from({ length: 90 }, (_, index) => [((index * 47) % 100) / 12 - 4, ((index * 71) % 100) / 13 - 3.8, -2 - ((index * 37) % 100) / 22] as [number, number, number]), []); return <>{stars.map((position, index) => <mesh key={index} position={position}><sphereGeometry args={[index % 7 === 0 ? .018 : .009, 6, 5]} /><meshBasicMaterial color={index % 9 === 0 ? '#a8d7ff' : '#f4f0d8'} transparent opacity={.65} /></mesh>)}</> }

function SunCore() { const halo=useRef<THREE.Group>(null); useFrame((state)=>{if(halo.current) halo.current.rotation.z=state.clock.elapsedTime*.07; return null}); return <group><group ref={halo}>{[.5,.66,.84].map((radius,index)=><mesh key={radius} rotation={[0,0,index*.3]}><ringGeometry args={[radius-.018,radius,64]} /><meshBasicMaterial color="#ffca61" transparent opacity={.16-index*.035} side={THREE.DoubleSide} /></mesh>)}</group><mesh><sphereGeometry args={[.35,32,20]} /><meshStandardMaterial color="#ffc95e" emissive="#e9982b" emissiveIntensity={1.7} roughness={.45} /></mesh></group> }
export function SolarScene3D({ planets, selected, onSelect, playing, speed, focus, focusTarget }: SolarSceneProps) { return <><LightingRig floor={false} /><StarField /><SolarCamera focus={focus} target={focusTarget} planet={planets[selected].name} /><pointLight position={[0, 0, 0]} intensity={12} distance={15} color="#ffe0a0" /><SunCore /><Suspense fallback={null}>{planets.map((planet, index) => <Fragment key={planet.name}><OrbitRing radius={1.25 + index * .43} index={index} /><Planet planet={planet} index={index} selected={selected === index} onSelect={(position) => onSelect(index, position)} playing={playing} speed={speed} focus={focus} /></Fragment>)}</Suspense></> }

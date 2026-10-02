import { CameraControls, Edges, Float, Html, Line, RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { LightingRig } from './LightingRig'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function PizzaSlice({ index, total, selected, onSelect }: { index: number; total: number; selected: boolean; onSelect: () => void }) {
  const group = useRef<THREE.Group>(null)
  const angle = (Math.PI * 2) / total
  const start = index * angle + .035
  const shape = useMemo(() => { const next = new THREE.Shape(); next.moveTo(0, 0); next.absarc(0, 0, 1.38, start, start + angle - .07, false); next.lineTo(0, 0); return next }, [angle, start])
  const geometry = useMemo(() => new THREE.ExtrudeGeometry(shape, { depth: .22, bevelEnabled: true, bevelThickness: .035, bevelSize: .025, bevelSegments: 2 }), [shape])
  useFrame(() => { if (!group.current) return; const middle = start + angle / 2; const offset = selected ? .18 : .045; group.current.position.lerp(new THREE.Vector3(Math.cos(middle) * offset, Math.sin(middle) * offset, selected ? .18 : 0), .12) })
  return <group ref={group} onClick={(event) => { event.stopPropagation(); onSelect() }}>
    <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial color={selected ? '#ffc95e' : '#b87845'} roughness={.67} metalness={0} emissive={selected ? '#ff7f6f' : '#000'} emissiveIntensity={selected ? .18 : 0} /></mesh>
    <mesh position={[0, 0, .226]} geometry={geometry}><meshStandardMaterial color={selected ? '#ffdb78' : '#d39458'} roughness={.78} /></mesh>
  </group>
}

export function PizzaScene({ total, selected, onToggle }: { total: number; selected: number[]; onToggle: (index: number) => void }) {
  return <>
    <LightingRig />
    <CameraControls makeDefault smoothTime={.65} minDistance={3.8} maxDistance={7.2} />
    <group rotation={[-Math.PI / 2, 0, 0]}>{Array.from({ length: total }, (_, index) => <PizzaSlice key={`${total}-${index}`} index={index} total={total} selected={selected.includes(index)} onSelect={() => onToggle(index)} />)}</group>
    <Html position={[0, -1.85, 0]} center><span className="scene-hint">tap a slice to lift it</span></Html>
  </>
}

const cubeVertices: [number, number, number][] = [[-1,-1,-1],[-1,-1,1],[-1,1,-1],[-1,1,1],[1,-1,-1],[1,-1,1],[1,1,-1],[1,1,1]]
function VertexMarkers({ shape, enabled }: { shape: string; enabled: boolean }) {
  const markerRefs = useRef<THREE.Mesh[]>([])
  useFrame((state) => markerRefs.current.forEach((marker, index) => { if (!marker) return; const show = enabled ? clamp((state.clock.elapsedTime * 2.7 - index) * 2.3, 0, 1) : 0; marker.scale.setScalar(show) }))
  if (shape !== 'cube' && shape !== 'cuboid') return null
  const scale: [number, number, number] = shape === 'cuboid' ? [1.4, .9, .72] : [1, 1, 1]
  return <>{cubeVertices.map((point, index) => <mesh key={index} ref={(node) => { if (node) markerRefs.current[index] = node }} position={[point[0] * scale[0], point[1] * scale[1], point[2] * scale[2]]}><sphereGeometry args={[.105, 16, 12]} /><meshStandardMaterial color="#ffe084" emissive="#ffca51" emissiveIntensity={.9} /></mesh>)}</>
}

function ShapeMesh({ shape, mode }: { shape: string; mode: 'faces' | 'edges' | 'vertices' }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => { if (!mesh.current) return; mesh.current.rotation.y = state.clock.elapsedTime * .25; mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * .22) * .12 })
  const geometry = shape === 'cube' ? <boxGeometry args={[2, 2, 2]} /> : shape === 'cuboid' ? <boxGeometry args={[2.8, 1.8, 1.45]} /> : shape === 'sphere' ? <sphereGeometry args={[1.28, 32, 20]} /> : shape === 'cylinder' ? <cylinderGeometry args={[1, 1, 2.3, 32]} /> : <coneGeometry args={[1.22, 2.45, 32]} />
  return <group><mesh ref={mesh} castShadow receiveShadow>{geometry}<meshStandardMaterial color={mode === 'faces' ? '#75d7dc' : '#8da1ff'} roughness={.4} metalness={.08} emissive={mode === 'faces' ? '#24888d' : '#000000'} emissiveIntensity={mode === 'faces' ? .35 : 0} /></mesh>{mode === 'edges' && <Edges color="#ffe084" linewidth={2} />}</group>
}

export function ShapePropertyScene({ shape, mode }: { shape: string; mode: 'faces' | 'edges' | 'vertices' }) {
  return <>
    <LightingRig />
    <CameraControls makeDefault smoothTime={.65} minDistance={3.7} maxDistance={8} />
    <Float speed={1.1} rotationIntensity={.04} floatIntensity={.18}><ShapeMesh shape={shape} mode={mode} /><VertexMarkers shape={shape} enabled={mode === 'vertices'} /></Float>
    <Html position={[0, -1.85, 0]} center><span className="scene-hint">drag to look around</span></Html>
  </>
}

function WaterDrops({ stage, running }: { stage: number; running: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const matrix = useMemo(() => new THREE.Matrix4(), [])
  const pos = useMemo(() => new THREE.Vector3(), [])
  const quat = useMemo(() => new THREE.Quaternion(), [])
  const scale = useMemo(() => new THREE.Vector3(.055, .055, .055), [])
  useFrame((state) => {
    if (!mesh.current) return
    const time = state.clock.elapsedTime
    for (let i = 0; i < 64; i += 1) {
      const lane = (i % 8) - 3.5
      const offset = (i / 64 + time * (running ? (stage === 2 ? .5 : .22) : 0)) % 1
      if (stage === 0) { pos.set(-1.2 + lane * .18 + Math.sin(time * 1.4 + i) * .1, -.87 + offset * 2.25, .12 + Math.cos(time + i) * .38); scale.setScalar(.026 + (1-offset)*.032) }
      else if (stage === 1) { pos.set(-.45 + lane * .105 * (1-offset), 1.18 + Math.sin(offset * Math.PI) * .28, -.45 + offset * .3); scale.setScalar(.025 + offset*.018) }
      else if (stage === 2) { pos.set(.25 + lane * .16 + Math.sin(i*2.7)*.05, 1.55 - offset * 2.48, -.43 + Math.cos(i)*.12); scale.set(.018,.09 + (i%4)*.018,.018) }
      else { pos.set(-1.15 + lane * .19 + offset * .22, -.91 + Math.sin(offset * Math.PI) * .045, .15 + (i % 4) * .12); scale.setScalar(.028) }
      matrix.compose(pos, quat, scale); mesh.current.setMatrixAt(i, matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={mesh} args={[undefined, undefined, 64]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#b7ecf5" transparent opacity={.76} roughness={.25} /></instancedMesh>
}

function WaterSurface({ active }: { active: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => { if (!mesh.current) return; const geometry = mesh.current.geometry as THREE.BufferGeometry; const position = geometry.attributes.position; for (let index = 0; index < position.count; index += 1) { const x = position.getX(index); const y = position.getY(index); position.setZ(index, Math.sin(state.clock.elapsedTime * 1.5 + x * 3.2 + y) * .045 + Math.cos(state.clock.elapsedTime * 1.1 + y * 4) * .025) } position.needsUpdate = true; mesh.current.scale.lerp(new THREE.Vector3(active ? 1.035 : 1, active ? 1.035 : 1, 1), .05) })
  return <group position={[-1.15,-.96,.15]} rotation={[-Math.PI/2,0,.1]}><mesh ref={mesh} receiveShadow><planeGeometry args={[2.55,2.05,28,28]} /><meshPhysicalMaterial color="#2386a5" emissive={active ? '#1e6688' : '#073a58'} emissiveIntensity={active ? .58 : .22} transparent opacity={.9} roughness={.2} metalness={.24} /></mesh><mesh position={[0,0,.012]}><ringGeometry args={[.68,.71,48]} /><meshBasicMaterial color="#b7eff6" transparent opacity={.16} side={THREE.DoubleSide} /></mesh></group>
}

function CloudMass({ stage }: { stage: number }) { const group = useRef<THREE.Group>(null); useFrame((state) => { if (group.current) { const dense = stage === 1 ? 1.15 : stage === 2 ? 1.08 : 1; group.current.scale.lerp(new THREE.Vector3(dense,dense,dense),.05); group.current.position.x = -.15 + Math.sin(state.clock.elapsedTime*.18)*.08; group.current.position.y = 1.18 + Math.sin(state.clock.elapsedTime*.42)*.045 } }); return <group ref={group} position={[-.15,1.18,-.45]}>{[[-.62,-.03,.04,.48],[-.22,.18,0,.62],[.22,.06,-.05,.52],[.56,-.12,.04,.42],[.08,-.22,.12,.5]].map(([x,y,z,s],i)=><mesh key={i} position={[x,y,z]} scale={[1.18,.78,.82]}><icosahedronGeometry args={[s,2]} /><meshStandardMaterial color={stage===2?'#b9cbd5':'#dcecf2'} roughness={.82} transparent opacity={.92} /></mesh>)}</group> }

function WaterCamera({ stage }: { stage: number }) {
  const controls = useRef<CameraControls>(null)
  useEffect(() => {
    if (!controls.current) return
    const views = [[5.6, 4.2, 6.4, -1.1, -.55, .1], [4.4, 3.4, 5.8, -.15, 1.1, -.45], [5.1, 3.8, 6.1, .65, .15, -.25], [5.8, 4.4, 6.8, -1.1, -.8, .1]]
    const view = views[stage]
    controls.current.setLookAt(view[0], view[1], view[2], view[3], view[4], view[5], true)
  }, [stage])
  return <CameraControls ref={controls} makeDefault smoothTime={.8} minDistance={4.8} maxDistance={10} />
}

export function WaterCycleDiorama({ stage, running }: { stage: number; running: boolean }) {
  return <>
    <LightingRig />
    <WaterCamera stage={stage} />
    <mesh position={[0,-1.18,0]} receiveShadow><cylinderGeometry args={[3.28,3.52,.35,64]} /><meshStandardMaterial color="#3c6658" roughness={.94} /></mesh>
    <WaterSurface active={stage===0} />
    <group position={[1.35,-.7,.25]} rotation={[0,.42,0]}>{[[1.08,.45,.98],[.76,.65,.78],[.48,.78,.56]].map(([x,y,z],i)=><mesh key={i} position={[i*.22,y*.55,-i*.12]} scale={[x,y,z]}><icosahedronGeometry args={[.82,2]} /><meshStandardMaterial color={i===2?'#6f9874':'#547b63'} roughness={.9} /></mesh>)}</group>
    <group position={[2.18,-.89,-.72]}>{[[-.15,0,.18],[.12,.04,-.14],[.29,-.02,.1]].map((p,i)=><mesh key={i} position={p as [number,number,number]} scale={[.33,.75,.33]}><icosahedronGeometry args={[.46,1]} /><meshStandardMaterial color="#326d55" roughness={.9} /></mesh>)}</group>
    <CloudMass stage={stage} />
    <mesh position={[-1.9, 1.62, -.5]}><sphereGeometry args={[.35, 24, 16]} /><meshStandardMaterial color="#ffd25f" emissive="#ffbc3d" emissiveIntensity={.65} /></mesh>
    <pointLight position={[-1.9, 1.62, -.5]} intensity={3.5} color="#ffe3a5" distance={6} />
    <WaterDrops stage={stage} running={running} />
    <Html position={[-1.85, 2.05, -.45]} center><span className="scene-tag">Sun heats water</span></Html>
    <Html position={stage === 0 ? [-1.1, .2, .4] : stage === 1 ? [-.15, 1.9, -.4] : stage === 2 ? [.7, .25, -.4] : [-1.25, -.55, .3]} center><span className="scene-tag">{['evaporation', 'condensation', 'rain', 'collection'][stage]}</span></Html>
  </>
}

function MatterParticles({ temperature }: { temperature: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const matrix = useMemo(() => new THREE.Matrix4(), [])
  const pos = useMemo(() => new THREE.Vector3(), [])
  const quat = useMemo(() => new THREE.Quaternion(), [])
  const scale = useMemo(() => new THREE.Vector3(.09,.09,.09), [])
  const seeds = useMemo(() => Array.from({ length: 56 }, (_, index) => ({ x: ((index * 47) % 97) / 97 - .5, y: ((index * 67) % 89) / 89 - .5, z: ((index * 29) % 83) / 83 - .5 })), [])
  useFrame((state) => {
    if (!mesh.current) return
    const phase = (temperature - 10) / 80
    const time = state.clock.elapsedTime
    seeds.forEach((seed, index) => {
      const solid = new THREE.Vector3(((index % 7) - 3) * .32, (Math.floor(index / 7) - 3.5) * .32, ((Math.floor(index / 7) % 3) - 1) * .32)
      // The same particle gradually changes behaviour instead of teleporting between diagrams.
      solid.add(new THREE.Vector3(Math.sin(time * 7.2 + index) * .028, Math.cos(time * 8.3 + index * .7) * .028, Math.sin(time * 6.6 + index * 1.3) * .02))
      const liquid = new THREE.Vector3(seed.x * 2.05 + Math.sin(time * 1.7 + index * 1.9) * .16, -.25 + Math.abs(seed.y) * 1.1 + Math.sin(time * 1.4 + index) * .13, seed.z * 1.35 + Math.cos(time * 1.35 + index * .6) * .13)
      const gas = new THREE.Vector3(seed.x * 4.25 + Math.sin(time * 3.3 + index * 2.2) * .32, seed.y * 2.85 + Math.cos(time * 2.8 + index * 1.6) * .3, seed.z * 1.7 + Math.sin(time * 3.1 + index) * .22)
      const solidMix = clamp(phase * 2, 0, 1); const gasMix = clamp((phase - .46) * 1.85, 0, 1)
      pos.copy(solid).lerp(liquid, solidMix).lerp(gas, gasMix)
      matrix.compose(pos, quat, scale); mesh.current!.setMatrixAt(index, matrix)
    }); mesh.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={mesh} args={[undefined, undefined, 56]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#9e8cff" emissive="#5a4ac4" emissiveIntensity={.38} roughness={.3} /></instancedMesh>
}

function MatterCamera({ temperature }: { temperature: number }) {
  const controls = useRef<CameraControls>(null)
  useEffect(() => {
    const heat = clamp((temperature - 10) / 80, 0, 1)
    controls.current?.setLookAt(heat > .62 ? 0 : 3.8, heat > .62 ? 1.5 : 2.4, heat > .62 ? 7.2 : 5.6, 0, 0, 0, true)
  }, [temperature])
  return <CameraControls ref={controls} makeDefault smoothTime={.85} minDistance={3.9} maxDistance={10} />
}

export function MatterScene3D({ temperature }: { temperature: number }) {
  const phase = (temperature - 10) / 80
  const state = phase < .31 ? 'SOLID · vibrate' : phase < .65 ? 'LIQUID · slide' : 'GAS · spread out'
  return <>
    <LightingRig floor={false} />
    <MatterCamera temperature={temperature} />
    <mesh position={[0, 0, -.95]}><boxGeometry args={[5.3, 3.7, .12]} /><meshPhysicalMaterial color="#16304e" transparent opacity={.42} roughness={.2} /></mesh>
    <mesh><boxGeometry args={[5.15, 3.45, 2.05]} /><meshPhysicalMaterial color="#76c8e7" transparent opacity={.045} roughness={.15} /></mesh>
    <Line points={[[-2.55,-1.75,0],[2.55,-1.75,0]]} color="#4a6d93" lineWidth={1.1} />
    <MatterParticles temperature={temperature} />
    <Text position={[0, 1.95, 0]} fontSize={.24} color="#cbdaf0">{state}</Text>
  </>
}

export function LightShadowScene({ lamp, object, showRays, onLampChange, onObjectChange }: { lamp: number; object: number; showRays: boolean; onLampChange: (next: number) => void; onObjectChange: (next: number) => void }) {
  const lampX = (lamp - 25) / 18; const objectX = (object - 52) / 14
  const dragLamp = (event: { stopPropagation: () => void; point: THREE.Vector3 }) => { event.stopPropagation(); onLampChange(event.point.x * 18 + 25) }
  const dragObject = (event: { stopPropagation: () => void; point: THREE.Vector3 }) => { event.stopPropagation(); onObjectChange(event.point.x * 14 + 52) }
  return <>
    <ambientLight intensity={.55} />
    <pointLight castShadow position={[lampX, 2.9, 2.3]} intensity={18} distance={8} color="#ffe0a0" shadow-mapSize={[1024, 1024]} />
    <mesh position={[lampX, 2.9, 2.3]} onPointerDown={dragLamp} onPointerMove={(event) => { if (event.buttons) dragLamp(event) }}><sphereGeometry args={[.24, 20, 14]} /><meshStandardMaterial color="#ffdd73" emissive="#ffc345" emissiveIntensity={1.4} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow><planeGeometry args={[7, 5]} /><meshStandardMaterial color="#375a67" roughness={.96} /></mesh>
    <mesh position={[0, 1, -2]} receiveShadow><planeGeometry args={[7, 4]} /><meshStandardMaterial color="#2e4964" roughness={.92} /></mesh>
    <mesh position={[objectX, -.12, .15]} castShadow onPointerDown={dragObject} onPointerMove={(event) => { if (event.buttons) dragObject(event) }}><boxGeometry args={[.72, 1.85, .72]} /><meshStandardMaterial color="#ff876f" emissive="#4e100b" emissiveIntensity={.2} roughness={.62} /><Edges color="#ffd2c6" linewidth={1.1} /></mesh>
    {showRays && <><Line points={[[lampX, 2.9, 2.26], [objectX - .36, .8, .48], [objectX - .78, .2, -1.96]]} color="#ffe5a5" transparent opacity={.46} lineWidth={1.2} /><Line points={[[lampX, 2.9, 2.26], [objectX + .36, -.8, .48], [objectX + .92, -1.0, -1.96]]} color="#ffe5a5" transparent opacity={.34} lineWidth={1.2} /></>}
    <mesh position={[lampX, 1.2, 2.3]}><cylinderGeometry args={[.05,.05,2.2,12]} /><meshStandardMaterial color="#6f88a5" /></mesh>
    <CameraControls makeDefault smoothTime={.65} minDistance={5.2} maxDistance={10} maxPolarAngle={Math.PI / 2.05} />
    <Html position={[lampX, 3.32, 2.3]} center><span className="scene-tag">lamp</span></Html><Html position={[objectX, .95, .2]} center><span className="scene-tag">block</span></Html>
  </>
}

export type AtomModel = { symbol: string; name: string; protons: number; neutrons: number; color: string; shells: number[] }
function AtomCamera({ focused }: { focused: boolean }) { const controls = useRef<CameraControls>(null); useEffect(() => { controls.current?.setLookAt(focused ? 4.1 : 5.4, focused ? 2.8 : 3.9, focused ? 5.2 : 6.7, 0, 0, 0, true) }, [focused]); return <CameraControls ref={controls} makeDefault smoothTime={.75} minDistance={3.6} maxDistance={9} /> }
function AtomCore({ atom }: { atom: AtomModel }) { const group = useRef<THREE.Group>(null); const nodes = useMemo(() => Array.from({ length: atom.protons + atom.neutrons }, (_, index) => ({ x: ((index * 37) % 101) / 101 - .5, y: ((index * 61) % 97) / 97 - .5, z: ((index * 29) % 89) / 89 - .5, proton: index < atom.protons })), [atom]); useFrame((state) => { if (group.current) { group.current.rotation.y = state.clock.elapsedTime * .25; const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * .035; group.current.scale.setScalar(pulse) } }); return <group ref={group}>{nodes.map((node, index) => <mesh key={index} position={[node.x * .85, node.y * .85, node.z * .85]}><sphereGeometry args={[.16, 16, 12]} /><meshStandardMaterial color={node.proton ? '#ff736d' : '#6da8e8'} emissive={node.proton ? '#7b201c' : '#204b83'} emissiveIntensity={.35} roughness={.36} /></mesh>)}</group> }
function ElectronShell({ radius, electrons, color, speed }: { radius: number; electrons: number; color: string; speed: number }) { const group = useRef<THREE.Group>(null); useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * speed }); return <group ref={group} rotation={[Math.PI / 2.9, 0, .3]}><mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[radius - .009, radius, 72]} /><meshBasicMaterial color="#46779e" transparent opacity={.42} side={THREE.DoubleSide} /></mesh>{Array.from({ length: electrons }, (_, index) => { const angle = (index / electrons) * Math.PI * 2; return <mesh key={index} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}><sphereGeometry args={[.09, 12, 8]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.58} /></mesh> })}</group> }
export function AtomScene3D({ atom }: { atom: AtomModel }) { const shellColors = ['#79e5ef', '#ffd467', '#ff9e8a']; const radii = [1.12, 1.76, 2.38]; return <><LightingRig floor={false} /><AtomCamera focused={atom.protons > 2} /><AtomCore atom={atom} />{atom.shells.map((electrons, index) => <ElectronShell key={`${atom.symbol}-${index}`} radius={radii[index]} electrons={electrons} color={shellColors[index]} speed={index % 2 ? -.78 : 1.15} />)}<Html position={[0, -2.82, 0]} center><span className="scene-hint">red = protons · blue = neutrons · glowing dots = electrons</span></Html></> }

export type CellKind = 'animal' | 'plant'
export type OrganelleName = 'nucleus' | 'mitochondria' | 'vacuole' | 'chloroplast'
const organellePositions: Record<OrganelleName, [number, number, number]> = { nucleus: [0, .05, .42], mitochondria: [-1.05, -.3, .55], vacuole: [.85, .35, -.25], chloroplast: [1.05, -.55, .4] }
function CellCamera({ kind, active }: { kind: CellKind; active: OrganelleName }) { const controls = useRef<CameraControls>(null); useEffect(() => { const target = organellePositions[active]; controls.current?.setLookAt(kind === 'plant' ? 4.9 : 4.4, 3.05, 5.4, target[0] * .26, target[1] * .26, 0, true) }, [active, kind]); return <CameraControls ref={controls} makeDefault smoothTime={.75} minDistance={4} maxDistance={9} /> }
function Nucleus({ active, onClick }: { active: boolean; onClick: () => void }) { const ref = useRef<THREE.Group>(null); useFrame((state) => { if (ref.current) ref.current.scale.setScalar((active ? 1.18 : 1) + Math.sin(state.clock.elapsedTime * 1.4) * .018) }); return <group ref={ref} position={organellePositions.nucleus} onClick={(event) => { event.stopPropagation(); onClick() }}><mesh><sphereGeometry args={[.73, 32, 24]} /><meshPhysicalMaterial color="#a78cf1" transparent opacity={.72} transmission={.08} roughness={.28} emissive={active ? '#7651d4' : '#171027'} emissiveIntensity={active ? .5 : .1} /></mesh><mesh scale={.72}><sphereGeometry args={[.5, 26, 18]} /><meshStandardMaterial color="#d6c5ff" transparent opacity={.42} roughness={.45} /></mesh><mesh position={[.12,.08,.5]}><sphereGeometry args={[.19, 18, 12]} /><meshStandardMaterial color="#7651c7" emissive="#542fa3" emissiveIntensity={.45} /></mesh></group> }
function Mitochondrion({ position, active, onClick }: { position: [number, number, number]; active: boolean; onClick: () => void }) { const ref = useRef<THREE.Group>(null); const bean = useMemo(() => { const shape = new THREE.Shape(); shape.moveTo(-.48,0); shape.bezierCurveTo(-.42,.35,.16,.42,.48,.1); shape.bezierCurveTo(.62,-.2,.25,-.45,-.17,-.34); shape.bezierCurveTo(-.48,-.27,-.6,-.1,-.48,0); return new THREE.ExtrudeGeometry(shape,{depth:.25,bevelEnabled:true,bevelThickness:.04,bevelSize:.035,bevelSegments:2}) }, []); useFrame((state) => { if (ref.current) { ref.current.rotation.y = state.clock.elapsedTime * .55; const beat = active ? 1.16 + Math.sin(state.clock.elapsedTime * 3.4) * .05 : 1; ref.current.scale.setScalar(beat) } }); return <group ref={ref} position={position} rotation={[.18,.45,-.2]} onClick={(event) => { event.stopPropagation(); onClick() }}><mesh geometry={bean}><meshStandardMaterial color="#d96f59" emissive={active ? '#b8412e' : '#32100c'} emissiveIntensity={active ? .55 : .1} roughness={.48} /></mesh>{[-.22,0,.22].map((x) => <mesh key={x} position={[x,.02,.29]} rotation={[0,0,.32]}><torusGeometry args={[.115,.022,7,18]} /><meshBasicMaterial color="#ffd5a2" transparent opacity={.86} /></mesh>)}</group> }
function Chloroplast({ position, active, onClick }: { position: [number, number, number]; active: boolean; onClick: () => void }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => { if (group.current) group.current.rotation.z = Math.sin(state.clock.elapsedTime * .6) * .16 })
  return <group ref={group} position={position} scale={active ? 1.16 : 1} onClick={(event) => { event.stopPropagation(); onClick() }}>
    <mesh scale={[1.4,.75,.75]}><sphereGeometry args={[.3, 18, 12]} /><meshStandardMaterial color="#80d479" emissive={active ? '#47a849' : '#000'} emissiveIntensity={.46} roughness={.48} /></mesh>
    {[-.13, 0, .13].map((x) => <mesh key={x} position={[x, 0, .22]} scale={[.045,.18,.02]}><boxGeometry /><meshBasicMaterial color="#d7f5a5" /></mesh>)}
  </group>
}
function CytoplasmDust() { const dots = useMemo(() => Array.from({length:30},(_,i)=>[Math.sin(i*4.3)*1.55,Math.cos(i*2.1)*1.2,((i*17)%11-5)*.1] as [number,number,number]),[]); return <>{dots.map((p,i)=><mesh key={i} position={p}><sphereGeometry args={[.025+(i%3)*.012,8,6]} /><meshBasicMaterial color="#b7d9df" transparent opacity={.23} /></mesh>)}</> }
function CellInterior({ kind, active, onSelect }: { kind: CellKind; active: OrganelleName; onSelect: (organelle: OrganelleName) => void }) { const root = useRef<THREE.Group>(null); useFrame((state) => { if (root.current) { root.current.rotation.y = Math.sin(state.clock.elapsedTime * .18)*.08; const breath=1+Math.sin(state.clock.elapsedTime*.7)*.018; root.current.scale.setScalar(breath) } }); const plant = kind === 'plant'; return <group ref={root}>{plant ? <RoundedBox args={[4.1,3.25,1.45]} radius={.48} smoothness={6}><meshPhysicalMaterial color="#65bd8c" transparent opacity={.22} roughness={.28} /></RoundedBox> : <group scale={[1.14,.91,.74]}><mesh><dodecahedronGeometry args={[2.05,3]} /><meshPhysicalMaterial color="#6fb7ca" transparent opacity={.16} roughness={.32} transmission={.08} side={THREE.DoubleSide} /><Edges color="#67b8c8" linewidth={.55} /></mesh><mesh scale={.89}><dodecahedronGeometry args={[2.05,3]} /><meshBasicMaterial color="#7fc9c6" transparent opacity={.055} side={THREE.BackSide} /></mesh></group>}<CytoplasmDust /><Nucleus active={active==='nucleus'} onClick={()=>onSelect('nucleus')} /><Mitochondrion position={organellePositions.mitochondria} active={active==='mitochondria'} onClick={()=>onSelect('mitochondria')} /><Mitochondrion position={[.35,-.9,.15]} active={active==='mitochondria'} onClick={()=>onSelect('mitochondria')} /><mesh position={organellePositions.vacuole} scale={active==='vacuole'?1.18:1} onClick={(event)=>{event.stopPropagation();onSelect('vacuole')}}><sphereGeometry args={[.72,24,18]} /><meshPhysicalMaterial color="#64cbdc" transparent opacity={.5} roughness={.15} transmission={.15} /></mesh>{plant && <>{[[1.15,-.55,.4],[-1.2,.63,.2],[.45,.95,-.35]].map((point,index)=><Chloroplast key={index} position={point as [number,number,number]} active={active==='chloroplast'} onClick={()=>onSelect('chloroplast')}/>)}</>}<group position={[-.9,.78,-.3]} rotation={[.1,.3,.15]}>{[-.24,0,.24].map(y=><mesh key={y} position={[0,y,0]}><torusGeometry args={[.3,.035,8,24,Math.PI]} /><meshStandardMaterial color="#e6a6a5" roughness={.55} /></mesh>)}</group></group> }
export function CellScene3D({ kind, active, onSelect }: { kind: CellKind; active: OrganelleName; onSelect: (organelle: OrganelleName) => void }) { return <><LightingRig floor={false} /><CellCamera kind={kind} active={active} /><CellInterior kind={kind} active={active} onSelect={onSelect} /><Html position={[0, -2.5, 0]} center><span className="scene-hint">tap a glowing part to learn its job</span></Html></> }

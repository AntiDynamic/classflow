import { CameraControls, Edges, Html, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { Pause, Play, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { DimensionLabel } from '../../three/DimensionLabel'
import { LightingRig } from '../../three/LightingRig'
import { SceneCanvas } from '../../three/SceneCanvas'

type Dimensions = { length: number; width: number; height: number }
type Axis = keyof Dimensions | null
type SolidKind = 'cube' | 'prism' | 'cylinder'
const unit = .46
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function GeometrySlider({ label, displayLabel, value, onChange, active, onHover }: { label: keyof Dimensions; displayLabel?: string; value: number; onChange: (next: number) => void; active: boolean; onHover: (axis: Axis) => void }) {
  return <label className={`geometry-slider ${active ? 'is-active' : ''}`} onMouseEnter={() => onHover(label)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(label)} onBlur={() => onHover(null)}>
    <span><b>{displayLabel || label}</b><strong>{value}</strong></span><input type="range" min="2" max="7" value={value} onChange={(event) => onChange(Number(event.target.value))} />
  </label>
}

function UnitCubes({ dimensions, start, end, progress, color, opacity = .8 }: { dimensions: Dimensions; start: number; end: number; progress: number; color: string; opacity?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const total = dimensions.length * dimensions.width * dimensions.height
  const count = Math.max(0, Math.min(end, total) - start)
  const matrix = useMemo(() => new THREE.Matrix4(), [])
  const position = useMemo(() => new THREE.Vector3(), [])
  const scale = useMemo(() => new THREE.Vector3(), [])
  useLayoutEffect(() => {
    if (!mesh.current) return
    for (let local = 0; local < count; local += 1) {
      const index = start + local
      const x = index % dimensions.length
      const z = Math.floor(index / dimensions.length) % dimensions.width
      const y = Math.floor(index / (dimensions.length * dimensions.width))
      const shown = clamp(progress - index, 0, 1)
      position.set((x - (dimensions.length - 1) / 2) * unit, (y - (dimensions.height - 1) / 2) * unit, (z - (dimensions.width - 1) / 2) * unit)
      scale.setScalar(Math.max(.001, shown * .9))
      matrix.compose(position, new THREE.Quaternion(), scale)
      mesh.current.setMatrixAt(local, matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count, dimensions, matrix, position, progress, scale, start])
  if (!count) return null
  return <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false} castShadow receiveShadow>
    <boxGeometry args={[unit, unit, unit]} />
    <meshStandardMaterial color={color} transparent opacity={opacity} roughness={.45} metalness={.06} />
  </instancedMesh>
}

function VolumeCamera({ mode }: { mode: 'normal' | 'filling' | 'complete' }) {
  const controls = useRef<CameraControls>(null)
  useEffect(() => {
    if (!controls.current) return
    const near = mode === 'normal' ? [4.35, 3.65, 5.25] : mode === 'filling' ? [5.15, 4.1, 6.15] : [4.7, 3.85, 5.55]
    controls.current.setLookAt(near[0], near[1], near[2], 0, 0, 0, true)
  }, [mode])
  return <CameraControls ref={controls} makeDefault smoothTime={.65} minDistance={4.7} maxDistance={11} maxPolarAngle={Math.PI / 2.05} />
}

function AnimatedPrismBounds({ box, mode, activeAxis }: { box: [number, number, number]; mode: 'normal' | 'filling' | 'complete'; activeAxis: Axis }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (!mesh.current) return
    mesh.current.scale.lerp(new THREE.Vector3(box[0], box[1], box[2]), .16)
  })
  const glow = activeAxis ? '#ff9a79' : '#b5e8ff'
  return <mesh ref={mesh} castShadow receiveShadow>
    <boxGeometry args={[1, 1, 1]} />
    <meshPhysicalMaterial color="#78bde6" transparent opacity={mode === 'normal' ? .17 : .065} roughness={.3} transmission={.1} emissive={activeAxis ? '#4b1615' : '#000000'} emissiveIntensity={activeAxis ? .35 : 0} />
    <Edges color={glow} linewidth={activeAxis ? 2.25 : 1.4} />
  </mesh>
}

function VolumeScene({ dimensions, motion, activeAxis, mode }: { dimensions: Dimensions; motion: React.MutableRefObject<{ progress: number }>; activeAxis: Axis; mode: 'normal' | 'filling' | 'complete' }) {
  const [progress, setProgress] = useState(0)
  const total = dimensions.length * dimensions.width * dimensions.height
  useFrame(() => setProgress(motion.current.progress))
  const box = [dimensions.length * unit, dimensions.height * unit, dimensions.width * unit] as [number, number, number]
  const firstRow = dimensions.length
  const firstLayer = dimensions.length * dimensions.width
  return <>
    <LightingRig />
    <VolumeCamera mode={mode} />
    <group>
      <AnimatedPrismBounds box={box} mode={mode} activeAxis={activeAxis} />
      <UnitCubes dimensions={dimensions} start={0} end={firstRow} progress={progress} color="#ffd56a" opacity={.92} />
      <UnitCubes dimensions={dimensions} start={firstRow} end={firstLayer} progress={progress} color="#5fd4dd" opacity={.82} />
      <UnitCubes dimensions={dimensions} start={firstLayer} end={total} progress={progress} color="#8ea5ff" opacity={.73} />
      <DimensionLabel from={[-box[0] / 2, -box[1] / 2 - .42, -box[2] / 2]} to={[box[0] / 2, -box[1] / 2 - .42, -box[2] / 2]} label={`length ${dimensions.length}`} color={activeAxis === 'length' ? '#ff8a73' : '#f2d277'} />
      <DimensionLabel from={[box[0] / 2 + .38, -box[1] / 2, -box[2] / 2]} to={[box[0] / 2 + .38, box[1] / 2, -box[2] / 2]} label={`height ${dimensions.height}`} color={activeAxis === 'height' ? '#ff8a73' : '#f2d277'} />
      <DimensionLabel from={[-box[0] / 2, -box[1] / 2 - .18, -box[2] / 2]} to={[-box[0] / 2, -box[1] / 2 - .18, box[2] / 2]} label={`width ${dimensions.width}`} color={activeAxis === 'width' ? '#ff8a73' : '#f2d277'} />
    </group>
  </>
}

type FaceSpec = { name: string; color: string; area: (d: Dimensions) => number; position: (d: Dimensions) => THREE.Vector3; rotation: THREE.Euler; explode: (d: Dimensions) => THREE.Vector3; net: (d: Dimensions) => THREE.Vector3; netRotation: THREE.Euler; scale: (d: Dimensions) => [number, number] }
const faces: FaceSpec[] = [
  { name: 'front', color: '#77d4db', area: (d) => d.length * d.height, position: (d) => new THREE.Vector3(0, 0, d.width * unit / 2), rotation: new THREE.Euler(0, 0, 0), explode: (d) => new THREE.Vector3(0, 0, d.width * unit / 2 + .85), net: () => new THREE.Vector3(0, 0, 0), netRotation: new THREE.Euler(0, 0, 0), scale: (d) => [d.length * unit, d.height * unit] },
  { name: 'back', color: '#98a3ff', area: (d) => d.length * d.height, position: (d) => new THREE.Vector3(0, 0, -d.width * unit / 2), rotation: new THREE.Euler(0, Math.PI, 0), explode: (d) => new THREE.Vector3(0, 0, -d.width * unit / 2 - .85), net: (d) => new THREE.Vector3(0, -(d.height * unit + .22), 0), netRotation: new THREE.Euler(0, 0, 0), scale: (d) => [d.length * unit, d.height * unit] },
  { name: 'left', color: '#ffad8d', area: (d) => d.width * d.height, position: (d) => new THREE.Vector3(-d.length * unit / 2, 0, 0), rotation: new THREE.Euler(0, -Math.PI / 2, 0), explode: (d) => new THREE.Vector3(-d.length * unit / 2 - .85, 0, 0), net: (d) => new THREE.Vector3(-(d.length * unit + d.width * unit) / 2 - .12, 0, 0), netRotation: new THREE.Euler(0, 0, 0), scale: (d) => [d.width * unit, d.height * unit] },
  { name: 'right', color: '#ffd56a', area: (d) => d.width * d.height, position: (d) => new THREE.Vector3(d.length * unit / 2, 0, 0), rotation: new THREE.Euler(0, Math.PI / 2, 0), explode: (d) => new THREE.Vector3(d.length * unit / 2 + .85, 0, 0), net: (d) => new THREE.Vector3((d.length * unit + d.width * unit) / 2 + .12, 0, 0), netRotation: new THREE.Euler(0, 0, 0), scale: (d) => [d.width * unit, d.height * unit] },
  { name: 'top', color: '#88e0a4', area: (d) => d.length * d.width, position: (d) => new THREE.Vector3(0, d.height * unit / 2, 0), rotation: new THREE.Euler(-Math.PI / 2, 0, 0), explode: (d) => new THREE.Vector3(0, d.height * unit / 2 + .85, 0), net: (d) => new THREE.Vector3(0, (d.height * unit + d.width * unit) / 2 + .12, 0), netRotation: new THREE.Euler(0, 0, 0), scale: (d) => [d.length * unit, d.width * unit] },
  { name: 'bottom', color: '#d1a2ff', area: (d) => d.length * d.width, position: (d) => new THREE.Vector3(0, -d.height * unit / 2, 0), rotation: new THREE.Euler(Math.PI / 2, 0, 0), explode: (d) => new THREE.Vector3(0, -d.height * unit / 2 - .85, 0), net: (d) => new THREE.Vector3(0, -(d.height * unit * 1.5 + d.width * unit) - .22, 0), netRotation: new THREE.Euler(0, 0, 0), scale: (d) => [d.length * unit, d.width * unit] },
]

function SurfaceFace({ face, dimensions, motion, active }: { face: FaceSpec; dimensions: Dimensions; motion: React.MutableRefObject<{ explode: number; net: number }>; active: boolean }) {
  const group = useRef<THREE.Group>(null)
  const normal = useMemo(() => face.position(dimensions), [dimensions, face])
  const exploded = useMemo(() => face.explode(dimensions), [dimensions, face])
  const net = useMemo(() => face.net(dimensions), [dimensions, face])
  const [width, height] = face.scale(dimensions)
  useFrame(() => {
    if (!group.current) return
    const { explode, net: unfolded } = motion.current
    const position = normal.clone().lerp(exploded, explode).lerp(net, unfolded)
    group.current.position.copy(position)
    group.current.rotation.set(
      THREE.MathUtils.lerp(face.rotation.x, face.netRotation.x, unfolded),
      THREE.MathUtils.lerp(face.rotation.y, face.netRotation.y, unfolded),
      THREE.MathUtils.lerp(face.rotation.z, face.netRotation.z, unfolded),
    )
  })
  return <group ref={group}>
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={face.color} transparent opacity={active ? 1 : .58} roughness={.44} emissive={active ? face.color : '#000000'} emissiveIntensity={active ? .45 : 0} side={THREE.DoubleSide} />
      <Edges color={active ? '#ffffff' : '#162943'} linewidth={1.5} />
    </mesh>
    <Html center transform sprite distanceFactor={8} style={{ opacity: motion.current.net > .42 ? 1 : 0, pointerEvents: 'none' }}><span className="surface-area-label">{face.area(dimensions)} sq</span></Html>
  </group>
}

type SurfaceView = 'solid' | 'explode' | 'net'

function SurfaceCamera({ view }: { view: SurfaceView }) {
  const controls = useRef<CameraControls>(null)
  useEffect(() => {
    const position = view === 'solid' ? [6.5, 5.2, 7.8] : view === 'explode' ? [7.4, 4.6, 8.9] : [0, .3, 10.5]
    controls.current?.setLookAt(position[0], position[1], position[2], 0, 0, 0, true)
  }, [view])
  return <CameraControls ref={controls} makeDefault smoothTime={.75} minDistance={5} maxDistance={13} maxPolarAngle={Math.PI / 2.05} />
}

function SurfaceScene({ dimensions, motion, activeFace, view }: { dimensions: Dimensions; motion: React.MutableRefObject<{ explode: number; net: number }>; activeFace: number; view: SurfaceView }) {
  return <>
    <LightingRig floor={false} />
    <SurfaceCamera view={view} />
    <group>{faces.map((face, index) => <SurfaceFace key={face.name} face={face} dimensions={dimensions} motion={motion} active={activeFace === index} />)}</group>
    <Line points={[[-5, -3.1, 0], [5, -3.1, 0]]} color="#1d3956" lineWidth={1} />
  </>
}

function CylinderVolumeScene({ dimensions, motion, mode, activeAxis }: { dimensions: Dimensions; motion: React.MutableRefObject<{ progress: number }>; mode: 'normal' | 'filling' | 'complete'; activeAxis: Axis }) {
  const layers = Array.from({ length: dimensions.height }, (_, index) => index)
  const radius = dimensions.length * .27
  return <><LightingRig /><VolumeCamera mode={mode} /><group><mesh><cylinderGeometry args={[radius, radius, dimensions.height * .42, 48, 1, true]} /><meshPhysicalMaterial color="#78bde6" transparent opacity={mode === 'normal' ? .18 : .07} roughness={.3} /><Edges color="#b5e8ff" /></mesh>{layers.map((layer) => <CylinderLayer key={layer} index={layer} total={layers.length} radius={radius} motion={motion} />)}<DimensionLabel from={[0, -dimensions.height * .21 - .36, -radius]} to={[radius, -dimensions.height * .21 - .36, -radius]} label={`radius ${dimensions.length}`} color={activeAxis === 'length' ? '#ff8a73' : '#f2d277'} /><DimensionLabel from={[radius + .35, -dimensions.height * .21, 0]} to={[radius + .35, dimensions.height * .21, 0]} label={`height ${dimensions.height}`} color={activeAxis === 'height' ? '#ff8a73' : '#f2d277'} /></group></>
}

function CylinderLayer({ index, total, radius, motion }: { index: number; total: number; radius: number; motion: React.MutableRefObject<{ progress: number }> }) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => { if (!group.current) return; const shown = clamp(motion.current.progress - index, 0, 1); group.current.scale.setScalar(Math.max(.001, shown)); group.current.position.y = -((total - 1) * .42) / 2 + index * .42 })
  return <group ref={group}><mesh><cylinderGeometry args={[radius * .93, radius * .93, .34, 40]} /><meshStandardMaterial color={index === 0 ? '#ffd56a' : index === total - 1 ? '#8ea5ff' : '#5fd4dd'} transparent opacity={.82} roughness={.4} /></mesh></group>
}

function CylinderSurfaceCamera({ view }: { view: SurfaceView }) {
  const controls = useRef<CameraControls>(null)
  useEffect(() => {
    const position = view === 'solid' ? [6.3, 4.7, 7.7] : view === 'explode' ? [7, 4.2, 8.7] : [0, .1, 10.6]
    controls.current?.setLookAt(position[0], position[1], position[2], 0, 0, 0, true)
  }, [view])
  return <CameraControls ref={controls} makeDefault smoothTime={.75} minDistance={5} maxDistance={13} maxPolarAngle={Math.PI / 2.05} />
}

function CylinderSurfaceScene({ dimensions, motion, view }: { dimensions: Dimensions; motion: React.MutableRefObject<{ explode: number; net: number }>; view: SurfaceView }) {
  const wall = useRef<THREE.Mesh>(null)
  const top = useRef<THREE.Mesh>(null)
  const bottom = useRef<THREE.Mesh>(null)
  const net = useRef<THREE.Group>(null)
  const radius = dimensions.length * .27
  const height = dimensions.height * .42
  const circumference = Math.PI * 2 * radius
  useFrame(() => {
    const { explode, net: open } = motion.current
    if (wall.current) {
      ;(wall.current.material as THREE.MeshStandardMaterial).opacity = .62 * (1 - open)
      wall.current.scale.setScalar(1 + explode * .05)
    }
    const topStart = new THREE.Vector3(0, height / 2 + explode * .7, 0)
    const bottomStart = new THREE.Vector3(0, -height / 2 - explode * .7, 0)
    if (top.current) {
      top.current.position.copy(topStart.lerp(new THREE.Vector3(0, height / 2 + radius + .2, .03), open))
      top.current.rotation.set(0, 0, 0)
    }
    if (bottom.current) {
      bottom.current.position.copy(bottomStart.lerp(new THREE.Vector3(0, -height / 2 - radius - .2, .03), open))
      bottom.current.rotation.set(0, 0, 0)
    }
    if (net.current) {
      net.current.visible = open > .01
      net.current.scale.set(Math.max(.015, open), 1, 1)
    }
  })
  return <>
    <LightingRig floor={false} />
    <CylinderSurfaceCamera view={view} />
    <group>
      <mesh ref={wall}><cylinderGeometry args={[radius, radius, height, 48, 1, true]} /><meshStandardMaterial color="#77d4db" transparent opacity={.62} side={THREE.DoubleSide} /></mesh>
      <mesh ref={top} position={[0, height / 2, 0]}><circleGeometry args={[radius, 48]} /><meshStandardMaterial color="#ffd56a" transparent opacity={.86} side={THREE.DoubleSide} /><Edges color="#fff5c6" /></mesh>
      <mesh ref={bottom} position={[0, -height / 2, 0]}><circleGeometry args={[radius, 48]} /><meshStandardMaterial color="#98a3ff" transparent opacity={.86} side={THREE.DoubleSide} /><Edges color="#e8eaff" /></mesh>
      <group ref={net} visible={false}>
        <mesh><planeGeometry args={[circumference, height]} /><meshStandardMaterial color="#77d4db" transparent opacity={.82} side={THREE.DoubleSide} /><Edges color="#e9ffff" /></mesh>
        <Html position={[0, 0, .03]} center transform sprite distanceFactor={8}><span className="surface-area-label">2πr × h</span></Html>
        <Html position={[0, height / 2 + radius + .2, .05]} center transform sprite distanceFactor={8}><span className="surface-area-label">πr²</span></Html>
        <Html position={[0, -height / 2 - radius - .2, .05]} center transform sprite distanceFactor={8}><span className="surface-area-label">πr²</span></Html>
      </group>
    </group>
  </>
}

export function GeometryLab() {
  const [tab, setTab] = useState<'volume' | 'surface'>('volume')
  const [solid, setSolid] = useState<SolidKind>('prism')
  const [dimensions, setDimensions] = useState<Dimensions>({ length: 6, width: 4, height: 3 })
  const [activeAxis, setActiveAxis] = useState<Axis>(null)
  const [volumeMode, setVolumeMode] = useState<'normal' | 'filling' | 'complete'>('normal')
  const [volumeStep, setVolumeStep] = useState('The transparent box shows the space we will fill.')
  const [surfaceStep, setSurfaceStep] = useState('Press play to meet every outside face.')
  const [activeFace, setActiveFace] = useState(-1)
  const [unfolded, setUnfolded] = useState(false)
  const [surfaceView, setSurfaceView] = useState<SurfaceView>('solid')
  const [surfacePlaying, setSurfacePlaying] = useState(false)
  const volumeMotion = useRef({ progress: 0 })
  const surfaceMotion = useRef({ explode: 0, net: 0 })
  const volumeTimeline = useRef<gsap.core.Timeline | null>(null)
  const surfaceTimeline = useRef<gsap.core.Timeline | null>(null)
  const volume = solid === 'cylinder' ? Math.round(Math.PI * dimensions.length * dimensions.length * dimensions.height) : dimensions.length * dimensions.width * dimensions.height
  const surface = solid === 'cylinder' ? Math.round(2 * Math.PI * dimensions.length * dimensions.length + 2 * Math.PI * dimensions.length * dimensions.height) : 2 * (dimensions.length * dimensions.width + dimensions.length * dimensions.height + dimensions.width * dimensions.height)

  useEffect(() => () => { volumeTimeline.current?.kill(); surfaceTimeline.current?.kill() }, [])
  const chooseSolid = (next: SolidKind) => { setSolid(next); setDimensions(next === 'cube' ? { length: 4, width: 4, height: 4 } : next === 'cylinder' ? { length: 3, width: 3, height: 5 } : { length: 6, width: 4, height: 3 }); volumeMotion.current.progress = 0; surfaceMotion.current.explode = 0; surfaceMotion.current.net = 0; setUnfolded(false); setSurfaceView('solid'); setVolumeMode('normal'); setActiveFace(-1); setVolumeStep(next === 'cube' ? 'A cube has the same edge length in every direction.' : next === 'cylinder' ? 'A cylinder is made by stacking matching circular layers.' : 'A rectangular prism can have three different measurements.') }
  const update = (axis: keyof Dimensions, value: number) => { setDimensions((previous) => solid === 'cube' ? { length: value, width: value, height: value } : solid === 'cylinder' ? axis === 'length' ? { ...previous, length: value, width: value } : ({ ...previous, [axis]: value }) : ({ ...previous, [axis]: value })); volumeMotion.current.progress = 0; setVolumeMode('normal'); setVolumeStep(solid === 'cube' ? 'Every edge of the cube grows together.' : solid === 'cylinder' ? `${axis === 'length' ? 'The radius' : 'The height'} changes, so every circular layer changes too.` : `The ${axis} edge lights up. Now the prism has a new shape.`) }
  const seeVolume = () => {
    volumeTimeline.current?.kill(); volumeMotion.current.progress = 0; setVolumeMode('filling'); if (solid === 'cylinder') { const base = Math.round(Math.PI * dimensions.length * dimensions.length); const timeline = gsap.timeline().to(volumeMotion.current, { progress: 1, duration: .75, ease: 'power2.out' }).call(() => setVolumeStep(`One circular layer covers about ${base} square units.`)).to(volumeMotion.current, { progress: dimensions.height + 1, duration: 1.65, ease: 'power3.inOut' }).call(() => { setVolumeStep(`${base} in one layer × ${dimensions.height} layers ≈ ${volume} cubic units.`); setVolumeMode('complete') }); volumeTimeline.current = timeline; return } setVolumeStep(`First, one row: ${dimensions.length} cubes.`)
    const layer = dimensions.length * dimensions.width
    const timeline = gsap.timeline()
      .to(volumeMotion.current, { progress: dimensions.length, duration: .9, ease: 'power2.out' })
      .call(() => setVolumeStep(`A whole layer: ${dimensions.length} × ${dimensions.width} = ${layer} cubes.`))
      .to(volumeMotion.current, { progress: layer, duration: 1.25, ease: 'power2.inOut' })
      .call(() => setVolumeStep(`${layer} cubes in each layer × ${dimensions.height} layers = ${volume} cubes.`))
      .to(volumeMotion.current, { progress: volume + 1, duration: 1.65, ease: 'power3.inOut' })
      .call(() => setVolumeMode('complete'))
    volumeTimeline.current = timeline
  }
  const playSurface = () => {
    surfaceTimeline.current?.kill(); surfaceMotion.current.explode = 0; surfaceMotion.current.net = 0; setUnfolded(false); setSurfaceView('solid'); setActiveFace(-1); setSurfacePlaying(true); if (solid === 'cylinder') { const timeline = gsap.timeline({ onComplete: () => setSurfacePlaying(false) }).call(() => setSurfaceStep('A cylinder has two circular ends and one curved outside wall.')).to({}, { duration: 1.1 }).call(() => { setSurfaceStep('The ends and curved wall separate from one another.'); setSurfaceView('explode') }).to(surfaceMotion.current, { explode: 1, duration: 1.25, ease: 'power2.inOut' }).call(() => { setSurfaceStep('The curved wall unrolls into a rectangle. The same two circles stay attached.'); setUnfolded(true); setSurfaceView('net') }).to(surfaceMotion.current, { net: 1, duration: 1.7, ease: 'power3.inOut' }).call(() => setSurfaceStep(`Add the rectangle and both circles: about ${surface} square units.`)).to({}, { duration: 1.25 }).call(() => { setSurfaceStep('Now watch the net roll back into its 3D cylinder.'); setSurfaceView('explode') }).to(surfaceMotion.current, { net: 0, duration: 1.45, ease: 'power3.inOut' }).to(surfaceMotion.current, { explode: 0, duration: 1.1, ease: 'power2.inOut' }).call(() => { setUnfolded(false); setSurfaceView('solid'); setSurfaceStep('The outside surfaces have folded back together.') }); surfaceTimeline.current = timeline; return } setSurfaceStep('A box has six outside faces. Watch each one light up.')
    const timeline = gsap.timeline({ onComplete: () => setSurfacePlaying(false) })
    faces.forEach((face, index) => timeline.call(() => { setActiveFace(index); setSurfaceStep(`${face.name}: ${face.area(dimensions)} square units`) }).to({}, { duration: .68 }))
    timeline.call(() => { setActiveFace(-1); setSurfaceStep('Now the faces float away from the centre.'); setSurfaceView('explode') }).to(surfaceMotion.current, { explode: 1, duration: 1.25, ease: 'power2.inOut' })
      .call(() => { setSurfaceStep('The box unfolds into a flat net. Each coloured piece is an outside face.'); setUnfolded(true); setSurfaceView('net') })
      .to(surfaceMotion.current, { net: 1, duration: 1.7, ease: 'power3.inOut' })
      .call(() => setSurfaceStep(`Add every outside face: ${surface} square units.`))
      .to({}, { duration: 1.25 })
      .call(() => { setSurfaceStep('Now the net folds back into the solid.'); setSurfaceView('explode') })
      .to(surfaceMotion.current, { net: 0, duration: 1.45, ease: 'power3.inOut' })
      .to(surfaceMotion.current, { explode: 0, duration: 1.1, ease: 'power2.inOut' })
      .call(() => { setUnfolded(false); setSurfaceView('solid'); setSurfaceStep('All six faces are back together.') })
    surfaceTimeline.current = timeline
  }
  const replaySurface = () => { surfaceTimeline.current?.restart() }
  const togglePause = () => { if (!surfaceTimeline.current) return; if (surfaceTimeline.current.paused()) { surfaceTimeline.current.play(); setSurfacePlaying(true) } else { surfaceTimeline.current.pause(); setSurfacePlaying(false) } }
  const solidName = solid === 'cube' ? 'cube' : solid === 'cylinder' ? 'cylinder' : 'rectangular prism'
  const volumeFormula = solid === 'cube' ? `${dimensions.length} × ${dimensions.length} × ${dimensions.length}` : solid === 'cylinder' ? `π × ${dimensions.length}² × ${dimensions.height}` : `${dimensions.length} × ${dimensions.width} × ${dimensions.height}`
  const surfaceFormula = solid === 'cube' ? `6 × ${dimensions.length} × ${dimensions.length}` : solid === 'cylinder' ? `2π × ${dimensions.length}² + 2π × ${dimensions.length} × ${dimensions.height}` : '2(lw + lh + wh)'
  return <section className="geometry-lab">
    <div className="geometry-lab-head"><div><span className="eyebrow">Volume & Surface Area Studio</span><h2>Build it. Fill it. Unfold it.</h2><p>Pick a solid. Watch its inside build up, then open its outside surfaces into a flat net.</p></div><div className="geometry-tabs"><button className={tab === 'volume' ? 'active' : ''} onClick={() => setTab('volume')}>Volume</button><button className={tab === 'surface' ? 'active' : ''} onClick={() => setTab('surface')}>Surface area</button></div></div>
    <div className="solid-picker"><button className={solid === 'cube' ? 'active' : ''} onClick={() => chooseSolid('cube')}>Cube <small>all edges equal</small></button><button className={solid === 'prism' ? 'active' : ''} onClick={() => chooseSolid('prism')}>Rectangular prism <small>length · width · height</small></button><button className={solid === 'cylinder' ? 'active' : ''} onClick={() => chooseSolid('cylinder')}>Cylinder <small>radius · height</small></button></div>
    <div className="geometry-grid"><div className="geometry-scene">
      {tab === 'volume' ? <SceneCanvas camera={[4.35, 3.65, 5.25]}>{solid === 'cylinder' ? <CylinderVolumeScene dimensions={dimensions} motion={volumeMotion} activeAxis={activeAxis} mode={volumeMode} /> : <VolumeScene dimensions={dimensions} motion={volumeMotion} activeAxis={activeAxis} mode={volumeMode} />}</SceneCanvas> : <SceneCanvas camera={[6.5, 5.2, 7.8]}>{solid === 'cylinder' ? <CylinderSurfaceScene dimensions={dimensions} motion={surfaceMotion} view={surfaceView} /> : <SurfaceScene dimensions={dimensions} motion={surfaceMotion} activeFace={activeFace} view={surfaceView} />}</SceneCanvas>}
      <div className="scene-caption"><Sparkles size={14} /> {tab === 'volume' ? volumeStep : surfaceStep}</div>
    </div><aside className="geometry-controls"><span className="eyebrow">{solid === 'cube' ? 'Cube edge' : solid === 'cylinder' ? 'Cylinder dimensions' : 'Prism dimensions'}</span>
      {solid === 'cube' ? <GeometrySlider label="length" displayLabel="edge length" value={dimensions.length} active={activeAxis === 'length'} onHover={setActiveAxis} onChange={(value) => update('length', value)} /> : solid === 'cylinder' ? <><GeometrySlider label="length" displayLabel="radius (r)" value={dimensions.length} active={activeAxis === 'length'} onHover={setActiveAxis} onChange={(value) => update('length', value)} /><GeometrySlider label="height" displayLabel="height (h)" value={dimensions.height} active={activeAxis === 'height'} onHover={setActiveAxis} onChange={(value) => update('height', value)} /></> : (['length', 'width', 'height'] as const).map((axis) => <GeometrySlider key={axis} label={axis} value={dimensions[axis]} active={activeAxis === axis} onHover={setActiveAxis} onChange={(value) => update(axis, value)} />)}
      <div className="geometry-formula">{tab === 'volume' ? <><span>Space inside</span><strong>{volumeFormula}</strong><b>≈ {volume} cubic units</b></> : <><span>All outside surfaces</span><strong>{surfaceFormula}</strong><b>≈ {surface} square units</b></>}</div>
      {tab === 'volume' ? <button className="geometry-primary" onClick={seeVolume}><Play size={15} fill="currentColor" /> See the volume fill</button> : <div className="surface-actions"><button className="geometry-primary" onClick={playSurface}><Play size={15} fill="currentColor" /> Visualize surface</button><button onClick={togglePause} aria-label="Pause or play surface animation">{surfacePlaying ? <Pause size={16} /> : <Play size={16} />}</button><button onClick={replaySurface} aria-label="Replay surface animation"><RotateCcw size={16} /></button></div>}
    </aside></div>
    <div className="geometry-challenge"><div><span className="eyebrow">3D challenge</span><h3>{tab === 'volume' ? `Can you build this ${solidName} to hold about 24 cubic units?` : `Can you unfold the ${solidName} and count each outside surface?`}</h3><p>{tab === 'volume' ? `Your ${solidName} currently holds about ${volume} cubic units.` : 'Press play and pause at the flat net to inspect every surface.'}</p></div>{tab === 'volume' && solid === 'prism' && <button className={volume === 24 ? 'challenge-button success' : 'challenge-button'} onClick={() => setDimensions({ length: 4, width: 3, height: 2 })}>{volume === 24 ? 'You got it! ✦' : 'Show one answer'} </button>}</div>
  </section>
}

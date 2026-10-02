import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Atoms3D, Cells3D, Fractions3D, LightShadow3D, Matter3D, Shapes3D, SolarSystem3D, WaterCycle3D } from './three/Enhanced3DLessons'

type ModuleProps = { sound?: boolean }

export function AreaPerimeter(_: ModuleProps = {}) { return <Shapes3D /> }
export function Fractions(_: ModuleProps = {}) { return <Fractions3D /> }
export function ShapeExplorer(_: ModuleProps = {}) { return <Shapes3D /> }
export function SolarSystem(_: ModuleProps = {}) { return <SolarSystem3D /> }
export function WaterCycle(_: ModuleProps = {}) { return <WaterCycle3D /> }
export function StatesMatter(_: ModuleProps = {}) { return <Matter3D /> }
export function LightShadow(_: ModuleProps = {}) { return <LightShadow3D /> }
export function Atoms(_: ModuleProps = {}) { return <Atoms3D /> }
export function Cells(_: ModuleProps = {}) { return <Cells3D /> }

export function Multiplication(_: ModuleProps = {}) {
  const [groups, setGroups] = useState(5); const [each, setEach] = useState(3); const total = groups * each
  return <div><div className="module-header"><div><span className="eyebrow">See → play</span><h2>Group it up</h2><p>Multiplication is a shortcut for equal groups. Change a control, then watch an array grow one group at a time.</p></div></div><div className="multiplication-layout"><div className="groups-visual">{Array.from({ length: groups }, (_, group) => <motion.div className="object-row" key={group} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}><span className="row-label">{group + 1}</span>{Array.from({ length: each }, (_, object) => <motion.span className="group-object" key={object} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: object * .06 }}>{object % 2 === 0 ? '✦' : '●'}</motion.span>)}</motion.div>)}</div><div className="module-controls"><label className="control-slider"><span><b>Groups</b><strong>{groups}</strong></span><input type="range" min="1" max="6" value={groups} onChange={(event) => setGroups(Number(event.target.value))} /></label><label className="control-slider"><span><b>Objects in each</b><strong>{each}</strong></span><input type="range" min="1" max="6" value={each} onChange={(event) => setEach(Number(event.target.value))} /></label><div className="multiply-equation"><strong>{groups}</strong><span>groups of</span><strong>{each}</strong><span>=</span><strong className="answer-number">{total}</strong></div><p className="repeat-add">{Array.from({ length: groups }, () => each).join(' + ')} = {total}</p></div></div><div className="mini-challenge"><div><span className="eyebrow">Tiny challenge</span><h3>Make 5 groups of 3.</h3><p>That is the same as 3 + 3 + 3 + 3 + 3.</p></div><button className={groups === 5 && each === 3 ? 'challenge-button success' : 'challenge-button'} onClick={() => { setGroups(5); setEach(3) }}>{groups === 5 && each === 3 ? 'You grouped it ✦' : 'Build it'} <ArrowRight size={14} /></button></div></div>
}

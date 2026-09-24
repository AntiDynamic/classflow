import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, Clock3, MoveRight, ShieldCheck } from 'lucide-react'
import type { Language } from '../models/types'
import { getCopy } from '../i18n/translations'
import { useClassroom } from '../state/ClassroomProvider'

export function PlanScreen({ language, onBackToClassroom }: { language: Language; onBackToClassroom: () => void }) {
  const { state, planRows, primaryRecommendation, actions } = useClassroom()
  const primary = state.groups.find((group) => group.id === primaryRecommendation.groupId)
  return <div className="screen">
    <header className="screen-header"><div><p className="eyebrow">TODAY · {state.lesson.subject.toUpperCase()}</p><h1>{getCopy(language, 'plan')}</h1><p className="header-context">{state.lesson.duration} {getCopy(language, 'minutes')} · adapts as groups change</p></div><button className="icon-button" onClick={onBackToClassroom}><ArrowLeft size={19} /></button></header>
    <div className="plan-mode-card"><div className="plan-mode-icon"><BrainCircuit size={20} /></div><div><strong>DYNAMIC PLAN</strong><p>Starting plan, then reassess the room.</p></div><span className="plan-version">v{state.planVersion}</span></div>
    {state.lastPlanUpdate && <div className="compact-update"><CheckCircle2 size={16} /><span><b>{getCopy(language, 'planUpdated')}</b> {state.lastPlanUpdate}</span></div>}
    <div className="timeline-title"><span>Suggested flow</span><small>Not a fixed rotation</small></div>
    <section className="timeline">{planRows.map((row, index) => <div className={`timeline-row timeline-${row.kind}`} key={`${row.window}-${index}`}><div className="timeline-rail"><span className="timeline-dot" />{index < planRows.length - 1 && <span className="timeline-line" />}</div><div className="timeline-content"><span className="timeline-window">{row.window}</span><strong>{row.title}</strong><p>{row.detail}</p></div></div>)}</section>
    <section className="buffer-card"><div className="buffer-icon"><MoveRight size={18} /></div><div><strong>Transition buffer · 1.5 min</strong><p>Estimated for moving, settling, and switching materials. It is not a mandatory break.</p></div></section>
    <section className="attention-logic-card"><div className="section-heading"><span>What changes the plan</span><ShieldCheck size={16} /></div><div className="logic-chips"><span>New concept</span><span>Prerequisite gap</span><span>Recovery exhausted</span><span>Peer support</span><span>Time waiting</span></div><p>The engine keeps recovery groups working when they can still recover. A high-demand group takes priority when delay would cost learning time.</p></section>
    <button className="secondary-button secondary-button-wide" onClick={() => { actions.startAttention(primary?.id ?? state.groups[0].id); onBackToClassroom() }}>Go to {primary?.label ?? 'next group'} <ArrowRight size={16} /></button>
  </div>
}

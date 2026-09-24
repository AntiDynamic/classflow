import { ArrowRight, CheckCircle2, ChevronRight, Clock3, Info, RotateCcw, Sparkles, Zap } from 'lucide-react'
import type { GroupState, Language } from '../models/types'
import { getCopy } from '../i18n/translations'
import { useClassroom } from '../state/ClassroomProvider'
import { GroupCard } from '../components/GroupCard'
import { StatusPill } from '../components/StatusPill'

export function ClassroomScreen({ language, onOpenGroup, onViewPlan }: { language: Language; onOpenGroup: (group: GroupState) => void; onViewPlan: () => void }) {
  const { state, primaryRecommendation, recommendations, actions } = useClassroom()
  const primary = state.groups.find((group) => group.id === primaryRecommendation.groupId) ?? state.groups[0]
  const second = recommendations.find((recommendation) => recommendation.groupId !== primary.id)
  const secondGroup = second ? state.groups.find((group) => group.id === second.groupId) : undefined
  const isActive = state.activeGroupId === primary.id && primary.status === 'teaching'

  const mainAction = () => {
    if (!state.sessionStarted) actions.startSession()
    else if (isActive) actions.finishExplanation()
    else actions.startAttention(primary.id)
  }

  return <div className="screen classroom-screen">
    <header className="screen-header home-header"><div><p className="eyebrow">GOOD MORNING, TEACHER</p><h1>{state.teacher.name.split(' ')[0]} <span className="wave">✦</span></h1><p className="header-context">{state.lesson.subject} <span>·</span> {state.lesson.duration} {getCopy(language, 'minutes')}</p></div><div className="teacher-avatar">{state.teacher.avatar}</div></header>
    <div className="header-status-line"><span>Today · {state.teacher.village}</span><span className="offline-wrap"><span className={`tiny-dot ${state.isOnline ? 'tiny-dot-online' : 'tiny-dot-offline'}`} />{state.isOnline ? getCopy(language, 'synced') : getCopy(language, 'workingOffline')}</span></div>

    {state.lastPlanUpdate && state.sessionStarted && <div className="plan-update-banner"><div className="plan-update-icon"><Sparkles size={16} /></div><div><strong>{getCopy(language, 'planUpdated')}</strong><p>{state.lastPlanUpdate}</p></div><button onClick={onViewPlan}><ChevronRight size={17} /></button></div>}

    <section className="attention-card">
      <div className="attention-card-top"><div className="attention-label"><span className="attention-pulse" />{isActive ? getCopy(language, 'currentFocus') : getCopy(language, 'nextAttention')}</div><span className="ai-tag"><Sparkles size={12} /> Local AI</span></div>
      <div className="attention-grade-row"><div><h2>{primary.label}</h2><div className="attention-reason"><span>{primaryRecommendation.reason.split(' · ')[0]}</span>{primaryRecommendation.reason.includes(' · ') && <><i>·</i><span>{primaryRecommendation.reason.split(' · ').slice(1).join(' · ')}</span></>}</div></div><div className="priority-mark">{primaryRecommendation.score}</div></div>
      {primaryRecommendation.secondaryReason && <p className="attention-subtle">{primaryRecommendation.secondaryReason}</p>}
      <button className="primary-button primary-button-wide" onClick={mainAction}>{isActive ? getCopy(language, 'finishExplanation') : state.sessionStarted ? `${getCopy(language, 'goTo')} ${primary.label}` : `${getCopy(language, 'start')} ${primary.label}`}<ArrowRight size={17} /></button>
      <div className="attention-followup"><div><small>{getCopy(language, 'afterThat')}</small><strong>{secondGroup?.label ?? 'Reassess room'}</strong></div><div className="followup-action">{secondGroup?.status === 'stuck' ? 'Recovery first' : 'Continue activity'}</div></div>
    </section>

    <div className="section-heading classroom-heading"><span>{getCopy(language, 'classroom')}</span><button onClick={onViewPlan}>{getCopy(language, 'viewPlan')} <ChevronRight size={14} /></button></div>
    <section className="group-list">{state.groups.map((group) => <GroupCard key={group.id} group={group} students={state.students} language={language} isActive={state.activeGroupId === group.id} onOpen={() => onOpenGroup(group)} />)}</section>

    <section className="simulator-card"><div className="simulator-header"><div><div className="eyebrow"><Zap size={13} /> DEMO MODE</div><h3>{getCopy(language, 'simulator')}</h3></div><button className="icon-button subtle-button" onClick={actions.resetDemo} aria-label={getCopy(language, 'resetDemo')}><RotateCcw size={16} /></button></div><p>Trigger a real classroom change and watch the next attention move.</p><div className="simulator-actions"><button onClick={() => actions.updateStatus('grade-2', 'stuck')}><span className="sim-dot sim-amber" />{getCopy(language, 'grade2Stuck')}</button><button onClick={() => actions.updateStatus('grade-3', 'finished')}><span className="sim-dot sim-green" />{getCopy(language, 'grade3Finished')}</button><button onClick={() => actions.checkpoint('grade-1', 'needs-teacher')}><span className="sim-dot sim-blue" />{getCopy(language, 'grade1Weak')}</button></div></section>

    <div className="trust-note"><Info size={14} /><span>AI recommendation · Teacher decides. RIVER/MGML learning principles guide the activity modes.</span></div>
  </div>
}

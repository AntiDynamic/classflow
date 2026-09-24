import { ArrowRight, Check, Clock3, HandHelping, Layers3, UsersRound } from 'lucide-react'
import type { Language } from '../models/types'
import { getCopy } from '../i18n/translations'
import { useClassroom } from '../state/ClassroomProvider'

export function CatchUpScreen({ language, onOpenGroup }: { language: Language; onOpenGroup: (groupId: string) => void }) {
  const { state } = useClassroom()
  const group = state.groups.find((item) => item.id === 'grade-3')!
  const missed = state.students.filter((student) => student.groupId === group.id && (student.knownGap || student.attendanceRate < 0.8))
  return <div className="screen">
    <header className="screen-header"><div><p className="eyebrow">RIVER / MGML · RECOVERY</p><h1>{getCopy(language, 'catchUp')}</h1><p className="header-context">A practical path for children who missed a rung.</p></div><div className="catchup-count">{missed.length}<small>learners</small></div></header>
    <section className="catchup-hero"><div className="catchup-hero-icon"><HandHelping size={23} /></div><div><strong>One small group can keep moving</strong><p>Catch-up reinforces known material before a new concept is introduced.</p></div></section>
    <section className="catchup-card"><div className="catchup-card-header"><div><span className="eyebrow">RECOMMENDED CATCH-UP GROUP</span><h2>{group.label}</h2></div><span className="catchup-status">Ready</span></div><div className="catchup-stat-row"><div><span>Students</span><strong>{missed.length}</strong></div><div><span>Missed</span><strong>Place value</strong></div><div><span>Duration</span><strong>15 min</strong></div></div><div className="catchup-divider" /><div className="catchup-person-row"><div className="person-icon"><UsersRound size={17} /></div><div><span>Peer facilitator</span><strong>{group.facilitator ?? 'Aarav'}</strong><small>reinforces a known example · does not introduce new concepts</small></div><Check size={18} className="success-icon" /></div><div className="catchup-person-row"><div className="person-icon material-icon"><Layers3 size={17} /></div><div><span>Physical activity</span><strong>Place-value card practice</strong><small>Number cards · sticks · self-check card</small></div><Clock3 size={18} className="muted-icon" /></div><button className="primary-button primary-button-wide" onClick={() => onOpenGroup(group.id)}>Open catch-up group <ArrowRight size={17} /></button></section>
    <section className="students-missed"><div className="section-heading"><span>Students needing catch-up</span><small>{missed.length} names</small></div>{missed.map((student) => <div className="student-row" key={student.id}><div className="student-initial">{student.name.slice(0, 1)}</div><div><strong>{student.name}</strong><p>{student.knownGap ?? 'Attendance gap'} · {Math.round(student.attendanceRate * 100)}% attendance</p></div></div>)}</section>
    <div className="trust-note"><HandHelping size={14} /><span>Peer support is used for practice and recovery. Foundational teaching stays with the teacher.</span></div>
  </div>
}

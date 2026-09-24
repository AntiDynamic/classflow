import { ArrowLeft, Check, CircleAlert, Layers3, NotebookPen, UsersRound, X } from 'lucide-react'
import type { CheckpointResult, GroupState, Language, Student } from '../models/types'
import { getCopy } from '../i18n/translations'
import { useClassroom } from '../state/ClassroomProvider'
import { StatusPill } from './StatusPill'

export function GroupDetailSheet({ group, students, language, onClose }: { group: GroupState; students: Student[]; language: Language; onClose: () => void }) {
  const { actions } = useClassroom()
  const people = students.filter((student) => group.studentIds.includes(student.id))
  const update = (status: GroupState['status']) => { actions.updateStatus(group.id, status); onClose() }
  const checkpoint = (result: CheckpointResult) => { actions.checkpoint(group.id, result); onClose() }
  return <div className="sheet-backdrop" role="presentation" onClick={onClose}>
    <section className="detail-sheet" role="dialog" aria-modal="true" aria-label={`${group.label} details`} onClick={(event) => event.stopPropagation()}>
      <div className="sheet-handle" />
      <div className="sheet-header"><button className="icon-button" onClick={onClose} aria-label="Close"><ArrowLeft size={19} /></button><div><div className="eyebrow">{getCopy(language, 'classroom')}</div><h2>{group.label}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
      <div className="detail-title-row"><div><p className="detail-concept">{group.concept}</p><p className="muted-text">{group.activityName}</p></div><StatusPill status={group.status} language={language} /></div>
      <div className="detail-grid">
        <div><span className="detail-label">{getCopy(language, 'progress')}</span><strong>{group.progress}%</strong></div>
        <div><span className="detail-label">{getCopy(language, 'teacherNeed')}</span><strong className={`dependency-${group.teacherDependency}`}>{group.teacherDependency}</strong></div>
        <div><span className="detail-label">{getCopy(language, 'mode')}</span><strong>{group.mode.replace('-', ' ')}</strong></div>
        <div><span className="detail-label">Learners</span><strong>{people.length}</strong></div>
      </div>
      <div className="detail-callout"><Layers3 size={16} /><div><strong>Recommended next action</strong><p>{group.canRecover ? 'Let the recovery routine run once, then check again.' : 'Teacher explanation is the safest next move.'}</p></div></div>
      <div className="material-line"><NotebookPen size={15} /><span><b>{getCopy(language, 'materials')}:</b> {group.id === 'grade-1' ? 'Counters · Board' : group.id === 'grade-2' ? 'Number cards · Sticks' : 'Number cards · Sticks'}</span></div>
      {group.facilitator && <div className="material-line"><UsersRound size={15} /><span><b>Facilitator:</b> {group.facilitator} <small>reinforces known material</small></span></div>}
      <div className="quick-update-block"><div className="section-heading"><span>Quick update</span><small>1 tap · no detailed entry</small></div><div className="quick-update-grid">
        <button className="quick-option quick-good" onClick={() => update('on-track')}><Check size={17} />{getCopy(language, 'onTrack')}</button>
        <button className="quick-option quick-warn" onClick={() => update('slowing')}><CircleAlert size={17} />{getCopy(language, 'slowing')}</button>
        <button className="quick-option quick-risk" onClick={() => update('stuck')}><CircleAlert size={17} />{getCopy(language, 'stuck')}</button>
        <button className="quick-option quick-teacher" onClick={() => update('needs-teacher')}><UsersRound size={17} />{getCopy(language, 'needsTeacher')}</button>
      </div></div>
      <div className="checkpoint-block"><div className="section-heading"><span>{getCopy(language, 'checkpoint')}</span><small>Activity complete ≠ mastery</small></div><div className="checkpoint-actions"><button onClick={() => checkpoint('secure')}>Secure</button><button onClick={() => checkpoint('needs-practice')}>Needs practice</button><button onClick={() => checkpoint('needs-teacher')}>Needs teacher</button></div></div>
    </section>
  </div>
}

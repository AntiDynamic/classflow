import { ChevronRight, Clock3, Users } from 'lucide-react'
import type { GroupState, Language, Student } from '../models/types'
import { getCopy } from '../i18n/translations'
import { StatusPill } from './StatusPill'

export function GroupCard({ group, students, language, isActive, onOpen }: { group: GroupState; students: Student[]; language: Language; isActive: boolean; onOpen: () => void }) {
  const groupStudents = students.filter((student) => group.studentIds.includes(student.id))
  const modeLabel = group.mode === 'teacher-led' ? getCopy(language, 'teaching') : group.mode === 'peer-practice' || group.mode === 'catch-up' ? getCopy(language, 'peerPractice') : group.mode === 'independent' ? getCopy(language, 'independent') : group.mode === 'extension' ? 'Extension' : getCopy(language, 'practice')
  return <button className={`group-card group-card-${group.color} ${isActive ? 'group-card-active' : ''}`} onClick={onOpen}>
    <div className="group-card-top">
      <div className="group-title-wrap">
        <div className={`grade-badge grade-${group.color}`}>{group.shortLabel}</div>
        <div>
          <div className="group-label">{group.label}</div>
          <div className="group-meta"><Users size={13} /> {groupStudents.filter((student) => student.present).length} present <span>·</span> {modeLabel}</div>
        </div>
      </div>
      <ChevronRight size={18} className="muted-icon" />
    </div>
    <div className="group-activity">{group.activityName}</div>
    <div className="progress-row"><span>{group.progress}%</span><div className="progress-track"><div className={`progress-fill fill-${group.color}`} style={{ width: `${group.progress}%` }} /></div><span className="progress-time"><Clock3 size={12} /> {group.remainingMinutes}{getCopy(language, 'minutes')}</span></div>
    <div className="group-card-bottom"><StatusPill status={group.status} language={language} small />{(group.status === 'stuck' || group.status === 'slowing' || group.status === 'needs-teacher') && <span className="attention-note">Needs attention soon</span>}</div>
  </button>
}

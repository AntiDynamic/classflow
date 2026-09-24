import type { GroupStatus, Language } from '../models/types'
import { getCopy } from '../i18n/translations'

const statusKey: Record<GroupStatus, 'onTrack' | 'slowing' | 'stuck' | 'finished' | 'needsTeacher' | 'teaching'> = {
  'teaching': 'teaching',
  'on-track': 'onTrack',
  'slowing': 'slowing',
  'stuck': 'stuck',
  'finished': 'finished',
  'needs-teacher': 'needsTeacher',
}

export function StatusPill({ status, language, small = false }: { status: GroupStatus; language: Language; small?: boolean }) {
  return <span className={`status-pill status-${status} ${small ? 'status-pill-small' : ''}`}><span className="status-dot" />{getCopy(language, statusKey[status])}</span>
}

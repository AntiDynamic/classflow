export type Language = 'en' | 'mr' | 'hi' | 'or'

export type ScreenId = 'classroom' | 'plan' | 'catchup' | 'more'

export type GroupStatus = 'teaching' | 'on-track' | 'slowing' | 'stuck' | 'finished' | 'needs-teacher'

export type LearningPhase = 'introduction' | 'practice' | 'checkpoint' | 'recovery' | 'enrichment'

export type ActivityMode = 'teacher-led' | 'peer-practice' | 'independent' | 'self-check' | 'catch-up' | 'extension'

export type Dependency = 'low' | 'medium' | 'high'

export type CheckpointResult = 'secure' | 'needs-practice' | 'needs-teacher'

export interface Teacher {
  id: string
  name: string
  school: string
  village: string
  avatar: string
}

export interface Student {
  id: string
  name: string
  grade: number
  groupId: string
  present: boolean
  attendanceRate: number
  knownGap?: string
}

export interface Activity {
  id: string
  grade: number
  concept: string
  level: string
  phase: LearningPhase
  duration: number
  teacherDependency: Dependency
  materials: string[]
  prerequisites: string[]
  peerSuitable: boolean
  independentSuitable: boolean
  selfCheck: string
  recoveryPath: string
  extensionPath: string
}

export interface GroupState {
  id: string
  grade: number
  label: string
  shortLabel: string
  color: 'blue' | 'amber' | 'green'
  studentIds: string[]
  concept: string
  phase: LearningPhase
  activityId: string
  activityName: string
  mode: ActivityMode
  progress: number
  status: GroupStatus
  teacherDependency: Dependency
  prerequisiteConfidence: number
  recentFailures: number
  canRecover: boolean
  recoveryAttempts: number
  peerSupport: boolean
  selfCheck: boolean
  timeWaiting: number
  consequenceOfDelay: number
  affectedLearners: number
  elapsedMinutes: number
  remainingMinutes: number
  note: string
  facilitator?: string
  missedConcepts?: string[]
  lastUpdated: string
  checkpoint?: CheckpointResult
}

export interface TimetablePeriod {
  id: string
  day: string
  start: string
  end: string
  subject: string
  grades: number[]
  isBreak?: boolean
}

export interface Lesson {
  id: string
  date: string
  subject: string
  duration: number
  topics: string[]
  materials: string[]
  availableMaterials: string[]
}

export interface ClassroomEvent {
  id: string
  type: 'status-update' | 'checkpoint' | 'plan-update' | 'teacher-handoff' | 'lesson-start'
  groupId?: string
  message: string
  createdAt: string
}

export interface AttentionRecommendation {
  groupId: string
  score: number
  label: string
  reason: string
  secondaryReason?: string
  deferToActive?: boolean
  action: string
}

export interface PlanRow {
  window: string
  title: string
  detail: string
  kind: 'teacher' | 'continue' | 'checkpoint' | 'transition'
}

export interface AppState {
  teacher: Teacher
  students: Student[]
  groups: GroupState[]
  activities: Activity[]
  lesson: Lesson
  timetable: TimetablePeriod[]
  language: Language
  screen?: ScreenId
  isOnboarded: boolean
  isOnline: boolean
  lastSync: string
  sessionStarted: boolean
  elapsedMinutes: number
  activeGroupId?: string
  planVersion: number
  lastPlanUpdate?: string
  events: ClassroomEvent[]
}

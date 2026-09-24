import type { AppState, GroupState, Student, TimetablePeriod } from '../models/types'
import { activities } from './activities'

const now = new Date()
const stamp = (minutesAgo = 0) => new Date(now.getTime() - minutesAgo * 60_000).toISOString()

export const students: Student[] = [
  { id: 's1', name: 'Aarav', grade: 3, groupId: 'grade-3', present: true, attendanceRate: 0.98 },
  { id: 's2', name: 'Meera', grade: 3, groupId: 'grade-3', present: true, attendanceRate: 0.92 },
  { id: 's3', name: 'Sohan', grade: 3, groupId: 'grade-3', present: true, attendanceRate: 0.78, knownGap: 'Place value' },
  { id: 's4', name: 'Kavya', grade: 3, groupId: 'grade-3', present: true, attendanceRate: 0.71, knownGap: 'Place value' },
  { id: 's5', name: 'Riya', grade: 3, groupId: 'grade-3', present: false, attendanceRate: 0.66, knownGap: 'Place value' },
  { id: 's6', name: 'Ishaan', grade: 3, groupId: 'grade-3', present: true, attendanceRate: 0.94 },
  { id: 's7', name: 'Anaya', grade: 3, groupId: 'grade-3', present: true, attendanceRate: 0.96 },
  { id: 's8', name: 'Vivek', grade: 2, groupId: 'grade-2', present: true, attendanceRate: 0.97 },
  { id: 's9', name: 'Tara', grade: 2, groupId: 'grade-2', present: true, attendanceRate: 0.95 },
  { id: 's10', name: 'Mihir', grade: 2, groupId: 'grade-2', present: true, attendanceRate: 0.91 },
  { id: 's11', name: 'Nandini', grade: 2, groupId: 'grade-2', present: true, attendanceRate: 0.89 },
  { id: 's12', name: 'Om', grade: 2, groupId: 'grade-2', present: true, attendanceRate: 0.98 },
  { id: 's13', name: 'Aditi', grade: 2, groupId: 'grade-2', present: true, attendanceRate: 0.93 },
  { id: 's14', name: 'Arjun', grade: 2, groupId: 'grade-2', present: true, attendanceRate: 0.87 },
  { id: 's15', name: 'Ira', grade: 1, groupId: 'grade-1', present: true, attendanceRate: 0.97 },
  { id: 's16', name: 'Dev', grade: 1, groupId: 'grade-1', present: true, attendanceRate: 0.95 },
  { id: 's17', name: 'Pihu', grade: 1, groupId: 'grade-1', present: true, attendanceRate: 0.93 },
  { id: 's18', name: 'Rohan', grade: 1, groupId: 'grade-1', present: true, attendanceRate: 0.9 },
  { id: 's19', name: 'Siya', grade: 1, groupId: 'grade-1', present: true, attendanceRate: 0.96 },
  { id: 's20', name: 'Kabir', grade: 1, groupId: 'grade-1', present: true, attendanceRate: 0.88 },
  { id: 's21', name: 'Avni', grade: 1, groupId: 'grade-1', present: true, attendanceRate: 0.95 },
]

export const groups: GroupState[] = [
  {
    id: 'grade-1', grade: 1, label: 'Grade 1', shortLabel: 'G1', color: 'blue', studentIds: ['s15', 's16', 's17', 's18', 's19', 's20', 's21'],
    concept: 'Addition with counters', phase: 'introduction', activityId: 'g1-add-counters', activityName: 'Addition with counters', mode: 'teacher-led', progress: 28,
    status: 'teaching', teacherDependency: 'high', prerequisiteConfidence: 0.82, recentFailures: 0, canRecover: false, recoveryAttempts: 0, peerSupport: false, selfCheck: false,
    timeWaiting: 0, consequenceOfDelay: 0.9, affectedLearners: 7, elapsedMinutes: 0, remainingMinutes: 15, note: 'New concept: join two groups of counters.', lastUpdated: stamp(),
  },
  {
    id: 'grade-2', grade: 2, label: 'Grade 2', shortLabel: 'G2', color: 'amber', studentIds: ['s8', 's9', 's10', 's11', 's12', 's13', 's14'],
    concept: 'Place value', phase: 'practice', activityId: 'g2-place-sticks', activityName: 'Build tens and ones', mode: 'independent', progress: 42,
    status: 'on-track', teacherDependency: 'medium', prerequisiteConfidence: 0.74, recentFailures: 0, canRecover: true, recoveryAttempts: 0, peerSupport: true, selfCheck: true,
    timeWaiting: 4, consequenceOfDelay: 0.62, affectedLearners: 7, elapsedMinutes: 4, remainingMinutes: 8, note: 'Build two-digit numbers with sticks and number cards.', lastUpdated: stamp(4),
  },
  {
    id: 'grade-3', grade: 3, label: 'Grade 3', shortLabel: 'G3', color: 'green', studentIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7'],
    concept: 'Place value catch-up', phase: 'recovery', activityId: 'g3-place-revision', activityName: 'Place-value card practice', mode: 'catch-up', progress: 64,
    status: 'on-track', teacherDependency: 'low', prerequisiteConfidence: 0.69, recentFailures: 0, canRecover: true, recoveryAttempts: 0, peerSupport: true, selfCheck: true,
    timeWaiting: 6, consequenceOfDelay: 0.38, affectedLearners: 3, elapsedMinutes: 6, remainingMinutes: 9, note: 'Three learners missed place value. Aarav is the peer facilitator.', facilitator: 'Aarav', missedConcepts: ['Place value'], lastUpdated: stamp(6),
  },
]

export const timetable: TimetablePeriod[] = [
  { id: 'mon-1', day: 'Mon', start: '08:00', end: '08:55', subject: 'Mathematics', grades: [1, 2, 3] },
  { id: 'mon-2', day: 'Mon', start: '09:00', end: '09:40', subject: 'Marathi', grades: [1, 2, 3] },
  { id: 'mon-break', day: 'Mon', start: '09:40', end: '10:00', subject: 'Break', grades: [], isBreak: true },
  { id: 'mon-3', day: 'Mon', start: '10:00', end: '10:40', subject: 'EVS', grades: [1, 2, 3] },
  { id: 'tue-1', day: 'Tue', start: '08:00', end: '08:55', subject: 'Mathematics', grades: [1, 2, 3] },
  { id: 'wed-1', day: 'Wed', start: '08:00', end: '08:55', subject: 'Mathematics', grades: [1, 2, 3] },
]

export const initialState: AppState = {
  teacher: { id: 'teacher-1', name: 'Anita Patil', school: 'ZP Primary School', village: 'Bhorwadi, Maharashtra', avatar: 'AP' },
  students,
  groups,
  activities,
  lesson: { id: 'lesson-today', date: now.toISOString(), subject: 'Mathematics', duration: 55, topics: ['Addition', 'Place value', 'Catch-up'], materials: ['Counters', 'Number cards', 'Sticks', 'Notebooks'], availableMaterials: ['Counters', 'Number cards', 'Sticks', 'Notebooks'] },
  timetable,
  language: 'en',
  isOnboarded: true,
  isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
  lastSync: stamp(7),
  sessionStarted: false,
  elapsedMinutes: 0,
  planVersion: 1,
  lastPlanUpdate: undefined,
  events: [{ id: 'event-welcome', type: 'plan-update', message: 'Initial classroom plan ready', createdAt: stamp() }],
}

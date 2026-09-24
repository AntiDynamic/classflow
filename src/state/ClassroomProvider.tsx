import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { initialState } from '../data/demoData'
import { getAttentionRecommendations, getPrimaryRecommendation, buildDynamicPlan } from '../engine/attentionEngine'
import { aiService } from '../services/ai'
import { loadState, saveState } from '../storage/localStore'
import type { AppState, CheckpointResult, GroupStatus, Language, ScreenId } from '../models/types'

type Action =
  | { type: 'start-session' }
  | { type: 'start-attention'; groupId: string }
  | { type: 'finish-explanation' }
  | { type: 'advance-time'; amount: number }
  | { type: 'update-status'; groupId: string; status: GroupStatus; note?: string }
  | { type: 'checkpoint'; groupId: string; result: CheckpointResult }
  | { type: 'set-language'; language: Language }
  | { type: 'set-screen'; screen: ScreenId }
  | { type: 'toggle-online'; isOnline: boolean }
  | { type: 'reset-demo' }
  | { type: 'open-onboarding' }
  | { type: 'complete-onboarding' }

const cloneInitial = (): AppState => JSON.parse(JSON.stringify(initialState)) as AppState

function event(state: AppState, message: string, type: AppState['events'][number]['type'], groupId?: string): AppState['events'][number] {
  return { id: `${Date.now()}-${Math.random()}`, type, groupId, message, createdAt: new Date().toISOString() }
}

function touchGroup(groupId: string, update: Partial<AppState['groups'][number]>, state: AppState) {
  return state.groups.map((group) => group.id === groupId ? { ...group, ...update, lastUpdated: new Date().toISOString() } : group)
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'start-session': {
      const first = getPrimaryRecommendation(state.groups, state.activeGroupId)
      return {
        ...state,
        sessionStarted: true,
        activeGroupId: first.groupId,
        planVersion: state.planVersion + 1,
        lastPlanUpdate: 'Classroom started · Grade 1 begins the new concept',
        events: [event(state, 'Classroom started · Grade 1 begins the new concept', 'lesson-start'), ...state.events].slice(0, 20),
      }
    }
    case 'start-attention': {
      const group = state.groups.find((item) => item.id === action.groupId)
      if (!group) return state
      const groups = touchGroup(action.groupId, { status: 'teaching', mode: 'teacher-led', teacherDependency: 'high' }, state)
      return {
        ...state,
        groups,
        activeGroupId: action.groupId,
        sessionStarted: true,
        planVersion: state.planVersion + 1,
        lastPlanUpdate: `Teacher moved to ${group.label}`,
        events: [event(state, `Teacher moved to ${group.label}`, 'teacher-handoff', group.id), ...state.events].slice(0, 20),
      }
    }
    case 'finish-explanation': {
      if (!state.activeGroupId) return state
      const current = state.groups.find((group) => group.id === state.activeGroupId)
      if (!current) return state
      const groups = touchGroup(current.id, { status: 'on-track', mode: current.id === 'grade-1' ? 'independent' : 'peer-practice', phase: 'practice', teacherDependency: 'medium', progress: Math.min(100, current.progress + 18), timeWaiting: 0 }, state)
      return {
        ...state,
        groups,
        activeGroupId: undefined,
        planVersion: state.planVersion + 1,
        lastPlanUpdate: `${current.label} explanation complete · attention recalculated`,
        events: [event(state, `${current.label} explanation complete · attention recalculated`, 'plan-update', current.id), ...state.events].slice(0, 20),
      }
    }
    case 'advance-time': {
      const groups = state.groups.map((group) => ({
        ...group,
        elapsedMinutes: group.elapsedMinutes + action.amount,
        timeWaiting: group.id === state.activeGroupId ? 0 : Math.min(30, group.timeWaiting + action.amount),
        remainingMinutes: Math.max(0, group.remainingMinutes - action.amount),
        lastUpdated: new Date().toISOString(),
      }))
      return { ...state, groups, elapsedMinutes: Math.min(state.lesson.duration, state.elapsedMinutes + action.amount) }
    }
    case 'update-status': {
      const group = state.groups.find((item) => item.id === action.groupId)
      if (!group) return state
      const status = action.status
      const next = status === 'stuck'
        ? { status, recentFailures: group.recentFailures + 1, recoveryAttempts: group.recoveryAttempts + 1, teacherDependency: 'medium' as const, canRecover: group.canRecover, note: action.note ?? 'Needs a recovery routine before teacher attention.' }
        : status === 'needs-teacher'
          ? { status, recentFailures: group.recentFailures + 1, teacherDependency: 'high' as const, canRecover: false, note: action.note ?? 'Prerequisite gap or repeated failure observed.' }
          : status === 'finished'
            ? { status, progress: 100, mode: 'extension' as const, phase: 'enrichment' as const, teacherDependency: 'low' as const, activityId: 'mixed-math-mela', activityName: 'Math mela extension', note: 'Finished current activity; continue with a familiar extension.' }
            : status === 'slowing'
              ? { status, teacherDependency: 'medium' as const, note: action.note ?? 'Check understanding before the group blocks.' }
              : { status, note: action.note ?? group.note }
      const groups = touchGroup(action.groupId, next, state)
      const summary = status === 'stuck' ? `${group.label} is stuck · recovery path checked` : status === 'finished' ? `${group.label} finished · extension activity ready` : `${group.label} marked ${status.replace('-', ' ')}`
      return {
        ...state,
        groups,
        activeGroupId: status === 'teaching' ? action.groupId : state.activeGroupId,
        planVersion: state.planVersion + 1,
        lastPlanUpdate: summary,
        events: [event(state, summary, 'status-update', action.groupId), ...state.events].slice(0, 20),
      }
    }
    case 'checkpoint': {
      const group = state.groups.find((item) => item.id === action.groupId)
      if (!group) return state
      const update = action.result === 'secure'
        ? { checkpoint: action.result, status: 'on-track' as const, teacherDependency: 'low' as const, phase: 'practice' as const, recentFailures: 0 }
        : action.result === 'needs-practice'
          ? { checkpoint: action.result, status: 'slowing' as const, teacherDependency: 'medium' as const, recentFailures: group.recentFailures + 1, canRecover: true }
          : { checkpoint: action.result, status: 'needs-teacher' as const, teacherDependency: 'high' as const, recentFailures: group.recentFailures + 1, canRecover: false }
      const groups = touchGroup(action.groupId, update, state)
      const label = action.result === 'secure' ? 'secure' : action.result === 'needs-practice' ? 'needs practice' : 'needs teacher'
      const summary = `${group.label} checkpoint: ${label}`
      return { ...state, groups, planVersion: state.planVersion + 1, lastPlanUpdate: summary, events: [event(state, summary, 'checkpoint', group.id), ...state.events].slice(0, 20) }
    }
    case 'set-language': return { ...state, language: action.language }
    case 'set-screen': return { ...state, screen: action.screen }
    case 'toggle-online': return { ...state, isOnline: action.isOnline, lastSync: action.isOnline ? new Date().toISOString() : state.lastSync }
    case 'reset-demo': {
      const fresh = cloneInitial()
      return { ...fresh, language: state.language, isOnline: state.isOnline }
    }
    case 'open-onboarding': return { ...state, isOnboarded: false }
    case 'complete-onboarding': return { ...state, isOnboarded: true }
    default: return state
  }
}

interface ClassroomContextValue {
  state: AppState
  recommendations: ReturnType<typeof getAttentionRecommendations>
  primaryRecommendation: ReturnType<typeof getPrimaryRecommendation>
  planRows: ReturnType<typeof buildDynamicPlan>
  actions: {
    startSession: () => void
    startAttention: (groupId: string) => void
    finishExplanation: () => void
    advanceTime: (amount: number) => void
    updateStatus: (groupId: string, status: GroupStatus, note?: string) => void
    checkpoint: (groupId: string, result: CheckpointResult) => void
    setLanguage: (language: Language) => void
    setScreen: (screen: ScreenId) => void
    toggleOnline: (isOnline: boolean) => void
    resetDemo: () => void
    openOnboarding: () => void
    completeOnboarding: () => void
  }
}

const ClassroomContext = createContext<ClassroomContextValue | undefined>(undefined)

export function ClassroomProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadState() ?? cloneInitial())

  useEffect(() => saveState(state), [state])

  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'toggle-online', isOnline: true })
    const handleOffline = () => dispatch({ type: 'toggle-online', isOnline: false })
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline) }
  }, [])

  const recommendations = useMemo(() => getAttentionRecommendations(state.groups, state.activeGroupId), [state.groups, state.activeGroupId])
  const primaryRecommendation = useMemo(() => getPrimaryRecommendation(state.groups, state.activeGroupId), [state.groups, state.activeGroupId])
  const planRows = useMemo(() => buildDynamicPlan(state.groups, state.elapsedMinutes, state.activeGroupId), [state.groups, state.elapsedMinutes, state.activeGroupId])

  const value: ClassroomContextValue = {
    state, recommendations, primaryRecommendation, planRows,
    actions: {
      startSession: () => dispatch({ type: 'start-session' }),
      startAttention: (groupId) => dispatch({ type: 'start-attention', groupId }),
      finishExplanation: () => dispatch({ type: 'finish-explanation' }),
      advanceTime: (amount) => dispatch({ type: 'advance-time', amount }),
      updateStatus: (groupId, status, note) => dispatch({ type: 'update-status', groupId, status, note }),
      checkpoint: (groupId, result) => dispatch({ type: 'checkpoint', groupId, result }),
      setLanguage: (language) => dispatch({ type: 'set-language', language }),
      setScreen: (screen) => dispatch({ type: 'set-screen', screen }),
      toggleOnline: (isOnline) => dispatch({ type: 'toggle-online', isOnline }),
      resetDemo: () => dispatch({ type: 'reset-demo' }),
      openOnboarding: () => dispatch({ type: 'open-onboarding' }),
      completeOnboarding: () => dispatch({ type: 'complete-onboarding' }),
    },
  }

  return <ClassroomContext.Provider value={value}>{children}</ClassroomContext.Provider>
}

export function useClassroom() {
  const context = useContext(ClassroomContext)
  if (!context) throw new Error('useClassroom must be used inside ClassroomProvider')
  return context
}

export { aiService }

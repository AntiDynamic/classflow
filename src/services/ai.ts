import { getAttentionRecommendations, getPrimaryRecommendation } from '../engine/attentionEngine'
import type { AttentionRecommendation, GroupState } from '../models/types'

export interface TeacherObservation {
  groupId: string
  status: GroupState['status']
  note?: string
}

export interface AIReasoningService {
  analyzeClassroomState(groups: GroupState[], activeGroupId?: string): Promise<AttentionRecommendation[]>
  interpretTeacherUpdate(observation: TeacherObservation): Promise<Partial<GroupState>>
  generateLessonPlan(groups: GroupState[], duration: number): Promise<string>
  recalculateAttention(groups: GroupState[], activeGroupId?: string): Promise<AttentionRecommendation>
  analyzeConflict(groups: GroupState[]): Promise<string>
  adaptActivity(group: GroupState): Promise<string>
}

export class LocalAIService implements AIReasoningService {
  async analyzeClassroomState(groups: GroupState[], activeGroupId?: string) {
    return getAttentionRecommendations(groups, activeGroupId)
  }

  async interpretTeacherUpdate(observation: TeacherObservation) {
    const status = observation.status
    return {
      status,
      note: observation.note,
      recentFailures: status === 'stuck' || status === 'needs-teacher' ? 1 : 0,
      teacherDependency: status === 'needs-teacher' ? 'high' as const : status === 'stuck' ? 'medium' as const : undefined,
    }
  }

  async generateLessonPlan(groups: GroupState[], duration: number) {
    const primary = getPrimaryRecommendation(groups)
    return `${duration}-minute dynamic plan: begin with ${groups.find((group) => group.id === primary.groupId)?.label ?? 'the priority group'}, then reassess.`
  }

  async recalculateAttention(groups: GroupState[], activeGroupId?: string) {
    return getPrimaryRecommendation(groups, activeGroupId)
  }

  async analyzeConflict(groups: GroupState[]) {
    const blocked = groups.filter((group) => group.status === 'stuck' || group.status === 'needs-teacher').length
    return blocked > 1 ? 'Two groups are asking for attention; finish the current explanation, then take the least recoverable group.' : 'The room has one clear next intervention.'
  }

  async adaptActivity(group: GroupState) {
    return group.canRecover ? `Try the recovery path for ${group.concept} before calling the teacher.` : `Keep ${group.label} with the teacher for ${group.concept}.`
  }
}

export class CloudAIService extends LocalAIService {
  readonly endpoint = import.meta.env.VITE_CLOUD_AI_ENDPOINT as string | undefined
  // The adapter keeps the cloud boundary ready. Local rules remain the safe fallback.
}

export const aiService: AIReasoningService = new LocalAIService()

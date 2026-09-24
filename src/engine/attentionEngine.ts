import type { AttentionRecommendation, GroupState, PlanRow } from '../models/types'

export interface DecisionWeights {
  dependency: number
  urgency: number
  prerequisiteRisk: number
  repeatedFailure: number
  consequenceOfDelay: number
  waitTime: number
  affectedLearners: number
  recoverability: number
  peerSupport: number
  selfCheck: number
}

export const defaultWeights: DecisionWeights = {
  dependency: 24,
  urgency: 20,
  prerequisiteRisk: 18,
  repeatedFailure: 15,
  consequenceOfDelay: 12,
  waitTime: 9,
  affectedLearners: 7,
  recoverability: 14,
  peerSupport: 6,
  selfCheck: 4,
}

const dependencyValue = { low: 0.28, medium: 0.62, high: 1 }

export interface ScoredGroup {
  group: GroupState
  score: number
  blocked: boolean
  recoverable: boolean
}

export function scoreGroup(group: GroupState, weights = defaultWeights): ScoredGroup {
  const prerequisiteRisk = 1 - group.prerequisiteConfidence
  const urgency = group.status === 'needs-teacher' ? 1 : group.status === 'stuck' ? 0.86 : group.status === 'slowing' ? 0.62 : group.phase === 'introduction' ? 0.74 : group.status === 'finished' ? 0.05 : 0.28
  const repeatedFailure = Math.min(1, group.recentFailures / 3)
  const waitTime = Math.min(1, group.timeWaiting / 18)
  const affectedLearners = Math.min(1, group.affectedLearners / 8)
  const recoverability = group.canRecover ? Math.max(0.1, 1 - group.recoveryAttempts * 0.25) : 1
  const peerSupport = group.peerSupport ? 1 : 0
  const selfCheck = group.selfCheck ? 1 : 0

  let score =
    dependencyValue[group.teacherDependency] * weights.dependency +
    urgency * weights.urgency +
    prerequisiteRisk * weights.prerequisiteRisk +
    repeatedFailure * weights.repeatedFailure +
    group.consequenceOfDelay * weights.consequenceOfDelay +
    waitTime * weights.waitTime +
    affectedLearners * weights.affectedLearners -
    (group.canRecover ? recoverability * weights.recoverability : 0) -
    peerSupport * weights.peerSupport -
    selfCheck * weights.selfCheck

  if (group.status === 'finished') score -= 20
  if (group.mode === 'extension') score -= 18
  if (group.phase === 'introduction') score += 8

  const blocked = group.status === 'stuck' || group.status === 'needs-teacher'
  const recoverable = blocked && group.canRecover && group.recoveryAttempts < 2 && group.prerequisiteConfidence >= 0.55
  return { group, score, blocked, recoverable }
}

function reasonFor(group: GroupState, scored: ScoredGroup): string {
  if (group.status === 'needs-teacher') return 'Checkpoint needs teacher'
  if (group.phase === 'introduction') return 'New concept · high dependency'
  if (group.status === 'stuck' && !scored.recoverable) return 'Stuck · recovery path used'
  if (group.status === 'stuck') return 'Stuck · recovery still possible'
  if (group.status === 'slowing') return 'Slowing · check before it blocks'
  if (group.status === 'finished') return 'Finished · move to extension'
  return group.teacherDependency === 'high' ? 'High dependency · keep momentum' : 'Continue current activity'
}

export function getAttentionRecommendations(groups: GroupState[], activeGroupId?: string): AttentionRecommendation[] {
  const scored = groups.map((group) => scoreGroup(group)).sort((a, b) => b.score - a.score)
  return scored.map((item, index) => ({
    groupId: item.group.id,
    score: Math.round(item.score),
    label: index === 0 ? 'Next attention' : index === 1 ? 'After that' : 'Continue',
    reason: reasonFor(item.group, item),
    secondaryReason: item.recoverable ? 'Can recover with self-check first' : undefined,
    deferToActive: Boolean(activeGroupId && activeGroupId !== item.group.id && index === 0 && groups.find((group) => group.id === activeGroupId)?.status === 'teaching'),
    action: item.group.status === 'finished' ? 'Give extension activity' : item.group.status === 'stuck' && item.recoverable ? 'Run recovery routine' : 'Move to group',
  }))
}

export function getPrimaryRecommendation(groups: GroupState[], activeGroupId?: string): AttentionRecommendation {
  const recommendations = getAttentionRecommendations(groups, activeGroupId)
  const active = activeGroupId ? groups.find((group) => group.id === activeGroupId) : undefined
  if (active?.status === 'teaching') {
    const activeRecommendation = recommendations.find((recommendation) => recommendation.groupId === active.id)
    if (activeRecommendation) return { ...activeRecommendation, label: 'Current focus', action: 'Continue explanation' }
  }
  return recommendations[0]
}

export function getNextHandoff(groups: GroupState[], activeGroupId?: string): AttentionRecommendation | undefined {
  const recs = getAttentionRecommendations(groups, activeGroupId)
  return recs.find((recommendation) => recommendation.groupId !== activeGroupId && recommendation.action !== 'Give extension activity')
}

export function buildDynamicPlan(groups: GroupState[], elapsedMinutes: number, activeGroupId?: string): PlanRow[] {
  const primary = getPrimaryRecommendation(groups, activeGroupId)
  const next = getNextHandoff(groups, activeGroupId)
  const rows: PlanRow[] = [
    { window: `0–${Math.min(7, Math.max(5, elapsedMinutes || 7))} min`, title: 'Start all groups', detail: 'Set out cards, counters, and notebooks', kind: 'continue' },
    { window: `${Math.max(7, elapsedMinutes)}–${Math.max(22, elapsedMinutes + 15)} min`, title: `Teacher → ${groups.find((group) => group.id === primary.groupId)?.label ?? 'priority group'}`, detail: primary.reason, kind: 'teacher' },
    { window: `${Math.max(7, elapsedMinutes)}–${Math.max(22, elapsedMinutes + 15)} min`, title: 'Other groups continue', detail: groups.filter((group) => group.id !== primary.groupId).map((group) => `${group.label}: ${group.activityName}`).join(' · '), kind: 'continue' },
    { window: `${Math.max(22, elapsedMinutes + 15)}–${Math.max(30, elapsedMinutes + 23)} min`, title: next ? `Reassess → ${groups.find((group) => group.id === next.groupId)?.label ?? 'next group'}` : 'Reassess the room', detail: 'Use one-tap group updates before the next handoff', kind: 'checkpoint' },
    { window: `${Math.max(45, elapsedMinutes + 38)}–55 min`, title: 'Lightweight checkpoints', detail: 'Secure · Needs practice · Needs teacher', kind: 'checkpoint' },
  ]
  return rows
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type Progress = { completed: string[]; scores: Record<string, number>; stars: number; lastVisited?: string }
type LearnLabContextValue = { progress: Progress; markVisited: (id: string) => void; completeLesson: (id: string, score: number) => void; resetProgress: () => void }
const emptyProgress: Progress = { completed: [], scores: {}, stars: 0 }
const LearnLabContext = createContext<LearnLabContextValue | null>(null)

export function LearnLabProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => { try { return JSON.parse(localStorage.getItem('learnlab-progress') || 'null') || emptyProgress } catch { return emptyProgress } })
  useEffect(() => { localStorage.setItem('learnlab-progress', JSON.stringify(progress)) }, [progress])
  const value = useMemo(() => ({
    progress,
    markVisited: (id: string) => setProgress((prev) => prev.lastVisited === id ? prev : ({ ...prev, lastVisited: id })),
    completeLesson: (id: string, score: number) => setProgress((prev) => { const fresh = !prev.completed.includes(id); return { ...prev, completed: fresh ? [...prev.completed, id] : prev.completed, scores: { ...prev.scores, [id]: Math.max(score, prev.scores[id] || 0) }, stars: prev.stars + (fresh ? Math.max(1, Math.min(3, score)) : 0), lastVisited: id } }),
    resetProgress: () => setProgress(emptyProgress),
  }), [progress])
  return <LearnLabContext.Provider value={value}>{children}</LearnLabContext.Provider>
}
export const useLearnLab = () => { const context = useContext(LearnLabContext); if (!context) throw new Error('useLearnLab must be used inside LearnLabProvider'); return context }

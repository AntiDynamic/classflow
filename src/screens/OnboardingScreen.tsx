import { ArrowRight, Check, ChevronLeft, ClipboardList, Globe2, Layers3, Sparkles, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { languages } from '../i18n/translations'
import { useClassroom } from '../state/ClassroomProvider'
import type { Language } from '../models/types'

const steps = [
  { eyebrow: 'STEP 1 OF 5', title: 'Welcome, teacher', body: 'ClassFlow helps you decide where your attention is most useful next.', icon: Sparkles },
  { eyebrow: 'STEP 2 OF 5', title: 'Your classroom', body: 'Start with the groups you already manage. Children keep working with physical materials.', icon: UsersRound },
  { eyebrow: 'STEP 3 OF 5', title: 'Your school rhythm', body: 'A simple timetable helps us protect teaching time and plan around breaks.', icon: ClipboardList },
  { eyebrow: 'STEP 4 OF 5', title: 'Your language', body: 'Choose words that feel natural during a busy lesson. You can change this later.', icon: Globe2 },
  { eyebrow: 'STEP 5 OF 5', title: 'Ready for today', body: 'Your demo classroom is loaded. The plan will adapt when the room changes.', icon: Layers3 },
]

export function OnboardingScreen() {
  const { state, actions } = useClassroom()
  const [step, setStep] = useState(0)
  const current = steps[step]
  const Icon = current.icon
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(state.language)
  const next = () => { if (step === steps.length - 1) { actions.setLanguage(selectedLanguage); actions.completeOnboarding() } else setStep((value) => value + 1) }
  return <main className="onboarding-shell"><div className="onboarding-top"><div className="brand-mark"><span className="brand-glyph">↗</span><span>ClassFlow</span></div><span className="onboarding-step">{current.eyebrow}</span></div><div className="onboarding-progress"><div style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div><section className="onboarding-content"><div className="onboarding-icon"><Icon size={27} /></div><p className="eyebrow">{current.eyebrow}</p><h1>{current.title}</h1><p className="onboarding-body">{current.body}</p>{step === 1 && <div className="onboarding-info-card"><div><strong>3 groups ready</strong><span>Grade 1 · Grade 2 · Grade 3</span></div><Check size={17} /></div>}{step === 2 && <div className="onboarding-info-card"><div><strong>Mathematics · 55 minutes</strong><span>Mon–Fri rhythm · breaks included</span></div><Check size={17} /></div>}{step === 3 && <div className="onboarding-languages">{languages.map((language) => <button key={language.id} className={selectedLanguage === language.id ? 'selected-language' : ''} onClick={() => setSelectedLanguage(language.id)}><span>{language.native}</span><small>{language.label}</small>{selectedLanguage === language.id && <Check size={15} />}</button>)}</div>}{step === 4 && <div className="ready-card"><span className="ready-pulse" /><div><strong>Ready for today</strong><span>Offline plan · local updates · teacher override</span></div></div>}</section><div className="onboarding-footer">{step > 0 ? <button className="text-button" onClick={() => setStep((value) => value - 1)}><ChevronLeft size={16} /> Back</button> : <span /> }<button className="primary-button" onClick={next}>{step === steps.length - 1 ? 'Open classroom' : 'Continue'}<ArrowRight size={17} /></button></div></main>
}

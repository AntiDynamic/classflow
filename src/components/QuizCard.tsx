import { motion } from 'framer-motion'
import { Check, RotateCcw, Star, X } from 'lucide-react'
import { useState } from 'react'
import { useLearnLab } from '../state/LearnLabProvider'

type Question = { prompt: string; options: string[]; answer: number; hint: string }
export function QuizCard({ lessonId, questions }: { lessonId: string; questions: Question[] }) {
  const { completeLesson } = useLearnLab(); const [index, setIndex] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [correct, setCorrect] = useState(0); const [finished, setFinished] = useState(false)
  const question = questions[index]
  const choose = (option: number) => { if (selected !== null) return; setSelected(option); if (option === question.answer) setCorrect((value) => value + 1) }
  const next = () => { if (index === questions.length - 1) { const score = correct + (selected === question.answer ? 1 : 0); completeLesson(lessonId, score); setFinished(true) } else { setIndex((value) => value + 1); setSelected(null) } }
  if (finished) return <motion.div className="quiz-finished" initial={{ scale: .96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><div className="celebrate-stars"><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /></div><p className="eyebrow">Adventure complete</p><h3>You made some smart moves.</h3><p>You earned {Math.max(1, Math.min(3, correct + (selected === question.answer ? 1 : 0)))} bright stars for this adventure.</p><button className="ghost-button" onClick={() => { setIndex(0); setSelected(null); setCorrect(0); setFinished(false) }}><RotateCcw size={15} /> Play the quiz again</button></motion.div>
  return <section className="quiz-card"><div className="quiz-top"><div><span className="eyebrow">Try it yourself</span><h2>Quick quest <span>{index + 1}/{questions.length}</span></h2></div><div className="quiz-dots">{questions.map((_, i) => <span key={i} className={i < index ? 'visited' : i === index ? 'current' : ''} />)}</div></div><h3 className="quiz-prompt">{question.prompt}</h3><div className="quiz-options">{question.options.map((option, i) => <button key={option} className={selected === i ? i === question.answer ? 'option correct' : 'option wrong' : 'option'} onClick={() => choose(i)}><span>{String.fromCharCode(65 + i)}</span>{option}{selected === i && (i === question.answer ? <Check size={17} /> : <X size={17} />)}</button>)}</div>{selected !== null && <div className={`quiz-feedback ${selected === question.answer ? 'feedback-good' : 'feedback-soft'}`}><span>{selected === question.answer ? 'Nice thinking!' : 'Almost!'}</span><small>{selected === question.answer ? 'That pattern fits the picture.' : question.hint}</small><button onClick={next}>{index === questions.length - 1 ? 'Finish adventure' : 'Next question'} <span>→</span></button></div>}</section>
}
export type { Question }

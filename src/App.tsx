import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { SubjectPage } from './pages/SubjectPage'
import { LessonPage } from './pages/LessonPage'
import { SubjectsPage } from './pages/SubjectsPage'

export default function App() {
  return <BrowserRouter><Routes><Route element={<AppShell />}><Route path="/" element={<HomePage />} /><Route path="/subjects" element={<SubjectsPage />} /><Route path="/subject/:subject" element={<SubjectPage />} /><Route path="/lesson/:lessonId" element={<LessonPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></BrowserRouter>
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LearnLabProvider } from './state/LearnLabProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(<StrictMode><LearnLabProvider><App /></LearnLabProvider></StrictMode>)

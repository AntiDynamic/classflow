import { BookOpen, CalendarDays, Home, MoreHorizontal, UsersRound } from 'lucide-react'
import type { Language, ScreenId } from '../models/types'
import { getCopy } from '../i18n/translations'

const items: { id: ScreenId; icon: typeof Home; label: 'today' | 'classroom' | 'plan' | 'catchUp' | 'more' }[] = [
  { id: 'classroom', icon: Home, label: 'today' },
  { id: 'classroom', icon: UsersRound, label: 'classroom' },
  { id: 'plan', icon: CalendarDays, label: 'plan' },
  { id: 'catchup', icon: BookOpen, label: 'catchUp' },
  { id: 'more', icon: MoreHorizontal, label: 'more' },
]

export function BottomNav({ active, language, onNavigate }: { active: ScreenId; language: Language; onNavigate: (screen: ScreenId) => void }) {
  return <nav className="bottom-nav" aria-label="Primary navigation">
    {items.map(({ id, icon: Icon, label }, index) => {
      const activeItem = active === id && (index !== 0 || active === 'classroom')
      return <button key={`${id}-${label}`} className={`nav-item ${activeItem ? 'nav-item-active' : ''}`} onClick={() => onNavigate(id)}>
        <Icon size={19} strokeWidth={activeItem ? 2.4 : 1.8} />
        <span>{getCopy(language, label)}</span>
      </button>
    })}
  </nav>
}

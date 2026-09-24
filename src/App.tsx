import { useEffect, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { GroupDetailSheet } from './components/GroupDetailSheet'
import { OfflinePill } from './components/OfflinePill'
import { useClassroom } from './state/ClassroomProvider'
import { ClassroomScreen } from './screens/ClassroomScreen'
import { PlanScreen } from './screens/PlanScreen'
import { CatchUpScreen } from './screens/CatchUpScreen'
import { MoreScreen } from './screens/MoreScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import type { GroupState, ScreenId } from './models/types'

function App() {
  const { state, actions } = useClassroom()
  const [selectedGroup, setSelectedGroup] = useState<GroupState | undefined>()
  const activeScreen = state.screen ?? 'classroom'

  useEffect(() => { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined) }, [])

  if (!state.isOnboarded) return <OnboardingScreen />

  const navigate = (screen: ScreenId) => { setSelectedGroup(undefined); actions.setScreen(screen) }
  const openGroup = (group: GroupState) => setSelectedGroup(group)
  const currentSelectedGroup = selectedGroup ? state.groups.find((group) => group.id === selectedGroup.id) : undefined

  return <div className="app-frame"><div className="phone-shell"><header className="app-topbar"><div className="brand-mark"><span className="brand-glyph">↗</span><span>ClassFlow</span></div><OfflinePill isOnline={state.isOnline} language={state.language} lastSync={state.lastSync} /></header><main className="app-content">{activeScreen === 'classroom' && <ClassroomScreen language={state.language} onOpenGroup={openGroup} onViewPlan={() => navigate('plan')} />}{activeScreen === 'plan' && <PlanScreen language={state.language} onBackToClassroom={() => navigate('classroom')} />}{activeScreen === 'catchup' && <CatchUpScreen language={state.language} onOpenGroup={(groupId) => { const group = state.groups.find((item) => item.id === groupId); if (group) openGroup(group) }} />}{activeScreen === 'more' && <MoreScreen language={state.language} />}</main><BottomNav active={activeScreen} language={state.language} onNavigate={navigate} />{currentSelectedGroup && <GroupDetailSheet group={currentSelectedGroup} students={state.students} language={state.language} onClose={() => setSelectedGroup(undefined)} />}</div></div>
}

export default App

import { CloudOff, RefreshCw } from 'lucide-react'
import type { Language } from '../models/types'
import { getCopy } from '../i18n/translations'

export function OfflinePill({ isOnline, language, lastSync }: { isOnline: boolean; language: Language; lastSync: string }) {
  const time = new Date(lastSync).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return <div className={`offline-pill ${isOnline ? 'online' : 'offline'}`}><span className="offline-status-icon">{isOnline ? <RefreshCw size={12} /> : <CloudOff size={13} />}</span><span>{isOnline ? getCopy(language, 'synced') : getCopy(language, 'workingOffline')}</span><small>· {time}</small></div>
}

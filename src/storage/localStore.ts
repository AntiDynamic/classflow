import type { AppState } from '../models/types'

const STORAGE_KEY = 'classflow-state-v1'

export function loadState(): AppState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as AppState : undefined
  } catch {
    return undefined
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // The classroom can continue even if storage is unavailable.
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY)
}

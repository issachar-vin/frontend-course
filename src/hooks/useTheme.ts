import { useCallback, useSyncExternalStore } from 'react'
import { applyTheme, DEFAULT_THEME_ID, themes } from '../lib/themes'

const STORAGE_KEY = 'fe-course.theme.v1'

function read(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID
  } catch {
    return DEFAULT_THEME_ID
  }
}

let themeId = read()
const listeners = new Set<() => void>()

// Apply the persisted theme as soon as this module loads, before first paint.
applyTheme(themeId)

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setTheme(id: string) {
  if (id === themeId) return
  themeId = id
  applyTheme(id)
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // localStorage unavailable; theme stays for the session only.
  }
  for (const l of listeners) l()
}

export function useTheme() {
  const current = useSyncExternalStore(
    subscribe,
    () => themeId,
    () => DEFAULT_THEME_ID,
  )
  const select = useCallback((id: string) => setTheme(id), [])
  return { themeId: current, setTheme: select, themes }
}

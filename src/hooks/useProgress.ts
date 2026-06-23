import { useCallback, useSyncExternalStore } from 'react'

export type AssignmentStatus = 'not_started' | 'attempted' | 'passed'

interface ProgressState {
  /** key: `${trackSlug}/${assignmentSlug}` -> status */
  status: Record<string, AssignmentStatus>
  /** key -> furthest stage index the student has reached (for resume) */
  stage: Record<string, number>
}

const STORAGE_KEY = 'fe-course.progress.v1'

function read(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { status: {}, stage: {} }
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return { status: parsed.status ?? {}, stage: parsed.stage ?? {} }
  } catch {
    return { status: {}, stage: {} }
  }
}

let state: ProgressState = read()
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private mode); progress stays in-memory only.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

export function key(trackSlug: string, assignmentSlug: string) {
  return `${trackSlug}/${assignmentSlug}`
}

export function setStatus(
  trackSlug: string,
  assignmentSlug: string,
  status: AssignmentStatus,
) {
  const k = key(trackSlug, assignmentSlug)
  const current = state.status[k]
  // Never downgrade a passed assignment to attempted on revisit.
  if (current === 'passed' && status === 'attempted') return
  if (current === status) return
  state = { ...state, status: { ...state.status, [k]: status } }
  persist()
  emit()
}

export function setStage(
  trackSlug: string,
  assignmentSlug: string,
  stageIndex: number,
) {
  const k = key(trackSlug, assignmentSlug)
  // Only ever advance the recorded furthest stage.
  if ((state.stage[k] ?? 0) >= stageIndex) return
  state = { ...state, stage: { ...state.stage, [k]: stageIndex } }
  persist()
  emit()
}

export function useProgress() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)

  const statusOf = useCallback(
    (trackSlug: string, assignmentSlug: string): AssignmentStatus =>
      snapshot.status[key(trackSlug, assignmentSlug)] ?? 'not_started',
    [snapshot],
  )

  const stageOf = useCallback(
    (trackSlug: string, assignmentSlug: string): number =>
      snapshot.stage[key(trackSlug, assignmentSlug)] ?? 0,
    [snapshot],
  )

  return { statusOf, stageOf, setStatus, setStage }
}

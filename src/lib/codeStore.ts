import type { FileMap } from '../types'

/**
 * Non-reactive persistence for the student's in-progress editor files, keyed by
 * `${track}/${assignment}/${stageIndex}`. Kept separate from the progress store
 * on purpose: it is written on every keystroke and must never trigger a React
 * re-render (that would reset the live Sandpack instance).
 */
const STORAGE_KEY = 'fe-course.code.v1'

type CodeBlob = Record<string, FileMap>

function readAll(): CodeBlob {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as CodeBlob
  } catch {
    return {}
  }
}

function codeKey(trackSlug: string, assignmentSlug: string, stageIndex: number) {
  return `${trackSlug}/${assignmentSlug}/${stageIndex}`
}

export function loadCode(
  trackSlug: string,
  assignmentSlug: string,
  stageIndex: number,
): FileMap | undefined {
  return readAll()[codeKey(trackSlug, assignmentSlug, stageIndex)]
}

export function saveCode(
  trackSlug: string,
  assignmentSlug: string,
  stageIndex: number,
  files: FileMap,
) {
  try {
    const all = readAll()
    all[codeKey(trackSlug, assignmentSlug, stageIndex)] = files
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // localStorage unavailable; in-session carry-forward still works via refs.
  }
}

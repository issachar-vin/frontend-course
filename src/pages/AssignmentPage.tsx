import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { SandpackFiles } from '@codesandbox/sandpack-react'
import { getTrack } from '../content/tracks'
import type { Assignment, FileMap, Track } from '../types'
import { setStatus, useProgress } from '../hooks/useProgress'
import { CodePlayground } from '../components/CodePlayground'
import { Markdown } from '../components/Markdown'
import { DifficultyBadge } from '../components/ui'
import { NotFound } from './NotFound'

export function AssignmentPage() {
  const { trackSlug, assignmentSlug } = useParams()
  const track = getTrack(trackSlug ?? '')
  const index = track?.assignments.findIndex((a) => a.slug === assignmentSlug)

  if (!track || index === undefined || index < 0) return <NotFound />
  const assignment = track.assignments[index]

  // Remount on assignment change so all local state (hints, mode) resets.
  return (
    <AssignmentView
      key={`${track.slug}/${assignment.slug}`}
      track={track}
      assignment={assignment}
      index={index}
    />
  )
}

function buildFiles(code: FileMap, tests: FileMap): SandpackFiles {
  const files: SandpackFiles = { ...code }
  for (const [path, content] of Object.entries(tests)) {
    files[path] = { code: content, hidden: true }
  }
  return files
}

function AssignmentView({
  track,
  assignment,
  index,
}: {
  track: Track
  assignment: Assignment
  index: number
}) {
  const { statusOf } = useProgress()
  const status = statusOf(track.slug, assignment.slug)

  const [mode, setMode] = useState<'starter' | 'solution'>('starter')
  const [resetNonce, setResetNonce] = useState(0)
  const [hintsShown, setHintsShown] = useState(0)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  const [justPassed, setJustPassed] = useState(false)

  const prev = index > 0 ? track.assignments[index - 1] : undefined
  const next =
    index < track.assignments.length - 1
      ? track.assignments[index + 1]
      : undefined

  const code = mode === 'solution' ? assignment.solution : assignment.starter
  const files = useMemo(
    () => buildFiles(code, assignment.tests),
    [code, assignment.tests],
  )
  const visibleFiles = Object.keys(code)
  const activeFile = visibleFiles[0]
  const instanceKey = `${assignment.slug}:${mode}:${resetNonce}`

  function handleTestsComplete(passed: boolean) {
    if (mode === 'solution') return
    setStatus(track.slug, assignment.slug, passed ? 'passed' : 'attempted')
    setJustPassed(passed)
  }

  function loadSolution() {
    setMode('solution')
    setJustPassed(false)
  }

  function resetStarter() {
    setMode('starter')
    setResetNonce((n) => n + 1)
    setJustPassed(false)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border bg-surface px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Link to={`/track/${track.slug}`} className="hover:text-ink">
                {track.icon} {track.title}
              </Link>
              <span>/</span>
              <span>
                Assignment {index + 1} of {track.assignments.length}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="truncate text-xl font-bold tracking-tight">
                {assignment.title}
              </h1>
              <DifficultyBadge difficulty={assignment.difficulty} />
              {status === 'passed' && (
                <span className="text-sm font-medium text-success">
                  ✓ Completed
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {prev && (
              <Link
                to={`/track/${track.slug}/${prev.slug}`}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
              >
                ← Prev
              </Link>
            )}
            {next && (
              <Link
                to={`/track/${track.slug}/${next.slug}`}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-[380px_1fr]">
        {/* Brief panel */}
        <div className="overflow-y-auto border-r border-border px-6 py-6">
          <Markdown>{assignment.brief}</Markdown>

          <section className="mt-8">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Learning objectives
            </h3>
            <ul className="space-y-1.5">
              {assignment.learningObjectives.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-muted">
                  <span className="text-brand">›</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Hints
            </h3>
            <div className="space-y-2">
              {assignment.hints.slice(0, hintsShown).map((h, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted"
                >
                  <Markdown>{h}</Markdown>
                </div>
              ))}
              {hintsShown < assignment.hints.length && (
                <button
                  onClick={() => setHintsShown((n) => n + 1)}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
                >
                  Show hint ({hintsShown + 1}/{assignment.hints.length})
                </button>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Solution
            </h3>
            {!solutionRevealed ? (
              <button
                onClick={() => setSolutionRevealed(true)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
              >
                Reveal reference solution
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={loadSolution}
                  className="w-full rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-canvas hover:bg-brand-strong"
                >
                  Load solution into the editor →
                </button>
                {Object.entries(assignment.solution).map(([path, content]) => (
                  <details key={path} className="rounded-lg border border-border">
                    <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
                      {path}
                    </summary>
                    <pre className="overflow-x-auto border-t border-border bg-canvas px-3 py-2 text-xs">
                      <code>{content}</code>
                    </pre>
                  </details>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Playground panel */}
        <div className="flex flex-col overflow-y-auto px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted">
              {mode === 'solution' ? (
                <span className="font-medium text-warn">
                  Viewing reference solution
                </span>
              ) : (
                <span>
                  Edit the code, then open the{' '}
                  <span className="font-medium text-brand">Tests</span> tab and
                  run them.
                </span>
              )}
            </div>
            <button
              onClick={resetStarter}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
            >
              Reset to starter
            </button>
          </div>

          {justPassed && mode === 'starter' && (
            <div className="mb-3 rounded-lg border border-success/40 bg-success/10 px-4 py-2 text-sm font-medium text-success">
              ✓ All tests passed — assignment complete!{' '}
              {next && (
                <Link
                  to={`/track/${track.slug}/${next.slug}`}
                  className="underline"
                >
                  Continue to “{next.title}” →
                </Link>
              )}
            </div>
          )}

          <CodePlayground
            assignment={assignment}
            files={files}
            visibleFiles={visibleFiles}
            activeFile={activeFile}
            instanceKey={instanceKey}
            onTestsComplete={handleTestsComplete}
          />
        </div>
      </div>
    </div>
  )
}

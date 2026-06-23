import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  CircleCheckBig,
  GripVertical,
} from 'lucide-react'
import type { SandpackFiles } from '@codesandbox/sandpack-react'
import { getTrack } from '../content/tracks'
import { getStages, type Assignment, type FileMap, type Track } from '../types'
import { setStatus, setStage, useProgress } from '../hooks/useProgress'
import { usePersistentState } from '../hooks/usePersistentState'
import { loadCode, saveCode } from '../lib/codeStore'
import { CodePlayground } from '../components/CodePlayground'
import { Markdown } from '../components/Markdown'
import { DifficultyBadge } from '../components/ui'
import { TrackIcon } from '../lib/icons'
import { NotFound } from './NotFound'

const BRIEF_MIN = 280
const BRIEF_MAX = 680

export function AssignmentPage() {
  const { trackSlug, assignmentSlug } = useParams()
  const track = getTrack(trackSlug ?? '')
  const index = track?.assignments.findIndex((a) => a.slug === assignmentSlug)

  if (!track || index === undefined || index < 0) return <NotFound />
  const assignment = track.assignments[index]

  // Remount on assignment change so all local state (stage, hints, mode) resets.
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
  const { statusOf, stageOf } = useProgress()
  const status = statusOf(track.slug, assignment.slug)

  const stages = useMemo(() => getStages(assignment), [assignment])
  const multi = stages.length > 1
  const reached = stageOf(track.slug, assignment.slug)

  const [stageIndex, setStageIndex] = useState(() =>
    Math.min(reached, stages.length - 1),
  )
  const [mode, setMode] = useState<'work' | 'solution'>('work')
  const [resetNonce, setResetNonce] = useState(0)
  const [hintsShown, setHintsShown] = useState(0)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  const [justPassed, setJustPassed] = useState(false)
  const [briefWidth, setBriefWidth] = usePersistentState(
    'fe-course.ui.brief-width',
    380,
  )
  const [baseFiles, setBaseFiles] = useState<FileMap>(
    () =>
      loadCode(track.slug, assignment.slug, stageIndex) ??
      stages[stageIndex].starter,
  )

  // Latest editor contents, captured for carry-forward between stages.
  const liveFilesRef = useRef<FileMap>(baseFiles)

  const stage = stages[stageIndex]
  const isLastStage = stageIndex === stages.length - 1

  const prev = index > 0 ? track.assignments[index - 1] : undefined
  const next =
    index < track.assignments.length - 1
      ? track.assignments[index + 1]
      : undefined

  const code = mode === 'solution' ? stage.solution : baseFiles
  const files = useMemo(
    () => buildFiles(code, stage.tests),
    [code, stage.tests],
  )
  const visibleFiles = useMemo(() => Object.keys(code), [code])
  const activeFile = visibleFiles[0]
  const instanceKey = `${assignment.slug}:${stageIndex}:${mode}:${resetNonce}`

  const onFilesChange = useCallback(
    (next: FileMap) => {
      liveFilesRef.current = next
      saveCode(track.slug, assignment.slug, stageIndex, next)
    },
    [track.slug, assignment.slug, stageIndex],
  )

  function handleTestsComplete(passed: boolean) {
    if (mode === 'solution') return
    setJustPassed(passed)
    if (passed) {
      setStage(track.slug, assignment.slug, stageIndex + 1)
      setStatus(
        track.slug,
        assignment.slug,
        isLastStage ? 'passed' : 'attempted',
      )
    } else {
      setStatus(track.slug, assignment.slug, 'attempted')
    }
  }

  function goToStage(nextIndex: number, files: FileMap) {
    setStageIndex(nextIndex)
    setBaseFiles(files)
    liveFilesRef.current = files
    setMode('work')
    setHintsShown(0)
    setSolutionRevealed(false)
    setJustPassed(false)
  }

  function advanceStage() {
    const nextIndex = stageIndex + 1
    const carried =
      liveFilesRef.current ?? stages[nextIndex].starter
    goToStage(nextIndex, carried)
  }

  function loadSolution() {
    setMode('solution')
    setJustPassed(false)
  }

  function backToMyCode() {
    setBaseFiles(liveFilesRef.current)
    setMode('work')
  }

  function resetStage() {
    setMode('work')
    setBaseFiles(stage.starter)
    liveFilesRef.current = stage.starter
    setResetNonce((n) => n + 1)
    setJustPassed(false)
  }

  function startBriefResize(e: React.MouseEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startW = briefWidth
    const onMove = (ev: MouseEvent) => {
      const w = startW + (ev.clientX - startX)
      setBriefWidth(Math.min(BRIEF_MAX, Math.max(BRIEF_MIN, w)))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.userSelect = ''
    }
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border bg-surface px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Link
                to={`/track/${track.slug}`}
                className="inline-flex items-center gap-1 hover:text-ink"
              >
                <TrackIcon slug={track.slug} className="h-3.5 w-3.5" />
                {track.title}
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
                <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
                  <Check className="h-4 w-4" /> Completed
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {prev && (
              <Link
                to={`/track/${track.slug}/${prev.slug}`}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Link>
            )}
            {next && (
              <Link
                to={`/track/${track.slug}/${next.slug}`}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <div
        className="flex flex-1 flex-col overflow-hidden lg:flex-row"
        style={{ ['--brief-w' as string]: `${briefWidth}px` }}
      >
        {/* Brief panel */}
        <div className="max-h-[42vh] w-full shrink-0 overflow-y-auto border-b border-border px-6 py-6 lg:max-h-none lg:min-h-0 lg:w-[var(--brief-w)] lg:border-b-0">
          {multi && (
            <StageTracker
              stages={stages}
              stageIndex={stageIndex}
              reached={reached}
              onSelect={(i, files) => goToStage(i, files)}
              checkpointOf={(i) =>
                loadCode(track.slug, assignment.slug, i) ?? stages[i].starter
              }
            />
          )}

          <Markdown>{stage.brief}</Markdown>

          <section className="mt-8">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Learning objectives
            </h3>
            <ul className="space-y-1.5">
              {assignment.learningObjectives.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-muted">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
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
              {stage.hints.slice(0, hintsShown).map((h, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted"
                >
                  <Markdown>{h}</Markdown>
                </div>
              ))}
              {hintsShown < stage.hints.length && (
                <button
                  onClick={() => setHintsShown((n) => n + 1)}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
                >
                  Show hint ({hintsShown + 1}/{stage.hints.length})
                </button>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Solution {multi && <span className="text-muted/60">(this step)</span>}
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
                {mode === 'solution' ? (
                  <button
                    onClick={backToMyCode}
                    className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back to my code
                  </button>
                ) : (
                  <button
                    onClick={loadSolution}
                    className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-canvas hover:bg-brand-strong"
                  >
                    Load solution into the editor
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                {Object.entries(stage.solution).map(([path, content]) => (
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

        {/* Draggable divider (desktop only) — a thin line with a grip knob, so
            it reads as a resize control, not the brief pane's scrollbar. */}
        <div
          onMouseDown={startBriefResize}
          title="Drag to resize"
          className="group relative hidden w-2 shrink-0 cursor-col-resize items-center justify-center lg:flex"
        >
          <span className="h-full w-px bg-border transition-colors group-hover:bg-brand" />
          <span className="pointer-events-none absolute top-1/2 left-1/2 flex h-7 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded border border-border bg-surface-2 text-muted group-hover:border-brand group-hover:text-brand">
            <GripVertical className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Playground panel */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted">
              {mode === 'solution' ? (
                <span className="font-medium text-warn">
                  Viewing reference solution
                </span>
              ) : (
                <span>
                  Edit the code, then open the{' '}
                  <span className="font-medium text-brand">Tests</span> tab to
                  check it.{' '}
                  <span className="text-muted/70">
                    (First load compiles in your browser — give it a few
                    seconds.)
                  </span>
                </span>
              )}
            </div>
            <button
              onClick={resetStage}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
            >
              {multi ? 'Reset this step' : 'Reset to starter'}
            </button>
          </div>

          {justPassed && mode === 'work' && (
            <div className="mb-3 rounded-lg border border-success/40 bg-success/10 px-4 py-2 text-sm font-medium text-success">
              {isLastStage ? (
                <span className="inline-flex flex-wrap items-center gap-1">
                  <CircleCheckBig className="h-4 w-4" /> All tests passed —{' '}
                  {multi ? 'project complete!' : 'assignment complete!'}{' '}
                  {next && (
                    <Link
                      to={`/track/${track.slug}/${next.slug}`}
                      className="inline-flex items-center gap-1 underline"
                    >
                      Continue to “{next.title}”
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </span>
              ) : (
                <span className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1">
                    <CircleCheckBig className="h-4 w-4" /> Step {stageIndex + 1}{' '}
                    complete!
                  </span>
                  <button
                    onClick={advanceStage}
                    className="inline-flex items-center gap-1 rounded-md bg-success/20 px-3 py-1 font-semibold text-success hover:bg-success/30"
                  >
                    Next step <ChevronRight className="h-4 w-4" />{' '}
                    {stages[stageIndex + 1].title}
                  </button>
                </span>
              )}
            </div>
          )}

          <div className="min-h-[420px] flex-1 lg:min-h-0">
            <CodePlayground
              assignment={assignment}
              files={files}
              visibleFiles={visibleFiles}
              activeFile={activeFile}
              instanceKey={instanceKey}
              onTestsComplete={handleTestsComplete}
              onFilesChange={mode === 'work' ? onFilesChange : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StageTracker({
  stages,
  stageIndex,
  reached,
  onSelect,
  checkpointOf,
}: {
  stages: ReturnType<typeof getStages>
  stageIndex: number
  reached: number
  onSelect: (index: number, files: FileMap) => void
  checkpointOf: (index: number) => FileMap
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Step {stageIndex + 1} of {stages.length}
        </h3>
        <span className="text-xs text-muted">{stages[stageIndex].title}</span>
      </div>
      <ol className="flex gap-1.5">
        {stages.map((s, i) => {
          const done = i < reached
          const current = i === stageIndex
          // A step is reachable if it's unlocked (<= reached) — you can revisit.
          const reachable = i <= reached
          return (
            <li key={i} className="flex-1">
              <button
                disabled={!reachable}
                title={`${i + 1}. ${s.title}`}
                onClick={() => reachable && onSelect(i, checkpointOf(i))}
                className={`h-1.5 w-full rounded-full transition ${
                  current
                    ? 'bg-brand'
                    : done
                      ? 'bg-success'
                      : reachable
                        ? 'bg-muted/40 hover:bg-muted/60'
                        : 'bg-border'
                } ${reachable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}

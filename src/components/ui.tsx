import type { Difficulty } from '../types'
import type { AssignmentStatus } from '../hooks/useProgress'

const difficultyStyles: Record<Difficulty, string> = {
  intro: 'bg-success/15 text-success',
  easy: 'bg-brand/15 text-brand',
  medium: 'bg-warn/15 text-warn',
  hard: 'bg-danger/15 text-danger',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${difficultyStyles[difficulty]}`}
    >
      {difficulty}
    </span>
  )
}

const statusLabel: Record<AssignmentStatus, string> = {
  not_started: 'Not started',
  attempted: 'In progress',
  passed: 'Completed',
}

const statusStyles: Record<AssignmentStatus, string> = {
  not_started: 'bg-border/50 text-muted',
  attempted: 'bg-warn/15 text-warn',
  passed: 'bg-success/15 text-success',
}

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-[11px] font-medium ${statusStyles[status]}`}
    >
      {statusLabel[status]}
    </span>
  )
}

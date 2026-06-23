export type Difficulty = 'intro' | 'easy' | 'medium' | 'hard'

/** A Sandpack-style virtual file system: path -> file contents. */
export type FileMap = Record<string, string>

/**
 * One step of an assignment. Multi-stage assignments are revealed one stage at a
 * time; the student's code is carried forward from each stage to the next, so the
 * whole assignment builds a single, working artifact.
 */
export interface Stage {
  /** Short label shown in the stage tracker, e.g. "Render the board". */
  title: string
  /** This step's prompt, rendered as Markdown. */
  brief: string
  /**
   * Files for a fresh start of this stage (its checkpoint): the assignment
   * starter for stage 0, otherwise a known-good base — typically equal to the
   * previous stage's solution. Used for "reset this stage" and for isolated
   * verification. During normal play the student's carried-forward code is used.
   */
  starter: FileMap
  /** Test file contents (cumulative through this stage). */
  tests: FileMap
  /** Reference solution through this stage, revealed on demand. */
  solution: FileMap
  /** Progressive hints for this stage. */
  hints: string[]
}

export interface Assignment {
  /** Unique within its track, used in the URL, e.g. "first-component". */
  slug: string
  title: string
  difficulty: Difficulty
  estimatedMinutes: number
  /** Short one-liner shown in the sidebar and cards. */
  summary: string
  learningObjectives: string[]
  /** Sandpack template to bundle with. */
  template: 'react-ts' | 'react' | 'vanilla-ts' | 'vanilla'

  // --- Single-stage authoring: the assignment is one implicit stage. ---
  /** Full prompt rendered as Markdown. */
  brief?: string
  /** Starter files the student begins from (Sandpack VFS). */
  starter?: FileMap
  /** Reference solution files (Sandpack VFS), revealed on demand. */
  solution?: FileMap
  /** Test file contents, keyed by path (e.g. "/App.test.tsx"). */
  tests?: FileMap
  /** Progressive hints, revealed one at a time. */
  hints?: string[]

  // --- Multi-stage authoring: an ordered list of steps. ---
  /** When present, the assignment is presented one stage at a time. */
  stages?: Stage[]
}

export interface Track {
  /** Used in the URL, e.g. "react". */
  slug: string
  title: string
  /** Short tagline for the track card. */
  tagline: string
  /** Longer description rendered as Markdown on the track page. */
  description: string
  /** Tech accent emoji/icon shown in nav. */
  icon: string
  status: 'available' | 'planned'
  assignments: Assignment[]
}

/**
 * Normalizes an assignment to its list of stages. Single-stage assignments
 * (authored with the flat brief/starter/tests/solution/hints fields) become a
 * one-element list, so all consumers can treat every assignment uniformly.
 */
export function getStages(assignment: Assignment): Stage[] {
  if (assignment.stages && assignment.stages.length > 0) {
    return assignment.stages
  }
  return [
    {
      title: assignment.title,
      brief: assignment.brief ?? '',
      starter: assignment.starter ?? {},
      tests: assignment.tests ?? {},
      solution: assignment.solution ?? {},
      hints: assignment.hints ?? [],
    },
  ]
}

export function isMultiStage(assignment: Assignment): boolean {
  return (assignment.stages?.length ?? 0) > 1
}

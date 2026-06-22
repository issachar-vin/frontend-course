export type Difficulty = 'intro' | 'easy' | 'medium' | 'hard'

/** A Sandpack-style virtual file system: path -> file contents. */
export type FileMap = Record<string, string>

export interface Assignment {
  /** Unique within its track, used in the URL, e.g. "first-component". */
  slug: string
  title: string
  difficulty: Difficulty
  estimatedMinutes: number
  /** Short one-liner shown in the sidebar and cards. */
  summary: string
  /** Full prompt rendered as Markdown. */
  brief: string
  learningObjectives: string[]
  /** Starter files the student begins from (Sandpack VFS). */
  starter: FileMap
  /** Reference solution files (Sandpack VFS), revealed on demand. */
  solution: FileMap
  /**
   * Test file contents, keyed by path (e.g. "/App.test.tsx").
   * Run in-browser against the student's code to verify the assignment.
   */
  tests: FileMap
  /** Progressive hints, revealed one at a time. */
  hints: string[]
  /** Sandpack template to bundle with. */
  template: 'react-ts' | 'react' | 'vanilla-ts' | 'vanilla'
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

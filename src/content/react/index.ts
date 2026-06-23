import type { Track } from '../../types'
import { ticTacToe } from './tic-tac-toe'

export const reactTrack: Track = {
  slug: 'react',
  title: 'React',
  tagline: 'Learn React by building real projects, one step at a time.',
  status: 'available',
  description: `
This track teaches React the way you actually get good at it: by **building real
apps**. Each project is a sequence of small, hands-on steps — you write the code
in a live editor, run an automated test suite until it goes green, then move to
the next step. Concepts are introduced exactly when you need them, in the context
of something you're building, instead of as disconnected drills.

**Project 1 — Tic-Tac-Toe** covers the fundamentals: components & props, state,
events, lists & keys, lifting state up, and derived/conditional state. Later
projects build on these to cover forms & reducers, effects & data fetching,
custom hooks, context, and beyond. See \`docs/ROADMAP.md\` for the full plan.
`,
  assignments: [ticTacToe],
}

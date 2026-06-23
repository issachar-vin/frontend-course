import type { Assignment, Track } from '../types'
import { reactTrack } from './react'

/**
 * Placeholder for tracks on the roadmap but not yet authored. They render in the
 * UI as "coming soon" so the learning path is visible end-to-end. See
 * docs/ROADMAP.md for the full plan and authoring order.
 */
function plannedTrack(
  slug: string,
  title: string,
  icon: string,
  tagline: string,
): Track {
  return {
    slug,
    title,
    icon,
    tagline,
    status: 'planned',
    description: `The **${title}** track is on the roadmap. The React track is the proven
template; this track will be authored the same way: a short sequence of
multi-step **projects** that teach concepts in context, each with a live preview,
automated checks per step, and reference solutions. See \`docs/ROADMAP.md\`.`,
    assignments: [],
  }
}

export const tracks: Track[] = [
  reactTrack,
  plannedTrack('html', 'HTML', '📄', 'Semantic structure, forms, and accessibility basics.'),
  plannedTrack('css', 'CSS', '🎨', 'Box model, flexbox, grid, and responsive layout.'),
  plannedTrack('javascript', 'JavaScript', '🟨', 'Language core, the DOM, and async.'),
  plannedTrack('typescript', 'TypeScript', '🔷', 'Types, generics, and safer React.'),
  plannedTrack('testing', 'Testing', '✅', 'Unit, component, and end-to-end testing.'),
  plannedTrack('accessibility', 'Accessibility', '♿', 'ARIA, keyboard nav, and inclusive UI.'),
  plannedTrack('performance', 'Performance', '⚡', 'Rendering, bundles, and Core Web Vitals.'),
]

export function getTrack(slug: string): Track | undefined {
  return tracks.find((t) => t.slug === slug)
}

export function getAssignment(
  trackSlug: string,
  assignmentSlug: string,
): { track: Track; assignment: Assignment; index: number } | undefined {
  const track = getTrack(trackSlug)
  if (!track) return undefined
  const index = track.assignments.findIndex((a) => a.slug === assignmentSlug)
  if (index === -1) return undefined
  return { track, assignment: track.assignments[index], index }
}

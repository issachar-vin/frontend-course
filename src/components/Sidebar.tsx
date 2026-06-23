import { NavLink, useParams } from 'react-router-dom'
import {
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { tracks } from '../content/tracks'
import { useProgress, type AssignmentStatus } from '../hooks/useProgress'
import { usePersistentState } from '../hooks/usePersistentState'
import { TrackIcon } from '../lib/icons'
import { ThemeSwitcher } from './ThemeSwitcher'

const statusDot: Record<AssignmentStatus, string> = {
  not_started: 'bg-border',
  attempted: 'bg-warn',
  passed: 'bg-success',
}

export function Sidebar() {
  const { trackSlug } = useParams()
  const { statusOf } = useProgress()
  const [collapsed, setCollapsed] = usePersistentState(
    'fe-course.ui.sidebar-collapsed',
    false,
  )

  if (collapsed) {
    return (
      <aside className="flex w-16 shrink-0 flex-col items-center border-r border-border bg-surface py-4">
        <NavLink to="/" title="Home" className="mb-4 text-brand">
          <GraduationCap className="h-6 w-6" />
        </NavLink>
        <nav className="flex flex-1 flex-col items-center gap-1">
          {tracks.map((track) => (
            <NavLink
              key={track.slug}
              to={`/track/${track.slug}`}
              title={track.title}
              className={({ isActive }) =>
                `flex h-10 w-10 items-center justify-center rounded-lg transition ${
                  isActive || track.slug === trackSlug
                    ? 'bg-surface-2 text-brand'
                    : 'text-muted hover:bg-surface-2 hover:text-ink'
                }`
              }
            >
              <TrackIcon slug={track.slug} className="h-5 w-5" />
            </NavLink>
          ))}
        </nav>
        <div className="mt-2 flex flex-col items-center gap-2">
          <ThemeSwitcher compact />
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-between px-4 py-4">
        <NavLink to="/" className="flex items-center gap-2 text-ink">
          <GraduationCap className="h-6 w-6 text-brand" />
          <span className="font-bold tracking-tight">Frontend Mastery</span>
        </NavLink>
        <button
          onClick={() => setCollapsed(true)}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
          className="rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-ink"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {tracks.map((track) => {
          const isActive = track.slug === trackSlug
          const done = track.assignments.filter(
            (a) => statusOf(track.slug, a.slug) === 'passed',
          ).length
          return (
            <div key={track.slug} className="mb-1">
              <NavLink
                to={`/track/${track.slug}`}
                className={({ isActive: linkActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                    linkActive || isActive
                      ? 'bg-surface-2 text-ink'
                      : 'text-muted hover:bg-surface-2 hover:text-ink'
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <TrackIcon slug={track.slug} className="h-4 w-4" />
                  <span className="font-medium">{track.title}</span>
                </span>
                {track.status === 'planned' ? (
                  <span className="rounded bg-border/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    soon
                  </span>
                ) : (
                  <span className="text-[11px] text-muted">
                    {done}/{track.assignments.length}
                  </span>
                )}
              </NavLink>

              {isActive && track.assignments.length > 0 && (
                <ul className="mt-1 mb-2 ml-4 space-y-0.5 border-l border-border pl-3">
                  {track.assignments.map((a, i) => {
                    const status = statusOf(track.slug, a.slug)
                    return (
                      <li key={a.slug}>
                        <NavLink
                          to={`/track/${track.slug}/${a.slug}`}
                          className={({ isActive: linkActive }) =>
                            `flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition ${
                              linkActive
                                ? 'bg-surface-2 text-brand'
                                : 'text-muted hover:bg-surface-2 hover:text-ink'
                            }`
                          }
                        >
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${statusDot[status]}`}
                          />
                          <span className="truncate">
                            {i + 1}. {a.title}
                          </span>
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <ThemeSwitcher />
      </div>
    </aside>
  )
}

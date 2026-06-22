import { NavLink, useParams } from 'react-router-dom'
import { tracks } from '../content/tracks'
import { useProgress, type AssignmentStatus } from '../hooks/useProgress'

const statusDot: Record<AssignmentStatus, string> = {
  not_started: 'bg-border',
  attempted: 'bg-warn',
  passed: 'bg-success',
}

export function Sidebar() {
  const { trackSlug } = useParams()
  const { statusOf } = useProgress()

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-surface">
      <NavLink to="/" className="flex items-center gap-2 px-5 py-4">
        <span className="text-xl">⚛️</span>
        <span className="font-bold tracking-tight">Frontend Mastery</span>
      </NavLink>

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
                  <span>{track.icon}</span>
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
                <ul className="mt-1 mb-2 space-y-0.5 border-l border-border pl-3 ml-4">
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
    </aside>
  )
}

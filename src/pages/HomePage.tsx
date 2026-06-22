import { Link } from 'react-router-dom'
import { tracks } from '../content/tracks'
import { useProgress } from '../hooks/useProgress'

export function HomePage() {
  const { statusOf } = useProgress()

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Learn frontend by building.
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Every concept is a hands-on assignment: read the brief, write the code
          in a live editor, run the tests until they pass, then compare against a
          reference solution. No passive videos — you learn by doing.
        </p>
      </header>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
        Tracks
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => {
          const total = track.assignments.length
          const done = track.assignments.filter(
            (a) => statusOf(track.slug, a.slug) === 'passed',
          ).length
          const planned = track.status === 'planned'
          const card = (
            <div
              className={`flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition ${
                planned
                  ? 'opacity-60'
                  : 'hover:border-brand/50 hover:bg-surface-2'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{track.icon}</span>
                {planned ? (
                  <span className="rounded bg-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    Coming soon
                  </span>
                ) : (
                  <span className="text-xs text-muted">
                    {done}/{total} done
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold">{track.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{track.tagline}</p>
              {!planned && total > 0 && (
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border/50">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{ width: `${(done / total) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )
          return planned ? (
            <div key={track.slug}>{card}</div>
          ) : (
            <Link key={track.slug} to={`/track/${track.slug}`}>
              {card}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

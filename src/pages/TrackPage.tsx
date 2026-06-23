import { Link, useParams } from 'react-router-dom'
import { getTrack } from '../content/tracks'
import { getStages } from '../types'
import { useProgress } from '../hooks/useProgress'
import { Markdown } from '../components/Markdown'
import { DifficultyBadge, StatusBadge } from '../components/ui'
import { NotFound } from './NotFound'

export function TrackPage() {
  const { trackSlug } = useParams()
  const { statusOf } = useProgress()
  const track = getTrack(trackSlug ?? '')

  if (!track) return <NotFound />

  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <Link to="/" className="text-sm text-muted hover:text-ink">
        ← All tracks
      </Link>
      <header className="mt-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{track.icon}</span>
          <h1 className="text-3xl font-bold tracking-tight">{track.title}</h1>
        </div>
        <div className="mt-4">
          <Markdown>{track.description}</Markdown>
        </div>
      </header>

      {track.assignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
          This track is on the roadmap and not yet authored.
        </div>
      ) : (
        <ol className="space-y-3">
          {track.assignments.map((a, i) => {
            const status = statusOf(track.slug, a.slug)
            return (
              <li key={a.slug}>
                <Link
                  to={`/track/${track.slug}/${a.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-brand/50 hover:bg-surface-2"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-muted">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{a.title}</h3>
                      <DifficultyBadge difficulty={a.difficulty} />
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {a.summary}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge status={status} />
                    <span className="text-xs text-muted">
                      {getStages(a).length > 1 && (
                        <>{getStages(a).length} steps · </>
                      )}
                      ~{a.estimatedMinutes} min
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

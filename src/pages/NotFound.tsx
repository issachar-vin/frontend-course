import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-8 py-24 text-center">
      <h1 className="text-2xl font-bold">Not found</h1>
      <p className="mt-2 text-muted">
        That track or assignment doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 font-medium text-canvas"
      >
        Back home
      </Link>
    </div>
  )
}

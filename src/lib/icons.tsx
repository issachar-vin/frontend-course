import {
  Atom,
  FileCode2,
  Palette,
  Braces,
  FileType2,
  FlaskConical,
  Accessibility,
  Gauge,
  type LucideIcon,
} from 'lucide-react'

const trackIcons: Record<string, LucideIcon> = {
  react: Atom,
  html: FileCode2,
  css: Palette,
  javascript: Braces,
  typescript: FileType2,
  testing: FlaskConical,
  accessibility: Accessibility,
  performance: Gauge,
}

export function TrackIcon({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const Icon = trackIcons[slug] ?? Atom
  return <Icon className={className} aria-hidden />
}

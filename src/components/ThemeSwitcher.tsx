import { useState } from 'react'
import { Check, Palette as PaletteIcon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { getTheme, themes } from '../lib/themes'

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { themeId, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const current = getTheme(themeId)

  const groups = [...new Set(themes.map((t) => t.group))]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Change theme"
        aria-label="Change theme"
        className={`flex items-center gap-2 rounded-lg border border-border text-sm text-muted transition hover:bg-surface-2 hover:text-ink ${
          compact ? 'justify-center p-2' : 'w-full px-3 py-2'
        }`}
      >
        <PaletteIcon className="h-4 w-4 shrink-0" />
        {!compact && (
          <>
            <span className="flex-1 truncate text-left text-ink">
              {current.name}
            </span>
            <Swatch palette={current.palette} />
          </>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute z-20 mb-2 max-h-[60vh] w-56 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-xl ${
              compact ? 'bottom-0 left-full ml-2' : 'bottom-full left-0'
            }`}
          >
            {groups.map((group) => (
              <div key={group} className="mb-1 last:mb-0">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {group}
                </div>
                {themes
                  .filter((t) => t.group === group)
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id)
                        setOpen(false)
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition hover:bg-surface-2 ${
                        t.id === themeId ? 'text-ink' : 'text-muted'
                      }`}
                    >
                      <Swatch palette={t.palette} />
                      <span className="flex-1 truncate text-left">{t.name}</span>
                      {t.id === themeId && (
                        <Check className="h-4 w-4 text-brand" />
                      )}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Swatch({
  palette,
}: {
  palette: { brand: string; success: string; danger: string; surface: string }
}) {
  return (
    <span
      className="flex h-4 w-4 shrink-0 overflow-hidden rounded-full border border-border"
      style={{ background: palette.surface }}
    >
      <span className="h-full w-1/3" style={{ background: palette.brand }} />
      <span className="h-full w-1/3" style={{ background: palette.success }} />
      <span className="h-full w-1/3" style={{ background: palette.danger }} />
    </span>
  )
}

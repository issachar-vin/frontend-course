import { useEffect, useMemo, useRef, useState } from 'react'
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackTests,
  useSandpack,
} from '@codesandbox/sandpack-react'
import type { SandpackFiles } from '@codesandbox/sandpack-react'
import { Moon, Sun } from 'lucide-react'
import type { Assignment, FileMap } from '../types'
import { useTheme } from '../hooks/useTheme'
import { usePersistentState } from '../hooks/usePersistentState'
import { getTheme, sandpackThemeFor } from '../lib/themes'

// Base styles the react-ts template ships in styles.css; we keep them and add a
// preview background on top, so the preview can match the app's dark theme.
const PREVIEW_BASE_CSS =
  'body{font-family:sans-serif;-webkit-font-smoothing:auto;text-rendering:optimizeLegibility}h1{font-size:1.5rem}'

/** Low-specificity background so a learner's own styles still override it. */
function previewCssFor(dark: boolean, surface: string, ink: string) {
  const bg = dark
    ? `body{background:${surface};color:${ink}}`
    : 'body{background:#ffffff;color:#1a1a1a}'
  return PREVIEW_BASE_CSS + bg
}

// Hoisted to module scope so its identity is stable across renders — a changing
// customSetup prop makes SandpackProvider re-initialize and wipe the editor.
const customSetup = {
  dependencies: {
    '@testing-library/react': 'latest',
    '@testing-library/dom': 'latest',
  },
}

type RightTab = 'preview' | 'tests'

interface Props {
  assignment: Assignment
  files: SandpackFiles
  visibleFiles: string[]
  activeFile: string
  /** Remount key so swapping starter/solution or resetting clears Sandpack state. */
  instanceKey: string
  onTestsComplete?: (passed: boolean) => void
  /** Reports the current contents of the editable files (for carry-forward / persistence). */
  onFilesChange?: (files: FileMap) => void
}

export function CodePlayground({
  assignment,
  files,
  visibleFiles,
  activeFile,
  instanceKey,
  onTestsComplete,
  onFilesChange,
}: Props) {
  const [tab, setTab] = useState<RightTab>('preview')
  const { themeId } = useTheme()
  const theme = useMemo(() => sandpackThemeFor(themeId), [themeId])
  const [previewDark, setPreviewDark] = usePersistentState(
    'fe-course.ui.preview-dark',
    true,
  )

  const palette = getTheme(themeId).palette
  const previewCss = previewCssFor(previewDark, palette.surface, palette.ink)

  // The preview background lives in a hidden /styles.css (imported by the template
  // entry). Seed it once and keep it out of the `files` prop identity so toggling
  // it never resets the editor — a child updates it live via updateFile instead.
  const [initialCss] = useState(previewCss)
  const filesWithPreviewStyle = useMemo(
    () => ({ ...files, '/styles.css': { code: initialCss, hidden: true } }),
    [files, initialCss],
  )

  // Stable options identity so tab changes / parent re-renders never reset Sandpack.
  const options = useMemo(
    () => ({
      visibleFiles,
      activeFile,
      autorun: true,
      autoReload: true,
      recompileMode: 'delayed' as const,
      recompileDelay: 300,
    }),
    [visibleFiles, activeFile],
  )

  return (
    <div className="h-full overflow-hidden rounded-xl border border-border bg-surface">
      <SandpackProvider
        key={instanceKey}
        theme={theme}
        template={assignment.template}
        files={filesWithPreviewStyle}
        customSetup={customSetup}
        options={options}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <PreviewBackground css={previewCss} />
        {onFilesChange && (
          <FilesSync visibleFiles={visibleFiles} onFilesChange={onFilesChange} />
        )}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
          <div className="min-h-0 border-b border-border lg:border-b-0 lg:border-r">
            <SandpackCodeEditor
              showLineNumbers
              showTabs
              showRunButton={false}
              style={{ height: '100%' }}
            />
          </div>
          <div className="flex min-h-0 flex-col">
            <div className="flex items-center gap-1 border-b border-border bg-surface px-2 py-1.5">
              <TabButton
                active={tab === 'preview'}
                onClick={() => setTab('preview')}
              >
                Live Preview
              </TabButton>
              <TabButton active={tab === 'tests'} onClick={() => setTab('tests')}>
                Tests
              </TabButton>
              <button
                onClick={() => setPreviewDark((d) => !d)}
                title={
                  previewDark
                    ? 'Preview background: dark (click for light)'
                    : 'Preview background: light (click for dark)'
                }
                aria-label="Toggle preview background"
                className="ml-auto rounded-md p-1.5 text-muted transition hover:bg-surface-2 hover:text-ink"
              >
                {previewDark ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
            </div>
            {/* Both panes stay mounted; toggled with display so state and the
                live bundle are preserved when switching tabs. */}
            <div
              className="min-h-0 flex-1"
              style={{ display: tab === 'preview' ? 'block' : 'none' }}
            >
              <SandpackPreview
                showOpenInCodeSandbox={false}
                showRefreshButton
                showSandpackErrorOverlay
                style={{ height: '100%' }}
              />
            </div>
            <div
              className="min-h-0 flex-1"
              style={{ display: tab === 'tests' ? 'block' : 'none' }}
            >
              {/* Mounted only while the Tests tab is open: SandpackTests auto-runs
                  on mount, and a failing run sets Sandpack's global error state,
                  which would otherwise blanket the live preview. */}
              {tab === 'tests' && (
                <SandpackTests
                  showVerboseButton
                  showWatchButton={false}
                  onComplete={(specs) => {
                    const { total, pass } = tally(specs)
                    if (total > 0) onTestsComplete?.(pass === total)
                  }}
                  style={{ height: '100%' }}
                />
              )}
            </div>
          </div>
        </div>
      </SandpackProvider>
    </div>
  )
}

/**
 * Live-updates the hidden /styles.css that backs the preview, so toggling the
 * preview background (or switching app theme) restyles the preview without
 * touching the `files` prop — which would reset the editor.
 */
function PreviewBackground({ css }: { css: string }) {
  const { sandpack } = useSandpack()
  const applied = useRef<string | null>(null)
  useEffect(() => {
    if (applied.current === css) return
    applied.current = css
    sandpack.updateFile('/styles.css', css, true)
  }, [css, sandpack])
  return null
}

/**
 * Reports the live contents of the editable (visible) files whenever they change.
 * Renders nothing; lives inside the provider to access Sandpack's file state.
 */
function FilesSync({
  visibleFiles,
  onFilesChange,
}: {
  visibleFiles: string[]
  onFilesChange: (files: FileMap) => void
}) {
  const { sandpack } = useSandpack()
  useEffect(() => {
    const out: FileMap = {}
    for (const path of visibleFiles) {
      const file = sandpack.files[path]
      if (file) out[path] = file.code
    }
    onFilesChange(out)
  }, [sandpack.files, visibleFiles, onFilesChange])
  return null
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-sm font-medium transition ${
        active
          ? 'bg-surface-2 text-brand'
          : 'text-muted hover:bg-surface-2 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

interface SpecLike {
  tests: Record<string, { status: string }>
  describes: Record<string, SpecLike>
}

function tally(specs: Record<string, SpecLike>) {
  let total = 0
  let pass = 0
  const walk = (node: SpecLike) => {
    for (const t of Object.values(node.tests)) {
      total++
      if (t.status === 'pass') pass++
    }
    for (const d of Object.values(node.describes)) walk(d)
  }
  for (const spec of Object.values(specs)) walk(spec)
  return { total, pass }
}

import { useMemo, useState } from 'react'
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackTests,
} from '@codesandbox/sandpack-react'
import type {
  SandpackFiles,
  SandpackTheme,
} from '@codesandbox/sandpack-react'
import type { Assignment } from '../types'

const theme: SandpackTheme = {
  colors: {
    surface1: '#121723',
    surface2: '#1a2030',
    surface3: '#273043',
    clickable: '#97a0b5',
    base: '#e6e9ef',
    disabled: '#5a6478',
    hover: '#ffffff',
    accent: '#61dafb',
    error: '#f87171',
    errorSurface: '#2a1414',
  },
  syntax: {
    plain: '#e6e9ef',
    comment: { color: '#5a6478', fontStyle: 'italic' },
    keyword: '#61dafb',
    tag: '#7ee787',
    punctuation: '#97a0b5',
    definition: '#d2a8ff',
    property: '#79c0ff',
    static: '#fbbf24',
    string: '#a5d6ff',
  },
  font: {
    body: 'ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    size: '13px',
    lineHeight: '1.6',
  },
}

const testDeps = {
  '@testing-library/react': 'latest',
  '@testing-library/dom': 'latest',
}

type RightTab = 'preview' | 'tests'

interface Props {
  assignment: Assignment
  /** Replace the editor contents with these files (e.g. solution). Identity change forces a remount. */
  files: SandpackFiles
  visibleFiles: string[]
  activeFile: string
  /** Remount key so swapping starter/solution resets Sandpack state. */
  instanceKey: string
  onTestsComplete?: (passed: boolean) => void
}

export function CodePlayground({
  assignment,
  files,
  visibleFiles,
  activeFile,
  instanceKey,
  onTestsComplete,
}: Props) {
  const [tab, setTab] = useState<RightTab>('preview')

  const provider = useMemo(
    () => (
      <SandpackProvider
        key={instanceKey}
        theme={theme}
        template={assignment.template}
        files={files}
        customSetup={{ dependencies: testDeps }}
        options={{ visibleFiles, activeFile }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[70vh] min-h-[480px]">
          <div className="border-r border-border min-h-0">
            <SandpackCodeEditor
              showLineNumbers
              showTabs
              showRunButton={false}
              style={{ height: '100%' }}
            />
          </div>
          <div className="flex flex-col min-h-0">
            <div className="flex items-center gap-1 border-b border-border bg-surface px-2 py-1.5">
              <TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>
                Live Preview
              </TabButton>
              <TabButton active={tab === 'tests'} onClick={() => setTab('tests')}>
                Tests
              </TabButton>
            </div>
            <div className="flex-1 min-h-0" hidden={tab !== 'preview'}>
              <SandpackPreview
                showOpenInCodeSandbox={false}
                showRefreshButton
                style={{ height: '100%' }}
              />
            </div>
            <div className="flex-1 min-h-0" hidden={tab !== 'tests'}>
              <SandpackTests
                key={instanceKey}
                showVerboseButton
                showWatchButton={false}
                onComplete={(specs) => {
                  const { total, pass } = tally(specs)
                  if (total > 0) onTestsComplete?.(pass === total)
                }}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </div>
      </SandpackProvider>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [instanceKey, tab],
  )

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {provider}
    </div>
  )
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
          : 'text-muted hover:text-ink hover:bg-surface-2'
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

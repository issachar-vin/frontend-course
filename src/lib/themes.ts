import type { SandpackTheme } from '@codesandbox/sandpack-react'

/** The app's color tokens. Each maps to a `--color-*` CSS variable. */
export interface Palette {
  canvas: string
  surface: string
  surface2: string
  border: string
  ink: string
  muted: string
  brand: string
  brandStrong: string
  success: string
  danger: string
  warn: string
  /** Syntax accents for the Sandpack editor. */
  syntax: {
    keyword: string
    tag: string
    string: string
    property: string
    definition: string
    constant: string
  }
}

export interface Theme {
  id: string
  name: string
  group: string
  palette: Palette
}

export const themes: Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    group: 'Default',
    palette: {
      canvas: '#0b0e14',
      surface: '#121723',
      surface2: '#1a2030',
      border: '#273043',
      ink: '#e6e9ef',
      muted: '#97a0b5',
      brand: '#61dafb',
      brandStrong: '#2bb8e6',
      success: '#4ade80',
      danger: '#f87171',
      warn: '#fbbf24',
      syntax: {
        keyword: '#61dafb',
        tag: '#7ee787',
        string: '#a5d6ff',
        property: '#79c0ff',
        definition: '#d2a8ff',
        constant: '#fbbf24',
      },
    },
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    group: 'Vibes',
    palette: {
      canvas: '#1a1033',
      surface: '#241548',
      surface2: '#2f1c5e',
      border: '#432a7a',
      ink: '#f6e9ff',
      muted: '#bfa6e0',
      brand: '#ff71ce',
      brandStrong: '#ff4fbf',
      success: '#05ffa1',
      danger: '#ff5e7e',
      warn: '#fffb96',
      syntax: {
        keyword: '#ff71ce',
        tag: '#05ffa1',
        string: '#fffb96',
        property: '#01cdfe',
        definition: '#b967ff',
        constant: '#01cdfe',
      },
    },
  },
  {
    id: 'orange-grey',
    name: 'Orange & Grey',
    group: 'Vibes',
    palette: {
      canvas: '#161616',
      surface: '#1e1e1e',
      surface2: '#262626',
      border: '#3a3a3a',
      ink: '#ededed',
      muted: '#9a9a9a',
      brand: '#ff7a18',
      brandStrong: '#e8650a',
      success: '#9acd68',
      danger: '#e5484d',
      warn: '#ffb340',
      syntax: {
        keyword: '#ff7a18',
        tag: '#9acd68',
        string: '#d9b48a',
        property: '#c9c9c9',
        definition: '#ffb340',
        constant: '#ffb340',
      },
    },
  },
  {
    id: 'eva-00-proto',
    name: 'EVA-00 (Prototype)',
    group: 'Evangelion',
    palette: {
      canvas: '#1c1605',
      surface: '#28200a',
      surface2: '#352b0f',
      border: '#4f3f15',
      ink: '#f6efdb',
      muted: '#c6b487',
      brand: '#e8a317',
      brandStrong: '#c8860a',
      success: '#a8b545',
      danger: '#d2603a',
      warn: '#f0c040',
      syntax: {
        keyword: '#e8a317',
        tag: '#a8b545',
        string: '#f0c040',
        property: '#d8c98a',
        definition: '#d2603a',
        constant: '#f0c040',
      },
    },
  },
  {
    id: 'eva-00-blue',
    name: 'EVA-00 (Rebuild)',
    group: 'Evangelion',
    palette: {
      canvas: '#0a1020',
      surface: '#0f1830',
      surface2: '#152142',
      border: '#21345e',
      ink: '#e3ecf8',
      muted: '#8fa6c9',
      brand: '#2f80ed',
      brandStrong: '#1f66c8',
      success: '#36c5a0',
      danger: '#ef5350',
      warn: '#f5a623',
      syntax: {
        keyword: '#2f80ed',
        tag: '#36c5a0',
        string: '#a9c7ff',
        property: '#7fa8e0',
        definition: '#5aa0ff',
        constant: '#f5a623',
      },
    },
  },
  {
    id: 'eva-01',
    name: 'EVA-01',
    group: 'Evangelion',
    palette: {
      canvas: '#150f20',
      surface: '#1e1630',
      surface2: '#2a1f45',
      border: '#3d2d63',
      ink: '#eae6f5',
      muted: '#a99bc6',
      brand: '#9ef01a',
      brandStrong: '#7bc70f',
      success: '#5ad17a',
      danger: '#ff6b35',
      warn: '#ffd23f',
      syntax: {
        keyword: '#9ef01a',
        tag: '#b98cff',
        string: '#ffd23f',
        property: '#c9a6ff',
        definition: '#ff6b35',
        constant: '#ffd23f',
      },
    },
  },
  {
    id: 'eva-02',
    name: 'EVA-02',
    group: 'Evangelion',
    palette: {
      canvas: '#1a0d0d',
      surface: '#271212',
      surface2: '#371717',
      border: '#5a2626',
      ink: '#f6e7e7',
      muted: '#cb9a9a',
      brand: '#e11d48',
      brandStrong: '#b3122f',
      success: '#6fbf73',
      danger: '#ff5252',
      warn: '#ff8c1a',
      syntax: {
        keyword: '#ff5252',
        tag: '#6fbf73',
        string: '#ff8c1a',
        property: '#ffb3b3',
        definition: '#ff8c1a',
        constant: '#ff8c1a',
      },
    },
  },
]

export const DEFAULT_THEME_ID = 'midnight'

export function getTheme(id: string): Theme {
  return themes.find((t) => t.id === id) ?? themes[0]
}

/** CSS-variable name for each palette color token. */
const cssVars: Array<[keyof Palette, string]> = [
  ['canvas', '--color-canvas'],
  ['surface', '--color-surface'],
  ['surface2', '--color-surface-2'],
  ['border', '--color-border'],
  ['ink', '--color-ink'],
  ['muted', '--color-muted'],
  ['brand', '--color-brand'],
  ['brandStrong', '--color-brand-strong'],
  ['success', '--color-success'],
  ['danger', '--color-danger'],
  ['warn', '--color-warn'],
]

/** Applies a theme by writing its colors to CSS variables on :root. */
export function applyTheme(id: string) {
  const { palette } = getTheme(id)
  const root = document.documentElement
  for (const [key, cssVar] of cssVars) {
    root.style.setProperty(cssVar, palette[key] as string)
  }
}

/** Builds the matching Sandpack editor theme for a palette. */
export function sandpackThemeFor(id: string): SandpackTheme {
  const { palette: p } = getTheme(id)
  return {
    colors: {
      surface1: p.surface,
      surface2: p.surface2,
      surface3: p.border,
      clickable: p.muted,
      base: p.ink,
      disabled: p.muted,
      hover: p.ink,
      accent: p.brand,
      error: p.danger,
      errorSurface: p.surface2,
    },
    syntax: {
      plain: p.ink,
      comment: { color: p.muted, fontStyle: 'italic' },
      keyword: p.syntax.keyword,
      tag: p.syntax.tag,
      punctuation: p.muted,
      definition: p.syntax.definition,
      property: p.syntax.property,
      static: p.syntax.constant,
      string: p.syntax.string,
    },
    font: {
      body: 'ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Consolas, monospace',
      size: '13px',
      lineHeight: '1.6',
    },
  }
}

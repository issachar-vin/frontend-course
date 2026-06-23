import type { Assignment, Stage } from '../../types'

const boardStyle =
  "{{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: 4 }}"
const squareStyle = '{{ width: 40, height: 40, fontSize: 20 }}'

// --- Reference solutions, one per stage. Each stage's solution is the next
// --- stage's starter (checkpoint), so the project builds up continuously. ---

const S1 = `type SquareProps = {
  value: string | null
  label: string
}

function Square({ value, label }: SquareProps) {
  return (
    <button aria-label={label} style=${squareStyle}>
      {value}
    </button>
  )
}

export default function App() {
  const squares: (string | null)[] = Array(9).fill(null)

  return (
    <div style=${boardStyle}>
      {squares.map((value, i) => (
        <Square key={i} value={value} label={'Square ' + (i + 1)} />
      ))}
    </div>
  )
}
`

const S2 = `import { useState } from 'react'

type SquareProps = {
  value: string | null
  label: string
  onClick: () => void
}

function Square({ value, label, onClick }: SquareProps) {
  return (
    <button aria-label={label} onClick={onClick} style=${squareStyle}>
      {value}
    </button>
  )
}

export default function App() {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))

  function handleClick(i: number) {
    const next = squares.slice()
    next[i] = 'X'
    setSquares(next)
  }

  return (
    <div style=${boardStyle}>
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          label={'Square ' + (i + 1)}
          onClick={() => handleClick(i)}
        />
      ))}
    </div>
  )
}
`

const S3 = `import { useState } from 'react'

type SquareProps = {
  value: string | null
  label: string
  onClick: () => void
}

function Square({ value, label, onClick }: SquareProps) {
  return (
    <button aria-label={label} onClick={onClick} style=${squareStyle}>
      {value}
    </button>
  )
}

export default function App() {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  function handleClick(i: number) {
    const next = squares.slice()
    next[i] = xIsNext ? 'X' : 'O'
    setSquares(next)
    setXIsNext(!xIsNext)
  }

  return (
    <div style=${boardStyle}>
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          label={'Square ' + (i + 1)}
          onClick={() => handleClick(i)}
        />
      ))}
    </div>
  )
}
`

const S4 = `import { useState } from 'react'

type SquareProps = {
  value: string | null
  label: string
  onClick: () => void
}

function Square({ value, label, onClick }: SquareProps) {
  return (
    <button aria-label={label} onClick={onClick} style=${squareStyle}>
      {value}
    </button>
  )
}

export default function App() {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  function handleClick(i: number) {
    if (squares[i]) return
    const next = squares.slice()
    next[i] = xIsNext ? 'X' : 'O'
    setSquares(next)
    setXIsNext(!xIsNext)
  }

  const status = 'Next player: ' + (xIsNext ? 'X' : 'O')

  return (
    <div>
      <div>{status}</div>
      <div style=${boardStyle}>
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            label={'Square ' + (i + 1)}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  )
}
`

const S5 = `import { useState } from 'react'

type SquareProps = {
  value: string | null
  label: string
  onClick: () => void
}

function Square({ value, label, onClick }: SquareProps) {
  return (
    <button aria-label={label} onClick={onClick} style=${squareStyle}>
      {value}
    </button>
  )
}

function calculateWinner(squares: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default function App() {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const winner = calculateWinner(squares)

  function handleClick(i: number) {
    if (squares[i] || winner) return
    const next = squares.slice()
    next[i] = xIsNext ? 'X' : 'O'
    setSquares(next)
    setXIsNext(!xIsNext)
  }

  const status = winner
    ? 'Winner: ' + winner
    : 'Next player: ' + (xIsNext ? 'X' : 'O')

  return (
    <div>
      <div>{status}</div>
      <div style=${boardStyle}>
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            label={'Square ' + (i + 1)}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  )
}
`

const S6 = `import { useState } from 'react'

type SquareProps = {
  value: string | null
  label: string
  onClick: () => void
}

function Square({ value, label, onClick }: SquareProps) {
  return (
    <button aria-label={label} onClick={onClick} style=${squareStyle}>
      {value}
    </button>
  )
}

function calculateWinner(squares: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default function App() {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const winner = calculateWinner(squares)

  function handleClick(i: number) {
    if (squares[i] || winner) return
    const next = squares.slice()
    next[i] = xIsNext ? 'X' : 'O'
    setSquares(next)
    setXIsNext(!xIsNext)
  }

  function reset() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
  }

  const status = winner
    ? 'Winner: ' + winner
    : 'Next player: ' + (xIsNext ? 'X' : 'O')

  return (
    <div>
      <div>{status}</div>
      <div style=${boardStyle}>
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            label={'Square ' + (i + 1)}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
`

const STAGE1_STARTER = `// A "Square" is one cell of the board — a small, reusable component.
// It receives data from its parent through PROPS: \`value\` and \`label\`.

type SquareProps = {
  value: string | null
  label: string
}

function Square({ value, label }: SquareProps) {
  // TODO: return a <button aria-label={label}> that shows {value}
  return null
}

export default function App() {
  const squares: (string | null)[] = Array(9).fill(null)

  // TODO: render a 3x3 grid of 9 <Square /> components.
  // Pass each square its value and a label ("Square 1" ... "Square 9").
  return <div></div>
}
`

// --- Cumulative tests, one file per stage. Unchanged by the Square refactor:
// --- they assert on the rendered buttons (role + aria-label), not internals. ---

const T1 = `import { render, screen } from '@testing-library/react'
import App from './App'

test('renders a 3x3 board of 9 empty squares', () => {
  render(<App />)
  const squares = screen.getAllByLabelText(/^Square /)
  expect(squares).toHaveLength(9)
  squares.forEach((s) => expect(s.textContent).toBe(''))
})
`

const T2 = `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('still renders 9 squares', () => {
  render(<App />)
  expect(screen.getAllByLabelText(/^Square /)).toHaveLength(9)
})

test('clicking a square places an X', () => {
  render(<App />)
  fireEvent.click(screen.getByLabelText('Square 1'))
  expect(screen.getByLabelText('Square 1').textContent).toBe('X')
})
`

const T3 = `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('still renders 9 squares', () => {
  render(<App />)
  expect(screen.getAllByLabelText(/^Square /)).toHaveLength(9)
})

test('turns alternate between X and O', () => {
  render(<App />)
  fireEvent.click(screen.getByLabelText('Square 1'))
  fireEvent.click(screen.getByLabelText('Square 2'))
  fireEvent.click(screen.getByLabelText('Square 3'))
  expect(screen.getByLabelText('Square 1').textContent).toBe('X')
  expect(screen.getByLabelText('Square 2').textContent).toBe('O')
  expect(screen.getByLabelText('Square 3').textContent).toBe('X')
})
`

const T4 = `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('shows whose turn it is, and updates after a move', () => {
  render(<App />)
  expect(screen.getByText('Next player: X')).toBeTruthy()
  fireEvent.click(screen.getByLabelText('Square 1'))
  expect(screen.getByText('Next player: O')).toBeTruthy()
})

test('a filled square cannot be overwritten', () => {
  render(<App />)
  fireEvent.click(screen.getByLabelText('Square 1')) // X
  fireEvent.click(screen.getByLabelText('Square 1')) // ignored
  expect(screen.getByLabelText('Square 1').textContent).toBe('X')
  expect(screen.getByText('Next player: O')).toBeTruthy()
})
`

const T5 = `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

function play(order: number[]) {
  for (const n of order) {
    fireEvent.click(screen.getByLabelText('Square ' + n))
  }
}

test('declares a winner across a row', () => {
  render(<App />)
  // X: 1,2,3 (top row)   O: 4,5
  play([1, 4, 2, 5, 3])
  expect(screen.getByText('Winner: X')).toBeTruthy()
})

test('no more moves are accepted after a win', () => {
  render(<App />)
  play([1, 4, 2, 5, 3]) // X wins
  fireEvent.click(screen.getByLabelText('Square 6'))
  expect(screen.getByLabelText('Square 6').textContent).toBe('')
})
`

const T6 = `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

function play(order: number[]) {
  for (const n of order) {
    fireEvent.click(screen.getByLabelText('Square ' + n))
  }
}

test('reset clears the board and returns to X', () => {
  render(<App />)
  play([1, 4, 2, 5, 3]) // X wins
  expect(screen.getByText('Winner: X')).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

  screen.getAllByLabelText(/^Square /).forEach((s) => {
    expect(s.textContent).toBe('')
  })
  expect(screen.getByText('Next player: X')).toBeTruthy()
})
`

/** Single-file helper: the project lives entirely in /App.tsx. */
const f = (code: string) => ({ '/App.tsx': code })

const stages: Stage[] = [
  {
    title: 'Components & props',
    starter: f(STAGE1_STARTER),
    solution: f(S1),
    tests: { '/App.test.tsx': T1 },
    brief: `
## Step 1 — Build the board from components

A React app is a tree of **components** — functions that return **JSX** (markup
that lives in your code). Components become reusable by accepting **props**:
inputs passed in like HTML attributes.

You'll build two components:

- \`Square\` — renders one cell. It takes a \`value\` (what's in the cell) and a
  \`label\` (for accessibility) as props.
- \`App\` (the board) — renders a 3×3 grid of 9 \`Square\`s.

### Requirements

- \`Square\` renders \`<button aria-label={label}>\` showing \`{value}\`
- \`App\` renders 9 \`Square\`s in a grid, labelled \`Square 1\` … \`Square 9\`
- Every square starts empty (\`value\` is \`null\`)

> [!TIP]
> Build the 9 squares by \`map\`-ping an array — \`squares.map((value, i) => …)\`.
> Each item in a list needs a unique \`key\` prop so React can track it.
`,
    hints: [
      'In `Square`, read props and return `<button aria-label={label}>{value}</button>`.',
      'In `App`, render the grid with `squares.map((value, i) => <Square key={i} value={value} label={"Square " + (i + 1)} />)`.',
      'Props flow **down**: the parent (`App`) decides each Square\'s `value` and `label`.',
    ],
  },
  {
    title: 'State & lifting state up',
    starter: f(S1),
    solution: f(S2),
    tests: { '/App.test.tsx': T2 },
    brief: `
## Step 2 — Make squares clickable with shared state

Props come from the parent; **state** is data a component owns and can change.
The board's data — which squares are filled — must be shared across all 9
squares, so it belongs in their common parent, \`App\`. This is **lifting state
up**: the parent holds the state and passes data down, while children report
events back up through callback props.

### Requirements

- \`App\` holds the squares in \`useState\` (9 \`null\`s to start)
- \`Square\` gains an \`onClick\` callback prop; clicking it calls that callback
- Clicking a square fills it with \`'X'\`
- Update state **immutably** — copy the array, change the copy, then set it

> [!WARNING]
> Never mutate state directly (\`squares[i] = 'X'\`). Copy first with
> \`squares.slice()\`, change the copy, then call the setter. React re-renders by
> comparing references.
`,
    hints: [
      'Add `const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))` in `App`.',
      'Add an `onClick: () => void` prop to `Square` and wire it to the button.',
      'In `handleClick(i)`: `const next = squares.slice(); next[i] = "X"; setSquares(next)`, and pass `onClick={() => handleClick(i)}` to each Square.',
    ],
  },
  {
    title: 'Alternate turns',
    starter: f(S2),
    solution: f(S3),
    tests: { '/App.test.tsx': T3 },
    brief: `
## Step 3 — Two players: alternate X and O

A game needs two players. Track whose turn it is in state and alternate the mark
on every move.

### Requirements

- Track the turn with state (e.g. \`xIsNext\`)
- The first move is \`X\`, then \`O\`, then \`X\`, …
- Flip the turn after each move

> [!TIP]
> Derive the mark from the turn: \`xIsNext ? 'X' : 'O'\`, then \`setXIsNext(!xIsNext)\`.
`,
    hints: [
      'Add `const [xIsNext, setXIsNext] = useState(true)`.',
      "Place `xIsNext ? 'X' : 'O'` instead of always `'X'`.",
      'After placing the mark, call `setXIsNext(!xIsNext)`.',
    ],
  },
  {
    title: 'Status & no overwrites',
    starter: f(S3),
    solution: f(S4),
    tests: { '/App.test.tsx': T4 },
    brief: `
## Step 4 — Show the turn, and protect filled squares

Players need to see whose turn it is, and a taken square shouldn't be
overwritten. This is **conditional logic** driving the UI.

### Requirements

- Show a status line: \`Next player: X\` or \`Next player: O\`
- Clicking an already-filled square does nothing (no change, turn doesn't pass)

> [!NOTE]
> Guard the handler: if \`squares[i]\` already has a value, \`return\` early.
`,
    hints: [
      'At the top of `handleClick`, add `if (squares[i]) return`.',
      "Build `const status = 'Next player: ' + (xIsNext ? 'X' : 'O')`.",
      'Render the status above the board, e.g. `<div>{status}</div>`.',
    ],
  },
  {
    title: 'Detect a winner',
    starter: f(S4),
    solution: f(S5),
    tests: { '/App.test.tsx': T5 },
    brief: `
## Step 5 — Detect three in a row

Make it a real game: detect a winner and announce it. The winner isn't separate
state — it's **derived** from the squares, computed during render.

### Requirements

- Write \`calculateWinner(squares)\` returning \`'X'\`, \`'O'\`, or \`null\`
- When there's a winner, the status reads \`Winner: X\` (or \`O\`)
- Once won, no further moves are accepted

> [!TIP]
> There are 8 winning lines (3 rows, 3 columns, 2 diagonals). For each, if all
> three cells are non-empty and equal, that mark wins. Compute the winner during
> render — don't store it in state; that would be a second source of truth.
`,
    hints: [
      'List the 8 winning index-triples and loop them, checking the three cells are non-null and equal.',
      'Compute `const winner = calculateWinner(squares)` during render.',
      "Extend the guard to `if (squares[i] || winner) return`, and show `'Winner: ' + winner` in the status when set.",
    ],
  },
  {
    title: 'Play again',
    starter: f(S5),
    solution: f(S6),
    tests: { '/App.test.tsx': T6 },
    brief: `
## Step 6 — Reset and play again

Finish the game with a reset so you can play another round.

### Requirements

- Add a button labelled \`Reset\`
- Clicking it clears the board and returns the turn to \`X\`

> [!NOTE]
> 🎉 You've built a complete, playable game **from scratch** — composing
> components and props, owning and lifting state, handling events, rendering a
> list with keys, and using derived + conditional state. Those are the core React
> skills, learned in one real project instead of ten disconnected drills.
`,
    hints: [
      'Add a `reset` function calling `setSquares(Array(9).fill(null))` and `setXIsNext(true)`.',
      'Render `<button onClick={reset}>Reset</button>` below the board.',
    ],
  },
]

export const ticTacToe: Assignment = {
  slug: 'tic-tac-toe',
  title: 'Project 1 · Tic-Tac-Toe',
  difficulty: 'medium',
  estimatedMinutes: 90,
  summary:
    'Learn the React fundamentals by building a complete, playable game — one step at a time.',
  learningObjectives: [
    'Build UIs from components and pass data with props',
    'Own state with useState and lift shared state to a common parent',
    'Handle events and update state immutably',
    'Render lists with keys, and use derived + conditional state',
  ],
  template: 'react-ts',
  stages,
}

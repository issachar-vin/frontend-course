import type { Assignment, Track } from '../../types'

const template = 'react-ts' as const

const firstComponent: Assignment = {
  slug: 'first-component',
  title: 'Your First Component',
  difficulty: 'intro',
  estimatedMinutes: 10,
  summary: 'Return JSX from a function component.',
  learningObjectives: [
    'Understand that a React component is a function that returns JSX',
    'Render an element to the screen',
    'Recognize that the component name must be capitalized',
  ],
  brief: `
## Your First Component

In React, a **component** is just a JavaScript function that returns **JSX** —
markup that looks like HTML but lives in your code.

Your job: make the \`App\` component return an \`<h1>\` heading that says exactly:

> Hello, React!

### Requirements

- Return a single \`<h1>\` element
- Its text must be \`Hello, React!\` (exact)

> [!TIP]
> JSX must return a single root element. Whatever you return is what the user sees.
`,
  starter: {
    '/App.tsx': `export default function App() {
  // TODO: return an <h1> that says: Hello, React!
  return null
}
`,
  },
  solution: {
    '/App.tsx': `export default function App() {
  return <h1>Hello, React!</h1>
}
`,
  },
  tests: {
    '/App.test.tsx': `import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the greeting heading', () => {
  render(<App />)
  const heading = screen.getByRole('heading', { level: 1 })
  expect(heading.textContent).toBe('Hello, React!')
})
`,
  },
  hints: [
    'JSX looks like HTML: `return <h1>...</h1>`.',
    'Replace `return null` with your heading element.',
    'The text is case-sensitive, including the comma and exclamation mark.',
  ],
  template,
}

const props: Assignment = {
  slug: 'props-and-composition',
  title: 'Props & Composition',
  difficulty: 'easy',
  estimatedMinutes: 15,
  summary: 'Pass data into a component with props.',
  learningObjectives: [
    'Define a typed props object',
    'Read props inside a component via destructuring',
    'Compose one component inside another',
  ],
  brief: `
## Props & Composition

Components become reusable when they accept **props** — inputs passed in like
HTML attributes.

Build a \`Greeting\` component that takes a \`name\` prop and renders:

\`\`\`
Hello, <name>!
\`\`\`

Then have \`App\` render \`<Greeting name="Ada" />\`.

### Requirements

- \`Greeting\` accepts a \`name: string\` prop and renders \`<p>Hello, {name}!</p>\`
- Export \`Greeting\` as a **named export** (so it can be reused & tested)
- \`App\` (default export) renders \`<Greeting name="Ada" />\`

> [!NOTE]
> Props are read-only. A component must never modify its own props.
`,
  starter: {
    '/App.tsx': `type GreetingProps = {
  // TODO: declare a \`name\` prop of type string
}

export function Greeting(props: GreetingProps) {
  // TODO: return <p>Hello, NAME!</p> using the name prop
  return null
}

export default function App() {
  // TODO: render <Greeting /> with name="Ada"
  return null
}
`,
  },
  solution: {
    '/App.tsx': `type GreetingProps = {
  name: string
}

export function Greeting({ name }: GreetingProps) {
  return <p>Hello, {name}!</p>
}

export default function App() {
  return <Greeting name="Ada" />
}
`,
  },
  tests: {
    '/App.test.tsx': `import { render, screen } from '@testing-library/react'
import App, { Greeting } from './App'

test('App greets Ada', () => {
  const { container } = render(<App />)
  expect(container.textContent).toContain('Hello, Ada!')
})

test('Greeting uses whatever name it is given', () => {
  const { container } = render(<Greeting name="Grace" />)
  expect(container.textContent).toContain('Hello, Grace!')
})
`,
  },
  hints: [
    'Type the prop: `type GreetingProps = { name: string }`.',
    'Destructure in the signature: `function Greeting({ name }: GreetingProps)`.',
    'Embed a variable in JSX with curly braces: `{name}`.',
  ],
  template,
}

const stateCounter: Assignment = {
  slug: 'state-counter',
  title: 'State with useState',
  difficulty: 'easy',
  estimatedMinutes: 20,
  summary: 'Track changing values with the useState hook.',
  learningObjectives: [
    'Initialize state with useState',
    'Update state in event handlers',
    'Use the functional updater form to avoid stale state',
  ],
  brief: `
## State with \`useState\`

Props come from the parent; **state** is data a component owns and can change
over time. The \`useState\` hook gives you a value and a setter.

Build a counter:

- Displays \`Count: <n>\` starting at \`0\`
- A \`+\` button increments the count
- A \`-\` button decrements the count

### Requirements

- Use \`useState\` initialized to \`0\`
- Render the text \`Count: {count}\`
- Button labelled \`+\` increments, button labelled \`-\` decrements

> [!TIP]
> Prefer the functional updater: \`setCount(c => c + 1)\`. It reads the latest
> value and avoids bugs when updates batch.
`,
  starter: {
    '/App.tsx': `import { useState } from 'react'

export default function App() {
  // TODO: track the count with useState, starting at 0

  return (
    <div>
      <p>Count: 0</p>
      <button>-</button>
      <button>+</button>
    </div>
  )
}
`,
  },
  solution: {
    '/App.tsx': `import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  )
}
`,
  },
  tests: {
    '/App.test.tsx': `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('counts up and down', () => {
  const { container } = render(<App />)
  const inc = screen.getByRole('button', { name: '+' })
  const dec = screen.getByRole('button', { name: '-' })

  expect(container.textContent).toContain('Count: 0')
  fireEvent.click(inc)
  fireEvent.click(inc)
  expect(container.textContent).toContain('Count: 2')
  fireEvent.click(dec)
  expect(container.textContent).toContain('Count: 1')
})
`,
  },
  hints: [
    'Destructure the hook: `const [count, setCount] = useState(0)`.',
    'Wire a handler: `onClick={() => setCount(c => c + 1)}`.',
    'Show the live value with `{count}` instead of the hard-coded `0`.',
  ],
  template,
}

const conditional: Assignment = {
  slug: 'conditional-rendering',
  title: 'Conditional Rendering',
  difficulty: 'easy',
  estimatedMinutes: 20,
  summary: 'Show or hide UI based on state.',
  learningObjectives: [
    'Toggle a boolean in state',
    'Render different UI with a ternary',
    'Conditionally render an element',
  ],
  brief: `
## Conditional Rendering

UI often depends on state. Build a toggle that reveals a hidden message.

- A button toggles between the labels \`Show\` and \`Hide\`
- When "on", render \`<p>The answer is 42</p>\`
- When "off", the message must **not** be in the DOM

### Requirements

- Start in the hidden state, button reads \`Show\`
- Clicking flips the state; when visible the button reads \`Hide\`
- The message \`The answer is 42\` appears only when visible

> [!NOTE]
> \`condition && <JSX/>\` renders the JSX only when the condition is truthy —
> a clean way to conditionally include an element.
`,
  starter: {
    '/App.tsx': `import { useState } from 'react'

export default function App() {
  // TODO: track whether the message is visible

  return (
    <div>
      <button>Show</button>
      {/* TODO: render the message only when visible */}
    </div>
  )
}
`,
  },
  solution: {
    '/App.tsx': `import { useState } from 'react'

export default function App() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <button onClick={() => setVisible((v) => !v)}>
        {visible ? 'Hide' : 'Show'}
      </button>
      {visible && <p>The answer is 42</p>}
    </div>
  )
}
`,
  },
  tests: {
    '/App.test.tsx': `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('toggles the secret message', () => {
  render(<App />)
  const button = screen.getByRole('button')

  expect(button.textContent).toBe('Show')
  expect(screen.queryByText('The answer is 42')).toBeNull()

  fireEvent.click(button)
  expect(button.textContent).toBe('Hide')
  expect(screen.queryByText('The answer is 42')).not.toBeNull()

  fireEvent.click(button)
  expect(screen.queryByText('The answer is 42')).toBeNull()
})
`,
  },
  hints: [
    'Hold visibility in state: `const [visible, setVisible] = useState(false)`.',
    'Flip it: `onClick={() => setVisible(v => !v)}`.',
    'Use `{visible ? "Hide" : "Show"}` for the label and `{visible && <p>...</p>}` for the message.',
  ],
  template,
}

const lists: Assignment = {
  slug: 'rendering-lists',
  title: 'Rendering Lists',
  difficulty: 'easy',
  estimatedMinutes: 20,
  summary: 'Turn an array into a list of elements with keys.',
  learningObjectives: [
    'Map an array to JSX elements',
    'Provide a stable `key` for each item',
    'Render a semantic list',
  ],
  brief: `
## Rendering Lists

Render the provided \`fruits\` array as an unordered list — one \`<li>\` per fruit.

### Requirements

- Render a \`<ul>\` containing one \`<li>\` per item, in order
- Each \`<li>\` shows the fruit's name
- Give each \`<li>\` a \`key\`

> [!WARNING]
> Keys help React track items across re-renders. Don't use the array index as a
> key when the list can reorder — prefer a stable id. Here the names are unique,
> so they make a fine key.
`,
  starter: {
    '/App.tsx': `const fruits = ['Apple', 'Banana', 'Cherry']

export default function App() {
  return (
    <ul>
      {/* TODO: render one <li> per fruit */}
    </ul>
  )
}
`,
  },
  solution: {
    '/App.tsx': `const fruits = ['Apple', 'Banana', 'Cherry']

export default function App() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  )
}
`,
  },
  tests: {
    '/App.test.tsx': `import { render, screen } from '@testing-library/react'
import App from './App'

test('renders every fruit as a list item, in order', () => {
  render(<App />)
  const items = screen.getAllByRole('listitem')
  expect(items.map((li) => li.textContent)).toEqual([
    'Apple',
    'Banana',
    'Cherry',
  ])
})
`,
  },
  hints: [
    'Use `fruits.map(...)` inside the `<ul>`.',
    'Each callback returns `<li key={fruit}>{fruit}</li>`.',
    'The `key` must be unique among siblings — the fruit name works here.',
  ],
  template,
}

const controlledForm: Assignment = {
  slug: 'controlled-form',
  title: 'Controlled Inputs',
  difficulty: 'medium',
  estimatedMinutes: 25,
  summary: 'Bind an input to state and react to changes.',
  learningObjectives: [
    'Make a controlled input (value + onChange)',
    'Read input events',
    'Derive UI from input state',
  ],
  brief: `
## Controlled Inputs

In a **controlled input**, React state is the single source of truth: the input
shows \`value\` from state, and \`onChange\` writes every keystroke back to state.

Build a live name echo:

- A text input labelled \`Your name\` (use \`aria-label="Your name"\`)
- Below it, a \`<p>\` that shows \`Hello, <whatever was typed>\`
- It starts empty, so initially it reads \`Hello, \`

### Requirements

- The input is controlled by state (its \`value\` comes from state)
- Typing updates the greeting live

> [!TIP]
> Read the new value from \`event.target.value\` inside \`onChange\`.
`,
  starter: {
    '/App.tsx': `import { useState } from 'react'

export default function App() {
  // TODO: hold the typed name in state

  return (
    <div>
      <input aria-label="Your name" />
      <p>Hello, </p>
    </div>
  )
}
`,
  },
  solution: {
    '/App.tsx': `import { useState } from 'react'

export default function App() {
  const [name, setName] = useState('')

  return (
    <div>
      <input
        aria-label="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Hello, {name}</p>
    </div>
  )
}
`,
  },
  tests: {
    '/App.test.tsx': `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('echoes the typed name', () => {
  const { container } = render(<App />)
  const input = screen.getByLabelText('Your name') as HTMLInputElement

  fireEvent.change(input, { target: { value: 'Lin' } })
  expect(input.value).toBe('Lin')
  expect(container.textContent).toContain('Hello, Lin')
})
`,
  },
  hints: [
    'Add state: `const [name, setName] = useState("")`.',
    'Bind the input: `value={name}` and `onChange={(e) => setName(e.target.value)}`.',
    'Show it: `<p>Hello, {name}</p>`.',
  ],
  template,
}

const liftingState: Assignment = {
  slug: 'lifting-state-up',
  title: 'Lifting State Up',
  difficulty: 'medium',
  estimatedMinutes: 30,
  summary: 'Share state between sibling components via a parent.',
  learningObjectives: [
    'Move shared state to the closest common parent',
    'Pass state down as props and changes up via callbacks',
    'Keep two siblings in sync',
  ],
  brief: `
## Lifting State Up

When two components need the same data, move the state **up** to their nearest
common parent, then pass it down.

Two children:

- \`NameInput\` — a controlled text input (\`aria-label="Name"\`)
- \`Banner\` — shows \`Hi, <name>!\`, or \`Hi there!\` when the name is empty

The parent \`App\` owns the name state and wires them together.

### Requirements

- \`App\` holds the \`name\` state
- \`NameInput\` receives \`value\` and an \`onChange\` callback as props
- \`Banner\` receives \`name\` as a prop and shows \`Hi, <name>!\` (or \`Hi there!\` when empty)

> [!NOTE]
> Children don't own the data — they receive it. Data flows **down** as props,
> events flow **up** as callbacks.
`,
  starter: {
    '/App.tsx': `import { useState } from 'react'

function NameInput(/* TODO: props */) {
  // TODO: render a controlled input with aria-label="Name"
  return <input aria-label="Name" />
}

function Banner(/* TODO: props */) {
  // TODO: show "Hi, <name>!" or "Hi there!" when empty
  return <p>Hi there!</p>
}

export default function App() {
  // TODO: own the name state here and pass it down
  return (
    <div>
      <NameInput />
      <Banner />
    </div>
  )
}
`,
  },
  solution: {
    '/App.tsx': `import { useState } from 'react'

type NameInputProps = {
  value: string
  onChange: (value: string) => void
}

function NameInput({ value, onChange }: NameInputProps) {
  return (
    <input
      aria-label="Name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function Banner({ name }: { name: string }) {
  return <p>{name ? \`Hi, \${name}!\` : 'Hi there!'}</p>
}

export default function App() {
  const [name, setName] = useState('')
  return (
    <div>
      <NameInput value={name} onChange={setName} />
      <Banner name={name} />
    </div>
  )
}
`,
  },
  tests: {
    '/App.test.tsx': `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('banner reflects what is typed into the sibling input', () => {
  const { container } = render(<App />)
  expect(container.textContent).toContain('Hi there!')

  const input = screen.getByLabelText('Name') as HTMLInputElement
  fireEvent.change(input, { target: { value: 'Mei' } })

  expect(input.value).toBe('Mei')
  expect(container.textContent).toContain('Hi, Mei!')
})
`,
  },
  hints: [
    'State belongs in `App`, the common parent: `const [name, setName] = useState("")`.',
    '`NameInput` takes `value` and `onChange` props; call `onChange(e.target.value)`.',
    '`Banner` takes a `name` prop and chooses its text with a ternary.',
  ],
  template,
}

const effects: Assignment = {
  slug: 'effects-and-sync',
  title: 'Effects: Syncing with the Outside',
  difficulty: 'medium',
  estimatedMinutes: 30,
  summary: 'Use useEffect to sync React state to something external.',
  learningObjectives: [
    'Run a side effect after render with useEffect',
    'Re-run an effect when its dependencies change',
    'Synchronize external state (document.title) with React state',
  ],
  brief: `
## Effects: Syncing with the Outside

\`useEffect\` runs code **after** render to synchronize React with things outside
React — the DOM document, timers, subscriptions, network.

Build a click counter that keeps the **browser tab title** in sync:

- Display \`Clicks: <n>\` and an \`Increment\` button
- After every render, set \`document.title\` to \`Clicks: <n>\`

### Requirements

- Use \`useState\` for the count and \`useEffect\` to set \`document.title\`
- The effect must re-run whenever the count changes (correct dependency array)
- On first render the title is \`Clicks: 0\`

> [!WARNING]
> The dependency array controls when the effect re-runs. \`[count]\` = "re-run
> when count changes". An empty \`[]\` would run once and never update the title.
`,
  starter: {
    '/App.tsx': `import { useState, useEffect } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  // TODO: keep document.title in sync with count using useEffect

  return (
    <div>
      <p>Clicks: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  )
}
`,
  },
  solution: {
    '/App.tsx': `import { useState, useEffect } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = 'Clicks: ' + count
  }, [count])

  return (
    <div>
      <p>Clicks: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  )
}
`,
  },
  tests: {
    '/App.test.tsx': `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('keeps the document title in sync with the count', () => {
  render(<App />)
  expect(document.title).toBe('Clicks: 0')

  const button = screen.getByRole('button', { name: 'Increment' })
  fireEvent.click(button)
  expect(document.title).toBe('Clicks: 1')
  fireEvent.click(button)
  expect(document.title).toBe('Clicks: 2')
})
`,
  },
  hints: [
    'Call `useEffect(() => { ... }, [count])`.',
    'Inside, set `document.title = "Clicks: " + count`.',
    'The `[count]` dependency makes it re-run on every change.',
  ],
  template,
}

const customHook: Assignment = {
  slug: 'custom-hook',
  title: 'Build a Custom Hook',
  difficulty: 'hard',
  estimatedMinutes: 30,
  summary: 'Extract reusable stateful logic into your own hook.',
  learningObjectives: [
    'Encapsulate stateful logic in a custom hook',
    'Return a tuple of value and updater',
    'Reuse the hook across components',
  ],
  brief: `
## Build a Custom Hook

When stateful logic repeats, extract it into a **custom hook** — a function whose
name starts with \`use\` and that calls other hooks.

Implement \`useToggle\` in \`useToggle.ts\`:

- \`useToggle(initial: boolean)\` returns a tuple \`[on, toggle]\`
- \`on\` is the current boolean
- calling \`toggle()\` flips it

\`App.tsx\` already consumes it — you only need to implement the hook.

### Requirements

- Export \`useToggle\` from \`useToggle.ts\`
- It manages its own state with \`useState\`
- \`toggle()\` inverts the current value

> [!TIP]
> Returning a tuple \`[value, fn]\` mirrors \`useState\` and lets callers name the
> pair whatever they want.
`,
  starter: {
    '/useToggle.ts': `import { useState } from 'react'

export function useToggle(initial: boolean): [boolean, () => void] {
  // TODO: hold the boolean in state and return [value, toggle]
  return [initial, () => {}]
}
`,
    '/App.tsx': `import { useToggle } from './useToggle'

export default function App() {
  const [on, toggle] = useToggle(false)
  return (
    <div>
      <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
    </div>
  )
}
`,
  },
  solution: {
    '/useToggle.ts': `import { useState, useCallback } from 'react'

export function useToggle(initial: boolean): [boolean, () => void] {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn((v) => !v), [])
  return [on, toggle]
}
`,
    '/App.tsx': `import { useToggle } from './useToggle'

export default function App() {
  const [on, toggle] = useToggle(false)
  return (
    <div>
      <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
    </div>
  )
}
`,
  },
  tests: {
    '/useToggle.test.tsx': `import { renderHook, act } from '@testing-library/react'
import { useToggle } from './useToggle'

test('starts at the initial value and flips on toggle', () => {
  const { result } = renderHook(() => useToggle(false))
  expect(result.current[0]).toBe(false)

  act(() => result.current[1]())
  expect(result.current[0]).toBe(true)

  act(() => result.current[1]())
  expect(result.current[0]).toBe(false)
})

test('respects a true initial value', () => {
  const { result } = renderHook(() => useToggle(true))
  expect(result.current[0]).toBe(true)
})
`,
  },
  hints: [
    'Inside the hook: `const [on, setOn] = useState(initial)`.',
    'Define `toggle` as `() => setOn(v => !v)`.',
    'Return `[on, toggle]`.',
  ],
  template,
}

const reducer: Assignment = {
  slug: 'usereducer-todos',
  title: 'State Machines with useReducer',
  difficulty: 'hard',
  estimatedMinutes: 40,
  summary: 'Manage complex state transitions with a reducer.',
  learningObjectives: [
    'Model state updates as actions',
    'Write a pure reducer function',
    'Drive a small feature with useReducer',
  ],
  brief: `
## State Machines with \`useReducer\`

When state updates get complex or interdependent, \`useReducer\` centralizes them.
You dispatch **actions**; a pure **reducer** computes the next state.

Build a minimal to-do adder:

- A text input (\`aria-label="New todo"\`) and an \`Add\` button
- Submitting appends the text as a new item to a list
- Empty/whitespace-only text is ignored
- After adding, the input clears

### Requirements

- Manage the todo list with \`useReducer\`
- The reducer handles an \`add\` action that appends a todo
- Render each todo as an \`<li>\`

> [!NOTE]
> A reducer must be **pure**: given the same state and action it returns the same
> next state, with no mutation and no side effects. Build a new array, don't
> \`push\` into the old one.
`,
  starter: {
    '/App.tsx': `import { useReducer, useState } from 'react'

type Todo = { id: number; text: string }
type Action = { type: 'add'; text: string }

function reducer(state: Todo[], action: Action): Todo[] {
  // TODO: handle the 'add' action by appending a new todo
  return state
}

export default function App() {
  const [todos, dispatch] = useReducer(reducer, [])
  const [text, setText] = useState('')

  function handleAdd() {
    // TODO: dispatch an add action (ignore empty text) and clear the input
  }

  return (
    <div>
      <input
        aria-label="New todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}
`,
  },
  solution: {
    '/App.tsx': `import { useReducer, useState } from 'react'

type Todo = { id: number; text: string }
type Action = { type: 'add'; text: string }

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now() + state.length, text: action.text }]
    default:
      return state
  }
}

export default function App() {
  const [todos, dispatch] = useReducer(reducer, [])
  const [text, setText] = useState('')

  function handleAdd() {
    const trimmed = text.trim()
    if (!trimmed) return
    dispatch({ type: 'add', text: trimmed })
    setText('')
  }

  return (
    <div>
      <input
        aria-label="New todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}
`,
  },
  tests: {
    '/App.test.tsx': `import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('adds typed todos and ignores empty input', () => {
  render(<App />)
  const input = screen.getByLabelText('New todo') as HTMLInputElement
  const add = screen.getByRole('button', { name: 'Add' })

  fireEvent.change(input, { target: { value: 'Buy milk' } })
  fireEvent.click(add)

  // input clears after adding
  expect(input.value).toBe('')

  fireEvent.change(input, { target: { value: '   ' } })
  fireEvent.click(add) // whitespace ignored

  fireEvent.change(input, { target: { value: 'Walk dog' } })
  fireEvent.click(add)

  const items = screen.getAllByRole('listitem')
  expect(items.map((li) => li.textContent)).toEqual(['Buy milk', 'Walk dog'])
})
`,
  },
  hints: [
    "In the reducer's `add` case, return a new array: `[...state, newTodo]`.",
    'Give each todo a unique `id` (e.g. derived from `Date.now()`).',
    'In `handleAdd`, trim the text, bail if empty, dispatch, then `setText("")`.',
  ],
  template,
}

export const reactTrack: Track = {
  slug: 'react',
  title: 'React',
  tagline: 'Components, state, effects, and hooks — built by doing.',
  icon: '⚛️',
  status: 'available',
  description: `
React is the most widely used way to build interactive UIs on the web. This track
takes you from your very first component to custom hooks and reducers, one
hands-on assignment at a time. Each task ships with a live preview and an
automated test suite — write code until the tests go green, then compare against
the reference solution.

**You will build:** components, props, \`useState\`, conditional rendering, list
rendering, controlled forms, lifting state up, \`useEffect\`, a custom hook, and a
\`useReducer\`-driven feature.
`,
  assignments: [
    firstComponent,
    props,
    stateCounter,
    conditional,
    lists,
    controlledForm,
    liftingState,
    effects,
    customHook,
    reducer,
  ],
}

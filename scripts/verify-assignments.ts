/**
 * Content validation for every available assignment:
 *   - tests MUST pass against the reference `solution`
 *   - tests MUST fail against the `starter`
 *
 * Each assignment's files are written to a temp dir inside the project (so
 * `react` / `@testing-library/*` resolve via the project's node_modules) and run
 * with Vitest + jsdom, which mirrors the testing-library API Sandpack uses.
 *
 * Run: npm run verify:content
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tracks } from '../src/content/tracks'
import type { FileMap } from '../src/types'

const here = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(here, '..')
const workRoot = join(projectRoot, '.verify')
const config = join(here, 'vitest.verify.config.ts')

function writeFiles(dir: string, ...maps: FileMap[]) {
  for (const map of maps) {
    for (const [path, content] of Object.entries(map)) {
      const full = join(dir, path.replace(/^\//, ''))
      mkdirSync(dirname(full), { recursive: true })
      writeFileSync(full, content)
    }
  }
}

/** Returns true when the vitest run passed (exit 0). */
function runVitest(dir: string): boolean {
  try {
    execFileSync(
      'npx',
      ['vitest', 'run', dir, '--config', config, '--root', projectRoot],
      { stdio: 'ignore' },
    )
    return true
  } catch {
    return false
  }
}

interface Result {
  name: string
  solutionPasses: boolean
  starterFails: boolean
}

const results: Result[] = []

rmSync(workRoot, { recursive: true, force: true })

for (const track of tracks) {
  if (track.status !== 'available') continue
  for (const a of track.assignments) {
    const base = join(workRoot, track.slug, a.slug)

    const solDir = join(base, 'solution')
    writeFiles(solDir, a.solution, a.tests)
    const solutionPasses = runVitest(solDir)

    const startDir = join(base, 'starter')
    writeFiles(startDir, a.starter, a.tests)
    const starterFails = !runVitest(startDir)

    results.push({
      name: `${track.slug}/${a.slug}`,
      solutionPasses,
      starterFails,
    })
  }
}

rmSync(workRoot, { recursive: true, force: true })

let ok = true
console.log('\nAssignment content verification\n')
for (const r of results) {
  const sol = r.solutionPasses ? '✓' : '✗'
  const start = r.starterFails ? '✓' : '✗'
  const pass = r.solutionPasses && r.starterFails
  if (!pass) ok = false
  console.log(
    `${pass ? '✓' : '✗'}  ${r.name.padEnd(34)} solution-passes:${sol}  starter-fails:${start}`,
  )
}
console.log(
  `\n${results.length} assignments, ${results.filter((r) => r.solutionPasses && r.starterFails).length} valid\n`,
)

process.exit(ok ? 0 : 1)

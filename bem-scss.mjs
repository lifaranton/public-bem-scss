#!/usr/bin/env node
// bem-scss — classes from markup (HTML, Vue, React/JSX) → SCSS nested by BEM.
// https://github.com/lifaranton/public-bem-scss
//
//   bem-scss              clipboard → clipboard (bind it to a hotkey in your IDE)
//   bem-scss file.vue     file → stdout;   bem-scss - < file   — same from stdin
//
// Naming: block__element--modifier
//   .block { &--mod {} &__element { &--mod {} } }
// Classes are taken from class="…" / className="…" and from quoted strings
// inside :class / v-bind:class / className={…}.

import { execFileSync } from 'node:child_process'
import { platform } from 'node:os'
import { readFileSync, existsSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const VERSION = '1.1.0'
const isWin = platform() === 'win32'
const isWsl = platform() === 'linux' && existsSync('/proc/sys/fs/binfmt_misc/WSLInterop')

function readClipboard() {
  if (platform() === 'darwin') return execFileSync('pbpaste', { encoding: 'utf8' })
  if (isWin || isWsl) {
    return execFileSync('powershell.exe', ['-NoProfile', '-Command', 'Get-Clipboard -Raw'], { encoding: 'utf8' })
  }
  return execFileSync('xclip', ['-selection', 'clipboard', '-o'], { encoding: 'utf8' })
}

function writeClipboard(text) {
  if (platform() === 'darwin') return execFileSync('pbcopy', { input: text })
  if (isWin || isWsl) return execFileSync('clip.exe', { input: text.replace(/\n/g, '\r\n') })
  return execFileSync('xclip', ['-selection', 'clipboard'], { input: text })
}

// static strings inside an expression: 'a', "a", `a` (template literals with ${} are skipped)
function quotedStrings(expr) {
  return [...expr.matchAll(/'([^']*)'|"([^"]*)"|`([^`$]*)`/g)].map((s) => s[1] ?? s[2] ?? s[3])
}

// text inside {…} starting at position i (which points at "{"), braces balanced
function braced(src, i) {
  let depth = 0
  for (let j = i; j < src.length; j++) {
    if (src[j] === '{') depth++
    else if (src[j] === '}' && --depth === 0) return src.slice(i + 1, j)
  }
  return src.slice(i + 1)
}

export function extractClasses(markup) {
  const found = [] // [position, class string] — sorted later to keep document order
  // HTML / Vue: class="…" / class='…' (not :class)
  for (const m of markup.matchAll(/(?<![:\w-])class\s*=\s*(["'])([\s\S]*?)\1/g)) found.push([m.index, m[2]])
  // Vue: :class="…" / v-bind:class="…" — only quoted strings inside the expression
  for (const m of markup.matchAll(/(?::|v-bind:)class\s*=\s*"([\s\S]*?)"/g)) {
    for (const s of quotedStrings(m[1].replace(/"/g, ''))) found.push([m.index, s])
  }
  // React / JSX: className="…" / className='…'
  for (const m of markup.matchAll(/\bclassName\s*=\s*(["'])([\s\S]*?)\1/g)) found.push([m.index, m[2]])
  // React / JSX: className={…} — only quoted strings inside (clsx, ternaries, template literals)
  for (const m of markup.matchAll(/\bclassName\s*=\s*\{/g)) {
    const expr = braced(markup, m.index + m[0].length - 1)
    for (const s of quotedStrings(expr)) found.push([m.index, s])
  }

  const out = []
  for (const [, s] of found.sort((a, b) => a[0] - b[0])) {
    for (const c of s.split(/\s+/)) {
      if (/^-?[A-Za-z_][\w-]*$/.test(c) && !out.includes(c)) out.push(c)
    }
  }
  return out
}

export function buildTree(classes) {
  const blocks = new Map() // имя → { mods: [], elems: Map(имя → mods[]) }
  const block = (name) => {
    if (!blocks.has(name)) blocks.set(name, { mods: [], elems: new Map() })
    return blocks.get(name)
  }
  const push = (arr, v) => { if (!arr.includes(v)) arr.push(v) }
  for (const cls of classes) {
    const e = cls.indexOf('__')
    if (e > 0) {
      const b = block(cls.slice(0, e))
      const rest = cls.slice(e + 2)
      const m = rest.indexOf('--')
      const elem = m > 0 ? rest.slice(0, m) : rest
      if (!b.elems.has(elem)) b.elems.set(elem, [])
      if (m > 0) push(b.elems.get(elem), rest.slice(m + 2))
      continue
    }
    const m = cls.indexOf('--')
    if (m > 0) push(block(cls.slice(0, m)).mods, cls.slice(m + 2))
    else block(cls)
  }
  return blocks
}

export function renderScss(blocks, indent = '  ') {
  const rule = (sel, children, depth) => {
    const pad = indent.repeat(depth)
    if (!children.length) return `${pad}${sel} {\n${pad}}`
    return `${pad}${sel} {\n${children.join('\n\n')}\n${pad}}`
  }
  const out = []
  for (const [name, b] of blocks) {
    const kids = [
      ...b.mods.map((m) => rule(`&--${m}`, [], 1)),
      ...[...b.elems].map(([el, mods]) => rule(`&__${el}`, mods.map((m) => rule(`&--${m}`, [], 2)), 1)),
    ]
    out.push(rule(`.${name}`, kids, 0))
  }
  return out.join('\n\n') + '\n'
}

export function convert(markup) {
  return renderScss(buildTree(extractClasses(markup)))
}

// --- CLI ---
const HELP = `bem-scss — markup (HTML, Vue) → SCSS skeleton nested by BEM

Usage:
  bem-scss              read markup from clipboard, put SCSS back to clipboard
  bem-scss <file>       read file, print SCSS to stdout
  bem-scss -            read stdin, print SCSS to stdout

Options:
  -h, --help            show this help
  -v, --version         show version
`

function isMain() {
  // works when run directly, via a symlink (~/.local/bin), npm bin shim and npx
  try {
    return realpathSync(process.argv[1] ?? '') === realpathSync(fileURLToPath(import.meta.url))
  } catch {
    return false
  }
}

if (isMain()) {
  const arg = process.argv[2]
  if (arg === '-h' || arg === '--help') {
    process.stdout.write(HELP)
    process.exit(0)
  }
  if (arg === '-v' || arg === '--version') {
    console.log(VERSION)
    process.exit(0)
  }
  const toStdout = Boolean(arg) // file or "-" (stdin) → stdout; no argument → clipboard
  let input
  try {
    input = !arg ? readClipboard() : readFileSync(arg === '-' ? 0 : arg, 'utf8')
  } catch (e) {
    console.error('bem-scss: cannot read', arg ? arg : 'clipboard', '—', e.message)
    if (!arg && platform() === 'linux' && !isWsl) console.error('bem-scss: on Linux install xclip')
    process.exit(1)
  }
  const classes = extractClasses(input)
  if (!classes.length) {
    console.error('bem-scss: no classes found in markup')
    process.exit(1)
  }
  const scss = convert(input)
  if (toStdout) {
    process.stdout.write(scss)
  } else {
    writeClipboard(scss)
    console.log(`bem-scss: ${classes.length} classes → SCSS copied to clipboard\n\n${scss}`)
  }
}

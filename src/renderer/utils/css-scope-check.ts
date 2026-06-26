/**
 * Client-side CSS scope pre-flight check for component-studio uploads.
 *
 * This is a dependency-free PORT of the detection rules in landing-composer's
 * `src/composer-tools/custom-component-loader.ts` (`findCssScopeViolations`).
 * It exists so the Component Studio app can warn a user BEFORE uploading a
 * component whose CSS would be rejected by the backend's isolation gate (HTTP
 * 422). The backend remains the authoritative gate — this is convenience only.
 *
 * A custom component's stylesheet is confined to `#playground` by the editor.
 * Any selector that targets global scope (`:root` / `html` / `body` / bare
 * universal `*`) — including `:is()/:where()` wrappers and at-rule-nested
 * selectors — would escape that scope and repaint the editor's own chrome /
 * design tokens. Likewise a top-level `--custom-property` declared outside any
 * selector resolves at document scope. Both are flagged here.
 *
 * Behaviour is kept identical to the backend/frontend rules: it does NOT
 * over-reject descendant selectors like `body > .card`, nor `@keyframes` /
 * `@font-face` bodies (those "selectors" are stops/descriptors, not selectors).
 */

/**
 * At-rules whose *body* is itself a list of qualified rules — their nested
 * selectors must be checked just like top-level ones. Everything else with a
 * block (`@keyframes`, `@font-face`) is skipped: keyframe selectors
 * (`from`/`to`/`50%`) and font descriptors are NOT selectors.
 */
const NESTED_RULE_AT_RULES = new Set([
  'media',
  'supports',
  'layer',
  'container',
  'scope',
  'document',
  '-moz-document',
])

/** The single scope every uploaded custom component is confined to. */
const PLAYGROUND_SCOPE = '#playground'

export interface GlobalScopeViolation {
  selector: string
  reason: string
}

/** Advance past a quoted string starting at `start`; returns index after the closing quote. */
function scanString(input: string, start: number): number {
  const quote = input[start]
  let i = start + 1
  while (i < input.length) {
    const ch = input[i]
    if (ch === '\\') {
      i += 2
      continue
    }
    if (ch === quote) return i + 1
    i++
  }
  return input.length
}

/** Return the index just past a CSS comment that begins at `start`. */
function scanComment(input: string, start: number): number {
  const end = input.indexOf('*/', start + 2)
  return end === -1 ? input.length : end + 2
}

/** Index of the matching closer for an opener (`{`/`(`/`[`) at `openIdx`, comment/string aware. */
function findMatching(input: string, openIdx: number, open: string, close: string): number {
  let depth = 0
  let i = openIdx
  while (i < input.length) {
    const ch = input[i]
    if (ch === '/' && input[i + 1] === '*') {
      i = scanComment(input, i)
      continue
    }
    if (ch === '"' || ch === "'") {
      i = scanString(input, i)
      continue
    }
    if (ch === open) depth++
    else if (ch === close) {
      depth--
      if (depth === 0) return i
    }
    i++
  }
  return input.length
}

/** Split `input` on top-level `delimiter`, ignoring delimiters inside (), [], strings, comments. */
function splitTopLevel(input: string, delimiter: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''
  let i = 0
  while (i < input.length) {
    const ch = input[i]
    if (ch === '/' && input[i + 1] === '*') {
      const stop = scanComment(input, i)
      current += input.slice(i, stop)
      i = stop
      continue
    }
    if (ch === '"' || ch === "'") {
      const stop = scanString(input, i)
      current += input.slice(i, stop)
      i = stop
      continue
    }
    if (ch === '(' || ch === '[') depth++
    else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1)
    if (ch === delimiter && depth === 0) {
      parts.push(current)
      current = ''
      i++
      continue
    }
    current += ch
    i++
  }
  parts.push(current)
  return parts
}

/** Remove every pseudo-class / pseudo-element segment (`:x`, `::x`, `:x(...)`) from a compound. */
function stripPseudos(compound: string): string {
  let out = ''
  let i = 0
  while (i < compound.length) {
    if (compound[i] === ':') {
      i++
      if (compound[i] === ':') i++
      while (i < compound.length && /[\w-]/.test(compound[i])) i++
      if (compound[i] === '(') {
        i = findMatching(compound, i, '(', ')') + 1
      }
      continue
    }
    out += compound[i]
    i++
  }
  return out
}

/** A compound is "bare universal" when, ignoring pseudo-classes, it is just `*`. */
function isBareUniversal(compound: string): boolean {
  return stripPseudos(compound).trim() === '*'
}

/**
 * Does a single compound selector target global scope (`:root` / `html` /
 * `body` / universal `*`)? Unwraps `:is()/:where()/:matches()/:any()` and
 * tests each inner branch — if any branch targets global, so does the whole.
 */
function isGlobalCompound(compound: string): boolean {
  const c = compound.trim()
  if (!c) return false

  const wrap = c.match(/:(?:where|is|matches|any|-moz-any|-webkit-any)\(/i)
  if (wrap && wrap.index !== undefined) {
    const parenStart = wrap.index + wrap[0].length - 1
    const parenEnd = findMatching(c, parenStart, '(', ')')
    const inner = c.slice(parenStart + 1, parenEnd)
    for (const branch of splitTopLevel(inner, ',')) {
      if (isGlobalSelector(branch)) return true
    }
    const rest = c.slice(0, wrap.index) + c.slice(parenEnd + 1)
    return rest.trim() ? isGlobalCompound(rest) : false
  }

  const typeMatch = c.match(/^([a-zA-Z][\w-]*)/)
  const type = typeMatch ? typeMatch[1].toLowerCase() : ''
  if (type === 'html' || type === 'body') return true
  if (/:root\b/i.test(c)) return true
  if (isBareUniversal(c)) return true
  return false
}

/** Last compound of a complex selector (its subject), split on top-level combinators. */
function getSubjectCompound(selector: string): string {
  let depth = 0
  let current = ''
  let last = ''
  let i = 0
  const flush = () => {
    if (current.trim()) last = current.trim()
    current = ''
  }
  while (i < selector.length) {
    const ch = selector[i]
    if (ch === '/' && selector[i + 1] === '*') {
      const stop = scanComment(selector, i)
      current += selector.slice(i, stop)
      i = stop
      continue
    }
    if (ch === '"' || ch === "'") {
      const stop = scanString(selector, i)
      current += selector.slice(i, stop)
      i = stop
      continue
    }
    if (ch === '(' || ch === '[') {
      depth++
      current += ch
      i++
      continue
    }
    if (ch === ')' || ch === ']') {
      depth = Math.max(0, depth - 1)
      current += ch
      i++
      continue
    }
    if (depth === 0 && (ch === '>' || ch === '+' || ch === '~' || /\s/.test(ch))) {
      flush()
      i++
      continue
    }
    current += ch
    i++
  }
  flush()
  return last
}

/** A full selector targets global scope when its subject (last compound) does. */
function isGlobalSelector(selector: string): boolean {
  return isGlobalCompound(getSubjectCompound(selector))
}

/** Record any global-scope selector in a comma-separated selector list. */
function checkSelectorList(selectorList: string, violations: GlobalScopeViolation[]): void {
  for (const raw of splitTopLevel(selectorList, ',')) {
    const sel = raw.trim()
    if (!sel) continue
    // Already-scoped selectors are fine and pass through untouched.
    if (sel.startsWith(PLAYGROUND_SCOPE)) continue
    if (isGlobalSelector(sel)) {
      violations.push({
        selector: sel,
        reason:
          'targets global scope (:root/html/body/*); its declarations (including --custom-properties) would escape #playground and override the editor tool styles',
      })
    }
  }
}

/** Inspect a single `prelude { inner }` rule, collecting violations. */
function checkRule(prelude: string, inner: string, violations: GlobalScopeViolation[]): void {
  const trimmed = prelude.trim()

  if (trimmed.startsWith('@')) {
    const atName = (trimmed.match(/^@([\w-]+)/)?.[1] || '').toLowerCase()
    if (NESTED_RULE_AT_RULES.has(atName)) {
      // Body is a rule list — recurse so nested selectors get checked.
      checkRuleList(inner, violations)
    }
    // @keyframes / @font-face / unknown block at-rules: their inner "selectors"
    // are keyframe stops or descriptors, not real selectors — skip.
    return
  }

  // Qualified rule. Native-nested rules inside are already confined by their
  // scoped parent, so only the prelude's own selector list is checked.
  checkSelectorList(trimmed, violations)
}

/**
 * Walk a rule list (top-level stylesheet or the body of a conditional group
 * at-rule). Global-scope selectors and stray top-level custom-property
 * declarations (which would leak to document scope) are recorded.
 */
function checkRuleList(css: string, violations: GlobalScopeViolation[]): void {
  let buffer = ''
  let i = 0
  const len = css.length
  while (i < len) {
    const ch = css[i]
    if (ch === '/' && css[i + 1] === '*') {
      const stop = scanComment(css, i)
      buffer += css.slice(i, stop)
      i = stop
      continue
    }
    if (ch === '"' || ch === "'") {
      const stop = scanString(css, i)
      buffer += css.slice(i, stop)
      i = stop
      continue
    }
    if (ch === '{') {
      const close = findMatching(css, i, '{', '}')
      const inner = css.slice(i + 1, close)
      checkRule(buffer, inner, violations)
      buffer = ''
      i = close + 1
      continue
    }
    if (ch === ';') {
      const stmt = buffer + ';'
      buffer = ''
      const t = stmt.trim()
      if (t.startsWith('--')) {
        // A custom property declared outside any selector resolves at document
        // scope — it would apply above the canvas.
        violations.push({
          selector: t,
          reason:
            'custom property declared outside any selector — would apply above #playground and override the editor tool variables',
        })
      }
      // Other at-rule statements (@import/@charset/@namespace/@layer name;) are fine.
      i++
      continue
    }
    buffer += ch
    i++
  }
}

/**
 * Detect every selector / declaration in `css` that would escape the
 * playground scope. Returns an empty array for clean stylesheets.
 *
 * Mirrors landing-composer's `findCssScopeViolations` rule set exactly so the
 * client pre-flight reasons identically to the backend gate.
 */
export function findGlobalScopeViolations(css: string): GlobalScopeViolation[] {
  const violations: GlobalScopeViolation[] = []
  if (!css || !css.trim()) return violations
  checkRuleList(css, violations)
  return violations
}

/**
 * Decode the base64 styles payload produced by the builder (it arrives in the
 * renderer as a base64 string over IPC) back into CSS text, then run the
 * global-scope check. Safe on `undefined`/empty input (returns no violations).
 */
export function findStyleViolationsFromBase64(stylesBase64?: string | null): GlobalScopeViolation[] {
  if (!stylesBase64) return []
  let css: string
  try {
    const binary = atob(stylesBase64)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    css = new TextDecoder('utf-8').decode(bytes)
  } catch {
    // If it is not valid base64 (e.g. already-plain CSS), check it as-is.
    css = stylesBase64
  }
  return findGlobalScopeViolations(css)
}

/**
 * Build a single human-readable error message from a violation list, naming the
 * offending selector(s). Returns "" when there are no violations.
 */
export function formatScopeViolationMessage(violations: GlobalScopeViolation[]): string {
  if (violations.length === 0) return ''
  const offenders = violations
    .map((v) => `"${v.selector.length > 80 ? v.selector.slice(0, 77) + '…' : v.selector}"`)
    .join(', ')
  return (
    `CSS rejected: custom components may not modify global or tool styles ` +
    `(:root, html, body, *, or global CSS variables). ` +
    `Offending selector(s): ${offenders}. ` +
    `Scope your styles to the component's own class instead.`
  )
}

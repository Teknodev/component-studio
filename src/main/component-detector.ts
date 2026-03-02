import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const COMPONENT_EXTENSIONS = ['.tsx', '.jsx']

const IMPORT_PATTERNS = [
  /@blinkpage\/composer-tools/,
  /from\s+['"][^'"]*EditorComponent['"]/,
]

const EXTENDS_PATTERN =
  /extends\s+(Component|Base\w+|Testimonials|Team|LogoClouds|Location)\b/

export interface DetectedComponent {
  name: string
  filePath: string
  relativePath: string
}

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.component-studio', 'out', '.next', '.cache'])

function isComponentFile(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const hasImport = IMPORT_PATTERNS.some((p) => p.test(content))
    const hasExtends = EXTENDS_PATTERN.test(content)
    return hasImport && hasExtends
  } catch {
    return false
  }
}

export function detectComponents(folderPath: string): DetectedComponent[] {
  const components: DetectedComponent[] = []

  function scan(dir: string): void {
    let entries: string[]
    try {
      entries = readdirSync(dir)
    } catch {
      return
    }

    for (const entry of entries) {
      if (SKIP_DIRS.has(entry) || entry.startsWith('.')) continue

      const fullPath = join(dir, entry)
      let st
      try {
        st = statSync(fullPath)
      } catch {
        continue
      }

      if (st.isDirectory()) {
        scan(fullPath)
      } else if (st.isFile() && COMPONENT_EXTENSIONS.includes(extname(entry))) {
        if (isComponentFile(fullPath)) {
          const relativePath = fullPath.slice(folderPath.length).replace(/^[/\\]/, '')
          const name = entry.replace(extname(entry), '')
          components.push({ name, filePath: fullPath, relativePath })
        }
      }
    }
  }

  scan(folderPath)
  console.log(`[ComponentDetector] Found ${components.length} components in ${folderPath}`)
  return components
}

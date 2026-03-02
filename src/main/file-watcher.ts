import { watch, type FSWatcher } from 'chokidar'
import { readdirSync, statSync } from 'fs'
import { join, basename } from 'path'

interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileTreeNode[]
}

const IGNORED = ['node_modules', '.git', 'dist', 'out', '.DS_Store', '.next', '.cache']

export class FileWatcher {
  private watcher: FSWatcher | null = null
  private currentPath: string | null = null
  private debounceTimer: NodeJS.Timeout | null = null

  buildTree(dirPath: string): FileTreeNode[] {
    try {
      const entries = readdirSync(dirPath)
      const nodes: FileTreeNode[] = []

      for (const entry of entries) {
        if (IGNORED.includes(entry)) continue
        const fullPath = join(dirPath, entry)
        try {
          const stat = statSync(fullPath)
          if (stat.isDirectory()) {
            nodes.push({
              name: entry,
              path: fullPath,
              type: 'directory',
              children: this.buildTree(fullPath)
            })
          } else {
            nodes.push({
              name: entry,
              path: fullPath,
              type: 'file'
            })
          }
        } catch {
          // skip inaccessible entries
        }
      }

      return nodes.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
        return a.name.localeCompare(b.name)
      })
    } catch {
      return []
    }
  }

  start(dirPath: string, onChange: (tree: FileTreeNode[]) => void) {
    this.stop()
    this.currentPath = dirPath

    this.watcher = watch(dirPath, {
      ignored: (path: string) => {
        const name = basename(path)
        return IGNORED.includes(name)
      },
      persistent: true,
      ignoreInitial: true,
      depth: 10
    })

    const debouncedUpdate = () => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        if (this.currentPath) {
          onChange(this.buildTree(this.currentPath))
        }
      }, 300)
    }

    this.watcher
      .on('add', debouncedUpdate)
      .on('unlink', debouncedUpdate)
      .on('addDir', debouncedUpdate)
      .on('unlinkDir', debouncedUpdate)
  }

  stop() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }
    this.currentPath = null
  }
}

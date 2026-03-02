/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_API_URL: string
  readonly RENDERER_VITE_WEB_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}

interface BuildResult {
  name: string
  bundle: string
  styles: string | null
}

interface Window {
  electronAPI: {
    auth: {
      openLoginInBrowser: (webUrl: string) => void
      onToken: (callback: (token: string) => void) => () => void
    }
    projects: {
      getLinkedFolder: (projectId: string) => Promise<string | null>
      selectFolder: (projectId: string) => Promise<string | null>
      openInEditor: (folderPath: string) => void
    }
    files: {
      getFileTree: (folderPath: string) => Promise<FileTreeNode[]>
      onFileTreeUpdate: (callback: (tree: FileTreeNode[]) => void) => () => void
      watchFolder: (folderPath: string) => void
      unwatchFolder: () => void
      readFile: (filePath: string) => Promise<string>
      detectComponents: (folderPath: string) => Promise<DetectedComponent[]>
    }
    devServer: {
      start: (config: DevServerConfig) => Promise<{ port: number }>
      stop: () => Promise<void>
      onLog: (callback: (log: string) => void) => () => void
    }
    builder: {
      buildComponent: (config: {
        componentDir: string
        componentRelativePath: string
      }) => Promise<BuildResult>
      buildMultiple: (config: {
        componentDir: string
        componentRelativePaths: string[]
      }) => Promise<BuildResult[]>
      onProgress: (callback: (progress: {
        current: number
        total: number
        name: string
      }) => void) => () => void
    }
  }
}

interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileTreeNode[]
  isComponent?: boolean
}

interface DevServerConfig {
  componentDir: string
  componentEntry: string
}

interface DetectedComponent {
  name: string
  filePath: string
  relativePath: string
}

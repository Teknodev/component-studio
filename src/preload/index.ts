import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  auth: {
    openLoginInBrowser: (webUrl: string) => {
      ipcRenderer.invoke('auth:open-login', webUrl)
    },
    onToken: (callback: (token: string) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, token: string) => callback(token)
      ipcRenderer.on('auth:token', handler)
      return () => ipcRenderer.removeListener('auth:token', handler)
    }
  },

  projects: {
    getLinkedFolder: (projectId: string): Promise<string | null> => {
      return ipcRenderer.invoke('projects:get-linked-folder', projectId)
    },
    selectFolder: (projectId: string): Promise<string | null> => {
      return ipcRenderer.invoke('projects:select-folder', projectId)
    },
    openInEditor: (folderPath: string) => {
      ipcRenderer.send('projects:open-in-editor', folderPath)
    }
  },

  files: {
    getFileTree: (folderPath: string): Promise<FileTreeNode[]> => {
      return ipcRenderer.invoke('files:get-tree', folderPath)
    },
    onFileTreeUpdate: (callback: (tree: FileTreeNode[]) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, tree: FileTreeNode[]) => callback(tree)
      ipcRenderer.on('files:tree-update', handler)
      return () => ipcRenderer.removeListener('files:tree-update', handler)
    },
    watchFolder: (folderPath: string) => {
      ipcRenderer.send('files:watch', folderPath)
    },
    unwatchFolder: () => {
      ipcRenderer.send('files:unwatch')
    },
    readFile: (filePath: string): Promise<string> => {
      return ipcRenderer.invoke('files:read', filePath)
    },
    detectComponents: (folderPath: string): Promise<DetectedComponent[]> => {
      return ipcRenderer.invoke('files:detect-components', folderPath)
    }
  },

  devServer: {
    start: (config: { componentDir: string; componentEntry: string }): Promise<{ port: number }> => {
      return ipcRenderer.invoke('dev-server:start', config)
    },
    selectComponent: (componentEntry: string): Promise<void> => {
      return ipcRenderer.invoke('dev-server:select-component', componentEntry)
    },
    stop: (): Promise<void> => {
      return ipcRenderer.invoke('dev-server:stop')
    },
    onLog: (callback: (log: string) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, log: string) => callback(log)
      ipcRenderer.on('dev-server:log', handler)
      return () => ipcRenderer.removeListener('dev-server:log', handler)
    }
  },

  builder: {
    buildComponent: (config: {
      componentDir: string
      componentRelativePath: string
    }): Promise<BuildResult> => {
      return ipcRenderer.invoke('builder:build-component', config)
    },
    buildMultiple: (config: {
      componentDir: string
      componentRelativePaths: string[]
    }): Promise<BuildResult[]> => {
      return ipcRenderer.invoke('builder:build-multiple', config)
    },
    onProgress: (callback: (progress: { current: number; total: number; name: string }) => void) => {
      const handler = (
        _event: Electron.IpcRendererEvent,
        progress: { current: number; total: number; name: string }
      ) => callback(progress)
      ipcRenderer.on('builder:progress', handler)
      return () => ipcRenderer.removeListener('builder:progress', handler)
    }
  }
})

interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileTreeNode[]
}

interface DetectedComponent {
  name: string
  filePath: string
  relativePath: string
}

interface BuildResult {
  name: string
  bundle: string
  styles: string | null
}

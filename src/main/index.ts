import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { join } from 'path'
import Store from 'electron-store'
import { FileWatcher } from './file-watcher'
import { DevServerManager } from './dev-server'
import { ComponentBuilder } from './component-builder'
import { AuthCallbackServer } from './auth-server'
import { detectComponents } from './component-detector'

const store = new Store<{
  linkedFolders: Record<string, string>
}>({ defaults: { linkedFolders: {} } })

let mainWindow: BrowserWindow | null = null
const fileWatcher = new FileWatcher()
const devServer = new DevServerManager()
const componentBuilder = new ComponentBuilder()
const authServer = new AuthCallbackServer()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.whenReady().then(createWindow)
}

app.on('window-all-closed', () => {
  fileWatcher.stop()
  devServer.stop()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// ---- IPC Handlers ----

// Auth
ipcMain.handle('auth:open-login', async (_event, webUrl: string) => {
  console.log(`[Main] auth:open-login called with webUrl=${webUrl}`)
  const port = await authServer.start((token: string) => {
    console.log(`[Main] Token received from auth server, forwarding to renderer`)
    mainWindow?.webContents.send('auth:token', token)
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  const callbackUrl = encodeURIComponent(`http://localhost:${port}/auth/callback`)
  const loginUrl = `${webUrl}/authentication?redirect=${callbackUrl}`
  console.log(`[Main] Opening browser: ${loginUrl}`)
  shell.openExternal(loginUrl)
})

// Projects: linked folder management
ipcMain.handle('projects:get-linked-folder', (_event, projectId: string) => {
  const folders = store.get('linkedFolders')
  return folders[projectId] || null
})

ipcMain.handle('projects:select-folder', async (_event, projectId: string) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select component project folder'
  })
  if (result.canceled || result.filePaths.length === 0) return null
  const folderPath = result.filePaths[0]
  const folders = store.get('linkedFolders')
  folders[projectId] = folderPath
  store.set('linkedFolders', folders)
  return folderPath
})

ipcMain.on('projects:open-in-editor', (_event, folderPath: string) => {
  shell.openPath(folderPath)
})

// Files: file tree + watching
ipcMain.handle('files:get-tree', async (_event, folderPath: string) => {
  return fileWatcher.buildTree(folderPath)
})

ipcMain.on('files:watch', (_event, folderPath: string) => {
  fileWatcher.start(folderPath, (tree) => {
    mainWindow?.webContents.send('files:tree-update', tree)
  })
})

ipcMain.on('files:unwatch', () => {
  fileWatcher.stop()
})

ipcMain.handle('files:read', async (_event, filePath: string) => {
  const fs = await import('fs/promises')
  return fs.readFile(filePath, 'utf-8')
})

ipcMain.handle('files:detect-components', (_event, folderPath: string) => {
  return detectComponents(folderPath)
})

// Dev server
ipcMain.handle('dev-server:start', async (_event, config: { componentDir: string; componentEntry: string }) => {
  const port = await devServer.start(config, (log: string) => {
    mainWindow?.webContents.send('dev-server:log', log)
  })
  return { port }
})

ipcMain.handle('dev-server:select-component', (_event, componentEntry: string) => {
  devServer.selectComponent(componentEntry)
})

ipcMain.handle('dev-server:stop', async () => {
  await devServer.stop()
})

// Component builder
ipcMain.handle(
  'builder:build-component',
  async (_event, config: { componentDir: string; componentRelativePath: string }) => {
    const result = await componentBuilder.build(config.componentDir, config.componentRelativePath)
    return {
      name: result.name,
      bundle: result.bundle.toString('base64'),
      styles: result.styles ? result.styles.toString('base64') : null
    }
  }
)

ipcMain.handle(
  'builder:build-multiple',
  async (
    _event,
    config: { componentDir: string; componentRelativePaths: string[] }
  ) => {
    const results = await componentBuilder.buildMultiple(
      config.componentDir,
      config.componentRelativePaths,
      (current, total, name) => {
        mainWindow?.webContents.send('builder:progress', { current, total, name })
      }
    )
    return results.map((r) => ({
      name: r.name,
      bundle: r.bundle.toString('base64'),
      styles: r.styles ? r.styles.toString('base64') : null
    }))
  }
)

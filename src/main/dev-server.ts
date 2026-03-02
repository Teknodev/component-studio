import { ChildProcess } from 'child_process'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import net from 'net'

interface DevServerConfig {
  componentDir: string
  componentEntry: string
}

export class DevServerManager {
  private process: ChildProcess | null = null
  private port: number = 0
  private currentComponentDir: string | null = null

  private async findFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
      const server = net.createServer()
      server.unref()
      server.on('error', reject)
      server.listen(0, () => {
        const addr = server.address()
        if (addr && typeof addr === 'object') {
          const port = addr.port
          server.close(() => resolve(port))
        } else {
          reject(new Error('Could not determine port'))
        }
      })
    })
  }

  private generatePreviewHtml(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Component Preview</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --composer-font-family: var(--theme-font-family, 'Inter, sans-serif');
      --composer-font-size-md: 16px;
      --composer-font-size-sm: 14px;
      --composer-html-background: var(--theme-background, #ffffff);
      --composer-primary-color: var(--theme-primary, #4f46e5);
      --composer-secondary-color: var(--theme-secondary, #7c3aed);
      --composer-tertiary-color: var(--theme-tertiary, #ec4899);
      --composer-font-color-primary: var(--theme-font-color-primary, #1E293B);
      --composer-font-color-secondary: var(--theme-font-color-secondary, #ffffff);
      --composer-content-width: var(--theme-content-width, 1200px);
      --composer-border-radius-xs: 4px;
      --composer-border-radius-sm: var(--theme-border-radius, 8px);
      --composer-border-radius-xl: 24px;
      --composer-gap-xs: 4px;
      --composer-gap-sm: 8px;
      --composer-gap-md: 16px;
      --composer-gap-lg: 24px;
      --composer-gap-xl: 48px;
      --composer-overlay-color: rgba(0, 0, 0, 0.5);
      --composer-content-alignment: center;
      --composer-view-type: colorful;
      --composer-subtitle-type: none;
    }
    body {
      font-family: var(--composer-font-family);
      background: var(--composer-html-background);
      color: var(--composer-font-color-primary);
    }
  </style>
</head>
<body>
  <div id="preview-root"></div>
  <script type="module" src="./main.jsx"></script>
</body>
</html>`
  }

  private generateEntryModule(componentEntry: string): string {
    return `import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

if (!window.__previewRoot) {
  window.__previewRoot = createRoot(document.getElementById('preview-root'));
}
const root = window.__previewRoot;

async function loadComponent() {
  try {
    const mod = await import('/../${componentEntry}');
    const Comp = mod.default || mod;
    root.render(createElement(Comp));
  } catch (e) {
    root.render(createElement('div', {
      style: { padding: '2rem', color: '#ef4444', fontFamily: 'monospace' }
    }, 'Error loading component: ' + e.message));
  }
}

loadComponent();

function applyTheme(payload) {
  const { colors, fonts, environments } = payload;
  const el = document.documentElement;
  if (colors) {
    Object.entries(colors).forEach(([key, value]) => {
      el.style.setProperty('--theme-' + key.replace(/_/g, '-'), value);
    });
    if (colors.primary) el.style.setProperty('--composer-primary-color', colors.primary);
    if (colors.secondary) el.style.setProperty('--composer-secondary-color', colors.secondary);
    if (colors.tertiary) el.style.setProperty('--composer-tertiary-color', colors.tertiary);
    if (colors.background) el.style.setProperty('--composer-html-background', colors.background);
    if (colors.font_color_primary) el.style.setProperty('--composer-font-color-primary', colors.font_color_primary);
    if (colors.font_color_secondary) el.style.setProperty('--composer-font-color-secondary', colors.font_color_secondary);
  }
  if (fonts?.family) {
    el.style.setProperty('--theme-font-family', fonts.family);
    el.style.setProperty('--composer-font-family', fonts.family);
  }
  if (environments) {
    if (environments.border_radius !== undefined) {
      el.style.setProperty('--theme-border-radius', environments.border_radius + 'px');
      el.style.setProperty('--composer-border-radius-sm', environments.border_radius + 'px');
    }
    if (environments.content_width) {
      el.style.setProperty('--theme-content-width', environments.content_width.width + 'px');
      el.style.setProperty('--composer-content-width', environments.content_width.width + 'px');
    }
    if (environments.box_shadow) {
      const s = environments.box_shadow;
      el.style.setProperty(
        '--theme-box-shadow',
        s.x + 'px ' + s.y + 'px ' + s.blur + 'px ' + s.spread + 'px ' + s.color
      );
    }
  }
}

window.addEventListener('message', (event) => {
  if (event.data?.type === 'THEME_UPDATE') {
    applyTheme(event.data.payload);
  }
});

if (import.meta.hot) {
  import.meta.hot.accept();
}
`
  }

  private generateViteConfig(port: number, componentDir: string): string {
    const escapedDir = componentDir.replace(/\\/g, '/')
    const escapedTempDir = join(componentDir, '.component-studio').replace(/\\/g, '/')
    return `
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '${escapedTempDir}',
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: ${port},
    strictPort: true,
    hmr: { overlay: true },
    fs: {
      allow: ['${escapedDir}']
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  resolve: {
    alias: {
      '@blinkpage/composer-tools': path.resolve('${escapedDir}', 'node_modules/@blinkpage/composer-tools'),
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
`
  }

  private ensureTempDir(componentDir: string): string {
    const tempDir = join(componentDir, '.component-studio')
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true })
    }
    return tempDir
  }

  selectComponent(componentEntry: string): void {
    if (!this.currentComponentDir) {
      throw new Error('Dev server is not running')
    }
    const tempDir = this.ensureTempDir(this.currentComponentDir)
    writeFileSync(join(tempDir, 'main.jsx'), this.generateEntryModule(componentEntry))
  }

  isRunningFor(componentDir: string): boolean {
    return this.process !== null && this.currentComponentDir === componentDir
  }

  getPort(): number {
    return this.port
  }

  async start(
    config: DevServerConfig,
    onLog: (log: string) => void
  ): Promise<number> {
    if (this.isRunningFor(config.componentDir)) {
      this.selectComponent(config.componentEntry)
      return this.port
    }

    await this.stop()

    this.port = await this.findFreePort()
    this.currentComponentDir = config.componentDir
    const tempDir = this.ensureTempDir(config.componentDir)

    writeFileSync(join(tempDir, 'index.html'), this.generatePreviewHtml())
    writeFileSync(join(tempDir, 'main.jsx'), this.generateEntryModule(config.componentEntry))
    writeFileSync(join(tempDir, 'vite.config.mjs'), this.generateViteConfig(this.port, config.componentDir))

    return new Promise((resolve, reject) => {
      const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx'
      const { spawn } = require('child_process') as typeof import('child_process')

      const proc = spawn(
        npxPath,
        ['vite', '--config', join(tempDir, 'vite.config.mjs')],
        {
          cwd: config.componentDir,
          env: { ...process.env, FORCE_COLOR: '0' },
          stdio: ['pipe', 'pipe', 'pipe']
        }
      )
      this.process = proc

      let resolved = false

      proc.stdout?.on('data', (data: Buffer) => {
        const line = data.toString()
        onLog(line)
        if (!resolved && line.includes('Local:')) {
          resolved = true
          resolve(this.port)
        }
      })

      proc.stderr?.on('data', (data: Buffer) => {
        onLog(data.toString())
      })

      proc.on('error', (err) => {
        if (!resolved) {
          resolved = true
          reject(err)
        }
      })

      proc.on('exit', (code) => {
        if (!resolved) {
          resolved = true
          reject(new Error(`Vite exited with code ${code}`))
        }
        if (this.process === proc) {
          this.process = null
          this.currentComponentDir = null
        }
      })

      setTimeout(() => {
        if (!resolved) {
          resolved = true
          resolve(this.port)
        }
      }, 30000)
    })
  }

  async stop(): Promise<void> {
    if (this.process) {
      this.process.kill('SIGTERM')
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          this.process?.kill('SIGKILL')
          resolve()
        }, 5000)
        this.process?.on('exit', () => {
          clearTimeout(timeout)
          resolve()
        })
      })
      this.process = null
      this.currentComponentDir = null
    }
  }
}

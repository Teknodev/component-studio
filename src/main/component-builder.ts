import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync, readFileSync, rmSync } from 'fs'
import { spawn } from 'child_process'

interface BuildResult {
  name: string
  bundle: Buffer
  styles: Buffer | null
}

export class ComponentBuilder {
  private getBuildDir(componentDir: string): string {
    return join(componentDir, '.component-studio', '_build')
  }

  private generateEntryFile(componentRelativePath: string, componentName: string): string {
    const importPath = '../../' + componentRelativePath.replace(/\\/g, '/')
    return `import React from 'react';
import Component from '${importPath}';
window.__CUSTOM_COMPONENTS__ = window.__CUSTOM_COMPONENTS__ || {};
window.__CUSTOM_COMPONENTS__["${componentName}"] = Component;
export default Component;
`
  }

  private generateViteConfig(buildDir: string, componentDir: string): string {
    const escapedDir = componentDir.replace(/\\/g, '/')
    const escapedBuildDir = buildDir.replace(/\\/g, '/')
    return `
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '${escapedBuildDir}',
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  build: {
    outDir: '${escapedBuildDir}/dist',
    emptyOutDir: true,
    lib: {
      entry: '${escapedBuildDir}/entry.jsx',
      name: '__customComponent',
      formats: ['iife'],
      fileName: () => 'bundle.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@blinkpage/composer-tools'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          '@blinkpage/composer-tools': 'ComposerTools',
        },
        assetFileNames: 'styles.css',
      },
    },
    cssCodeSplit: false,
    minify: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: {
      '@blinkpage/composer-tools': path.resolve('${escapedDir}', 'node_modules/@blinkpage/composer-tools'),
    },
  },
});
`
  }

  private runViteBuild(configPath: string, componentDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx'
      const proc = spawn(npxPath, ['vite', 'build', '--config', configPath], {
        cwd: componentDir,
        env: { ...process.env, FORCE_COLOR: '0' },
        stdio: ['pipe', 'pipe', 'pipe']
      })

      let stderr = ''
      proc.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString()
      })

      proc.on('error', (err) => reject(err))
      proc.on('exit', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Vite build exited with code ${code}: ${stderr}`))
        }
      })
    })
  }

  async build(componentDir: string, componentRelativePath: string): Promise<BuildResult> {
    const buildDir = this.getBuildDir(componentDir)

    if (!existsSync(buildDir)) {
      mkdirSync(buildDir, { recursive: true })
    }

    const name = await this.extractComponentName(componentDir, componentRelativePath)

    const entryContent = this.generateEntryFile(componentRelativePath, name)
    writeFileSync(join(buildDir, 'entry.jsx'), entryContent)

    const viteConfigPath = join(buildDir, 'vite.config.mjs')
    writeFileSync(viteConfigPath, this.generateViteConfig(buildDir, componentDir))

    try {
      await this.runViteBuild(viteConfigPath, componentDir)

      const distDir = join(buildDir, 'dist')

      const bundlePath = join(distDir, 'bundle.js')
      if (!existsSync(bundlePath)) {
        throw new Error('Build succeeded but bundle.js was not generated')
      }
      const bundleBuffer = readFileSync(bundlePath)

      const stylesPath = join(distDir, 'styles.css')
      const stylesBuffer = existsSync(stylesPath) ? readFileSync(stylesPath) : null

      return { name, bundle: bundleBuffer, styles: stylesBuffer }
    } finally {
      try {
        rmSync(buildDir, { recursive: true, force: true })
      } catch {
        // cleanup is best-effort
      }
    }
  }

  private async extractComponentName(
    componentDir: string,
    componentRelativePath: string
  ): Promise<string> {
    const filePath = join(componentDir, componentRelativePath)
    try {
      const content = readFileSync(filePath, 'utf-8')

      const classMatch = content.match(/class\s+(\w+)\s+extends/)
      if (classMatch) return classMatch[1]

      const staticNameMatch = content.match(
        /static\s+getName\s*\(\s*\)\s*(?::\s*string\s*)?\{\s*return\s+['"]([^'"]+)['"]/
      )
      if (staticNameMatch) return staticNameMatch[1]

      const parts = componentRelativePath.split('/')
      return parts[parts.length - 1].replace(/\.(tsx|jsx)$/, '')
    } catch {
      const parts = componentRelativePath.split('/')
      return parts[parts.length - 1].replace(/\.(tsx|jsx)$/, '')
    }
  }

  async buildMultiple(
    componentDir: string,
    componentRelativePaths: string[],
    onProgress?: (current: number, total: number, name: string) => void
  ): Promise<BuildResult[]> {
    const results: BuildResult[] = []
    const total = componentRelativePaths.length

    for (let i = 0; i < total; i++) {
      const relPath = componentRelativePaths[i]
      onProgress?.(i + 1, total, relPath)
      const result = await this.build(componentDir, relPath)
      results.push(result)
    }

    return results
  }
}

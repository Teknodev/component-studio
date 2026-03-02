import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useThemeConfig } from '../contexts/ThemeConfigContext'
import { useDevServer } from '../hooks/useDevServer'
import { useProject } from '../hooks/useProjects'
import { api } from '../services/api'
import DashboardTemplate from '../templates/dashboard-template/DashboardTemplate'
import AppHeader from '../organisms/app-header/AppHeader'
import PreviewFrame from '../organisms/preview-frame/PreviewFrame'
import ThemeOverlay from '../organisms/theme-overlay/ThemeOverlay'
import Button from '../atoms/button/Button'
import Icon from '../atoms/icon/Icon'
import styles from './PreviewPage.module.scss'

export default function PreviewPage() {
  const { projectId, componentPath } = useParams<{ projectId: string; componentPath: string }>()
  const navigate = useNavigate()
  const { theme, loadFromProject } = useThemeConfig()
  const { project } = useProject(projectId)
  const { port, starting, start, stop } = useDevServer()
  const [themeOpen, setThemeOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const decodedPath = useMemo(
    () => (componentPath ? decodeURIComponent(componentPath) : ''),
    [componentPath]
  )

  useEffect(() => {
    if (project?.theme_config) {
      loadFromProject(project.theme_config as never)
    }
  }, [project, loadFromProject])

  useEffect(() => {
    if (!projectId || !decodedPath) return
    let cancelled = false

    async function startServer() {
      try {
        const folderPath = await window.electronAPI.projects.getLinkedFolder(projectId!)
        if (!folderPath || cancelled) return
        await start(folderPath, decodedPath)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to start dev server')
      }
    }

    startServer()
    return () => {
      cancelled = true
      stop()
    }
  }, [projectId, decodedPath])

  const handleSaveTheme = useCallback(async () => {
    if (!projectId) return
    try {
      await api.patchThemeConfig(projectId, theme)
    } catch {
      // silently fail for now
    }
  }, [projectId, theme])

  const componentName = decodedPath.split('/').slice(-2, -1)[0] || decodedPath

  const header = (
    <AppHeader
      left={
        <div className={styles.headerLeft}>
          <Button variant="ghost" size="sm"
            onClick={() => navigate(`/projects/${projectId}`)}
            icon={<Icon name="chevron-left" size={16} />}>
            Back
          </Button>
          <span className={styles.divider}>|</span>
          <div>
            <h1 className={styles.componentName}>{componentName}</h1>
            <p className={styles.componentPath}>{decodedPath}</p>
          </div>
        </div>
      }
      right={
        <Button
          variant={themeOpen ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setThemeOpen(true)}
          icon={<Icon name="palette" size={16} />}
        >
          Theme
        </Button>
      }
    />
  )

  return (
    <DashboardTemplate header={header}>
      <div className={styles.previewArea}>
        {error ? (
          <div className={styles.errorState}>
            <p className={styles.errorTitle}>Failed to start preview</p>
            <p className={styles.errorDetail}>{error}</p>
            <Button variant="primary" size="sm" onClick={() => navigate(`/projects/${projectId}`)}>
              Go Back
            </Button>
          </div>
        ) : (
          <PreviewFrame port={port} theme={theme} starting={starting} />
        )}
      </div>
      <ThemeOverlay open={themeOpen} onClose={() => setThemeOpen(false)} onSave={handleSaveTheme} />
    </DashboardTemplate>
  )
}

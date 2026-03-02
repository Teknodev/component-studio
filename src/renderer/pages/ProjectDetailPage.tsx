import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProject } from '../hooks/useProjects'
import { useFileTree } from '../hooks/useFileTree'
import { useDevServer } from '../hooks/useDevServer'
import { useThemeConfig } from '../contexts/ThemeConfigContext'
import { api } from '../services/api'
import SplitPanelTemplate from '../templates/split-panel-template/SplitPanelTemplate'
import AppHeader from '../organisms/app-header/AppHeader'
import FileTree from '../organisms/file-tree/FileTree'
import ComponentList, { type ComponentEntry } from '../organisms/component-list/ComponentList'
import PreviewFrame from '../organisms/preview-frame/PreviewFrame'
import ThemeOverlay from '../organisms/theme-overlay/ThemeOverlay'
import UploadPanel from '../organisms/upload-panel/UploadPanel'
import Button from '../atoms/button/Button'
import Spinner from '../atoms/spinner/Spinner'
import Icon from '../atoms/icon/Icon'
import styles from './ProjectDetailPage.module.scss'

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { project, loading: projectLoading } = useProject(projectId)
  const { theme, loadFromProject } = useThemeConfig()
  const { port, starting, start } = useDevServer()
  const [folderPath, setFolderPath] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | undefined>()
  const [selectedComponent, setSelectedComponent] = useState<ComponentEntry | null>(null)
  const [previewComponent, setPreviewComponent] = useState<string | null>(null)
  const [detectedComponents, setDetectedComponents] = useState<DetectedComponent[]>([])
  const [themeOpen, setThemeOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const { tree, loading: treeLoading } = useFileTree(folderPath)

  useEffect(() => {
    if (!projectId) return
    window.electronAPI.projects.getLinkedFolder(projectId).then((path) => {
      if (path) setFolderPath(path)
    })
  }, [projectId])

  useEffect(() => {
    if (project?.theme_config) {
      loadFromProject(project.theme_config as never)
    }
  }, [project, loadFromProject])

  useEffect(() => {
    if (!folderPath) return
    let cancelled = false
    window.electronAPI.files
      .detectComponents(folderPath)
      .then((result) => {
        if (cancelled) return
        setDetectedComponents(result)
      })
      .catch((err) => {
        console.error('[ProjectDetail] Component detection failed:', err)
      })
    return () => { cancelled = true }
  }, [folderPath])

  useEffect(() => {
    if (!previewComponent || !folderPath) return
    let cancelled = false

    async function handlePreview() {
      try {
        await start(folderPath!, previewComponent!)
      } catch (err) {
        if (!cancelled) {
          console.error('[ProjectDetail] Dev server error:', err)
        }
      }
    }

    handlePreview()
    return () => { cancelled = true }
  }, [previewComponent, folderPath])

  const componentPathSet = useMemo(
    () => new Set(detectedComponents.map((c) => c.filePath)),
    [detectedComponents]
  )

  const filteredTree = tree

  const components: ComponentEntry[] = useMemo(
    () =>
      detectedComponents.map((c) => ({
        name: c.name,
        path: c.filePath,
        entryFile: c.filePath,
        relativePath: c.relativePath
      })),
    [detectedComponents]
  )

  const handleSelectFolder = useCallback(async () => {
    if (!projectId) return
    const path = await window.electronAPI.projects.selectFolder(projectId)
    if (path) setFolderPath(path)
  }, [projectId])

  const handleOpenInEditor = useCallback(() => {
    if (folderPath) window.electronAPI.projects.openInEditor(folderPath)
  }, [folderPath])

  const openPreview = useCallback(
    (relativePath: string, comp?: ComponentEntry) => {
      if (comp) setSelectedComponent(comp)
      setPreviewComponent(relativePath)
    },
    []
  )

  const handleSelectFileNode = useCallback(
    (node: FileTreeNode) => {
      setSelectedFile(node.path)
      const isComponent = node.isComponent || componentPathSet.has(node.path)
      if (isComponent && folderPath) {
        const relativePath = node.path.replace(folderPath, '').replace(/^\//, '')
        openPreview(relativePath)
      }
    },
    [folderPath, componentPathSet, openPreview]
  )

  const handlePreviewComponent = useCallback(
    (comp: ComponentEntry) => {
      if (!folderPath) return
      const relativePath = comp.entryFile.replace(folderPath, '').replace(/^\//, '')
      openPreview(relativePath, comp)
    },
    [folderPath, openPreview]
  )

  const handleBackToComponents = useCallback(() => {
    setPreviewComponent(null)
    setSelectedComponent(null)
  }, [])

  const handleSaveTheme = useCallback(async () => {
    if (!projectId) return
    try {
      await api.patchThemeConfig(projectId, theme as unknown as Record<string, unknown>)
    } catch {
      // silently fail for now
    }
  }, [projectId, theme])

  const previewComponentName = useMemo(() => {
    if (!previewComponent) return ''
    const parts = previewComponent.split('/')
    return parts.slice(-2, -1)[0] || parts[parts.length - 1] || ''
  }, [previewComponent])

  if (projectLoading) {
    return (
      <div className={styles.loadingScreen}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!folderPath) {
    const header = (
      <AppHeader
        left={
          <div className={styles.breadcrumb}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}
              icon={<Icon name="chevron-left" size={16} />}>
              Projects
            </Button>
            <span className={styles.separator}>/</span>
            <span className={styles.projectName}>{project?.name || 'Project'}</span>
          </div>
        }
        right={
          <Button variant="primary" size="sm" onClick={handleSelectFolder}
            icon={<Icon name="folder" size={16} />}>
            Link Folder
          </Button>
        }
      />
    )

    return (
      <div className={styles.page}>
        {header}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Icon name="folder" size={40} />
          </div>
          <h2 className={styles.emptyTitle}>Link a component folder</h2>
          <p className={styles.emptyDesc}>
            Select the local directory containing your component source files
          </p>
          <Button variant="primary" size="lg" onClick={handleSelectFolder}>
            Select Folder
          </Button>
        </div>
      </div>
    )
  }

  const panelHeader = (
    <AppHeader
      left={
        <div className={styles.breadcrumb}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}
            icon={<Icon name="chevron-left" size={16} />}>
            Projects
          </Button>
          <span className={styles.separator}>/</span>
          <span className={styles.projectName}>{project?.name || 'Project'}</span>
        </div>
      }
      right={
        <>
          {previewComponent && (
            <Button
              variant={themeOpen ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setThemeOpen(true)}
              icon={<Icon name="palette" size={16} />}
            >
              Theme
            </Button>
          )}
          {!previewComponent && detectedComponents.length > 0 && (
            <Button
              variant={uploadOpen ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setUploadOpen(!uploadOpen)}
              icon={<Icon name="upload" size={16} />}
            >
              Upload
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleOpenInEditor}
            icon={<Icon name="code" size={16} />}>
            Open in Editor
          </Button>
          <Button variant="primary" size="sm" onClick={handleSelectFolder}
            icon={<Icon name="folder" size={16} />}>
            Change Folder
          </Button>
        </>
      }
    />
  )

  const sidebar = (
    <>
      <div className={styles.sidebarHeader}>
        <p className={styles.sidebarLabel}>Files</p>
        <p className={styles.sidebarPath}>{folderPath}</p>
      </div>
      {treeLoading ? (
        <div className={styles.sidebarLoading}>
          <Spinner size="sm" />
        </div>
      ) : (
        <FileTree
          nodes={filteredTree}
          onSelectFile={handleSelectFileNode}
          selectedPath={selectedFile}
          componentPaths={componentPathSet}
        />
      )}
    </>
  )

  const main = previewComponent ? (
    <div className={styles.previewArea}>
      <div className={styles.previewHeader}>
        <Button variant="ghost" size="sm" onClick={handleBackToComponents}
          icon={<Icon name="chevron-left" size={16} />}>
          Components
        </Button>
        <span className={styles.separator}>/</span>
        <div>
          <p className={styles.previewName}>{previewComponentName}</p>
          <p className={styles.previewPath}>{previewComponent}</p>
        </div>
      </div>
      <PreviewFrame port={port} theme={theme} starting={starting} />
    </div>
  ) : uploadOpen && projectId ? (
    <UploadPanel
      components={components}
      folderPath={folderPath}
      projectId={projectId}
      onClose={() => setUploadOpen(false)}
    />
  ) : (
    <div className={styles.componentArea}>
      <ComponentList
        components={components}
        selectedComponent={selectedComponent?.path || null}
        onSelect={handlePreviewComponent}
      />
    </div>
  )

  return (
    <>
      <SplitPanelTemplate header={panelHeader} sidebar={sidebar} main={main} />
      {previewComponent && (
        <ThemeOverlay open={themeOpen} onClose={() => setThemeOpen(false)} onSave={handleSaveTheme} />
      )}
    </>
  )
}

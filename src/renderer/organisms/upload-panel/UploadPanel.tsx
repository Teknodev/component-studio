import { useState, useCallback } from 'react'
import { api } from '../../services/api'
import type { ComponentEntry } from '../component-list/ComponentList'
import Button from '../../atoms/button/Button'
import Icon from '../../atoms/icon/Icon'
import styles from './UploadPanel.module.scss'

type UploadStatus = 'idle' | 'building' | 'uploading' | 'success' | 'error'

interface ComponentUploadState {
  status: UploadStatus
  error?: string
}

interface Props {
  components: ComponentEntry[]
  folderPath: string
  projectId: string
  onClose: () => void
}

export default function UploadPanel({ components, folderPath, projectId, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [version, setVersion] = useState('1.0.0')
  const [category, setCategory] = useState('custom')
  const [uploadStates, setUploadStates] = useState<Record<string, ComponentUploadState>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleComponent = useCallback((path: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    if (selected.size === components.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(components.map((c) => c.relativePath)))
    }
  }, [components, selected.size])

  const updateState = (path: string, state: ComponentUploadState) => {
    setUploadStates((prev) => ({ ...prev, [path]: state }))
  }

  const handleUpload = useCallback(async () => {
    if (selected.size === 0 || isProcessing) return
    setIsProcessing(true)

    const selectedComponents = components.filter((c) => selected.has(c.relativePath))

    for (const comp of selectedComponents) {
      updateState(comp.relativePath, { status: 'building' })
      try {
        const buildResult = await window.electronAPI.builder.buildComponent({
          componentDir: folderPath,
          componentRelativePath: comp.relativePath
        })

        updateState(comp.relativePath, { status: 'uploading' })

        await api.uploadComponent(projectId, {
          name: buildResult.name,
          category,
          version,
          bundle: buildResult.bundle,
          styles: buildResult.styles || undefined,
        })

        updateState(comp.relativePath, { status: 'success' })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        updateState(comp.relativePath, { status: 'error', error: message })
      }
    }

    setIsProcessing(false)
  }, [selected, components, folderPath, projectId, version, category, isProcessing])

  const successCount = Object.values(uploadStates).filter((s) => s.status === 'success').length
  const errorCount = Object.values(uploadStates).filter((s) => s.status === 'error').length

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Upload Components</h3>
        <Button variant="ghost" size="sm" onClick={onClose} icon={<Icon name="close" size={16} />} />
      </div>

      <div className={styles.config}>
        <div className={styles.field}>
          <label className={styles.label}>Version</label>
          <input
            className={styles.input}
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.0"
            disabled={isProcessing}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Category</label>
          <input
            className={styles.input}
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="custom"
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className={styles.listHeader}>
        <button className={styles.selectAll} onClick={selectAll} disabled={isProcessing}>
          <span className={`${styles.checkbox} ${selected.size === components.length ? styles.checked : ''}`} />
          <span className={styles.selectAllLabel}>
            {selected.size === components.length ? 'Deselect all' : 'Select all'}
          </span>
        </button>
        <span className={styles.count}>{selected.size} selected</span>
      </div>

      <div className={styles.list}>
        {components.map((comp) => {
          const state = uploadStates[comp.relativePath]
          return (
            <button
              key={comp.relativePath}
              className={styles.item}
              onClick={() => !isProcessing && toggleComponent(comp.relativePath)}
              disabled={isProcessing}
            >
              <span
                className={`${styles.checkbox} ${selected.has(comp.relativePath) ? styles.checked : ''}`}
              />
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{comp.name}</p>
                <p className={styles.itemPath}>{comp.relativePath}</p>
              </div>
              {state && (
                <span className={`${styles.status} ${styles[state.status]}`}>
                  {state.status === 'building' && <Icon name="loader" size={14} />}
                  {state.status === 'uploading' && <Icon name="loader" size={14} />}
                  {state.status === 'success' && <Icon name="check" size={14} />}
                  {state.status === 'error' && <Icon name="alert-circle" size={14} />}
                  <span>{state.status === 'error' ? state.error : state.status}</span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {(successCount > 0 || errorCount > 0) && (
        <div className={styles.summary}>
          {successCount > 0 && (
            <span className={styles.successText}>{successCount} uploaded successfully</span>
          )}
          {errorCount > 0 && (
            <span className={styles.errorText}>{errorCount} failed</span>
          )}
        </div>
      )}

      <div className={styles.footer}>
        <Button variant="secondary" size="sm" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleUpload}
          disabled={selected.size === 0 || isProcessing}
          icon={<Icon name="upload" size={16} />}
        >
          {isProcessing ? 'Uploading...' : `Upload ${selected.size > 0 ? `(${selected.size})` : ''}`}
        </Button>
      </div>
    </div>
  )
}

import { useState, useCallback } from 'react'
import Icon from '../../atoms/icon/Icon'
import styles from './FileTreeNode.module.scss'

const EXT_COLORS: Record<string, string> = {
  tsx: '#3b82f6',
  ts: '#60a5fa',
  jsx: '#f59e0b',
  js: '#fbbf24',
  css: '#a855f7',
  scss: '#a855f7',
  json: '#22c55e',
  md: '#94a3b8'
}

interface Props {
  node: FileTreeNode
  depth: number
  onSelectFile?: (node: FileTreeNode) => void
  selectedPath?: string
  componentPaths?: Set<string>
}

export default function FileTreeNode({ node, depth, onSelectFile, selectedPath, componentPaths }: Props) {
  const [expanded, setExpanded] = useState(false)
  const toggle = useCallback(() => setExpanded((prev) => !prev), [])

  if (node.type === 'file') {
    const isComponent = node.isComponent || !!componentPaths?.has(node.path)
    const ext = node.name.split('.').pop() || ''
    const color = isComponent ? '#4f46e5' : (EXT_COLORS[ext] || undefined)
    const isSelected = selectedPath === node.path

    return (
      <button
        onClick={() => onSelectFile?.(node)}
        className={`${styles.item} ${isSelected ? styles.selected : ''} ${isComponent ? styles.component : ''}`}
        style={{ paddingLeft: depth * 16 + 8 }}
        title={isComponent ? 'Click to preview component' : node.name}
      >
        <Icon name={isComponent ? 'component' : 'file'} size={16} className={styles.fileIcon} style={color ? { color } : undefined} />
        <span className={styles.name}>{node.name}</span>
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={toggle}
        className={styles.item}
        style={{ paddingLeft: depth * 16 + 8 }}
      >
        <span className={`${styles.arrow} ${expanded ? styles.arrowExpanded : ''}`}>
          <Icon name="chevron-right" size={12} />
        </span>
        <Icon
          name={expanded ? 'folder-open' : 'folder'}
          size={16}
          className={expanded ? styles.folderOpen : styles.folderClosed}
        />
        <span className={styles.folderName}>{node.name}</span>
      </button>
      {expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              onSelectFile={onSelectFile}
              selectedPath={selectedPath}
              componentPaths={componentPaths}
            />
          ))}
        </div>
      )}
    </div>
  )
}

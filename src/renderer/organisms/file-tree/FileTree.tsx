import FileTreeNode from '../../molecules/file-tree-node/FileTreeNode'
import Icon from '../../atoms/icon/Icon'
import styles from './FileTree.module.scss'

interface Props {
  nodes: FileTreeNode[]
  onSelectFile?: (node: FileTreeNode) => void
  selectedPath?: string
  componentPaths?: Set<string>
}

export default function FileTree({ nodes, onSelectFile, selectedPath, componentPaths }: Props) {
  if (nodes.length === 0) {
    return (
      <div className={styles.empty}>
        <Icon name="folder" size={32} className={styles.emptyIcon} />
        <p className={styles.emptyText}>No files found</p>
      </div>
    )
  }

  return (
    <div className={styles.tree}>
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          depth={0}
          onSelectFile={onSelectFile}
          selectedPath={selectedPath}
          componentPaths={componentPaths}
        />
      ))}
    </div>
  )
}

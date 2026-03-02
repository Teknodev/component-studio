import ComponentListItem from '../../molecules/component-list-item/ComponentListItem'
import Icon from '../../atoms/icon/Icon'
import styles from './ComponentList.module.scss'

export interface ComponentEntry {
  name: string
  path: string
  entryFile: string
  relativePath: string
}

interface Props {
  components: ComponentEntry[]
  selectedComponent: string | null
  onSelect: (component: ComponentEntry) => void
}

export default function ComponentList({ components, selectedComponent, onSelect }: Props) {
  if (components.length === 0) {
    return (
      <div className={styles.empty}>
        <Icon name="layout" size={32} className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>No components detected</p>
        <p className={styles.emptyHint}>Create folders with index.tsx or index.jsx</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      <h3 className={styles.heading}>Components ({components.length})</h3>
      {components.map((comp) => (
        <ComponentListItem
          key={comp.path}
          name={comp.name}
          relativePath={comp.relativePath}
          isSelected={selectedComponent === comp.path}
          onClick={() => onSelect(comp)}
        />
      ))}
    </div>
  )
}

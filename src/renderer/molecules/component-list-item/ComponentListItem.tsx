import styles from './ComponentListItem.module.scss'

interface Props {
  name: string
  relativePath: string
  isSelected: boolean
  onClick: () => void
}

export default function ComponentListItem({ name, relativePath, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`${styles.item} ${isSelected ? styles.selected : ''}`}
    >
      <div className={`${styles.avatar} ${isSelected ? styles.avatarSelected : ''}`}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.path}>{relativePath}</p>
      </div>
    </button>
  )
}

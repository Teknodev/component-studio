import Icon from '../../atoms/icon/Icon'
import Badge from '../../atoms/badge/Badge'
import styles from './ProjectCard.module.scss'

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  active: 'success',
  deactive: 'warning',
  terminated: 'danger'
}

interface Props {
  name: string
  status: string
  pageCount?: number
  onClick: () => void
}

export default function ProjectCard({ name, status, pageCount, onClick }: Props) {
  return (
    <button className={styles.card} onClick={onClick}>
      <div className={styles.iconWrap}>
        <Icon name="component" size={20} />
      </div>
      <h3 className={styles.name}>{name || 'Untitled'}</h3>
      <div className={styles.meta}>
        <Badge variant={STATUS_VARIANT[status] || 'neutral'}>{status}</Badge>
        {pageCount !== undefined && (
          <span className={styles.pages}>
            {pageCount} page{pageCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </button>
  )
}

import type { ReactNode } from 'react'
import styles from './DashboardTemplate.module.scss'

interface Props {
  header: ReactNode
  children: ReactNode
}

export default function DashboardTemplate({ header, children }: Props) {
  return (
    <div className={styles.layout}>
      {header}
      <main className={styles.content}>{children}</main>
    </div>
  )
}

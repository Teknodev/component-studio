import type { ReactNode } from 'react'
import styles from './SplitPanelTemplate.module.scss'

interface Props {
  header: ReactNode
  sidebar: ReactNode
  main: ReactNode
}

export default function SplitPanelTemplate({ header, sidebar, main }: Props) {
  return (
    <div className={styles.layout}>
      {header}
      <div className={styles.body}>
        <aside className={styles.sidebar}>{sidebar}</aside>
        <main className={styles.main}>{main}</main>
      </div>
    </div>
  )
}

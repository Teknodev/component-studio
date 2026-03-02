import type { ReactNode } from 'react'
import styles from './AppHeader.module.scss'

interface Props {
  left?: ReactNode
  right?: ReactNode
}

export default function AppHeader({ left, right }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </header>
  )
}

export function AppLogo() {
  return <div className={styles.logo}>CS</div>
}

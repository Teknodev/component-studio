import type { ReactNode } from 'react'
import styles from './AuthTemplate.module.scss'

interface Props {
  children: ReactNode
}

export default function AuthTemplate({ children }: Props) {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  )
}

import type { ReactNode } from 'react'
import styles from './Badge.module.scss'

type Variant = 'success' | 'warning' | 'danger' | 'neutral'

interface Props {
  variant?: Variant
  children: ReactNode
  className?: string
}

export default function Badge({ variant = 'neutral', children, className = '' }: Props) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}

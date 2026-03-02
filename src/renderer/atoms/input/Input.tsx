import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...rest }: Props) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.hasError : ''}`} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

import styles from './Spinner.module.scss'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Spinner({ size = 'md', className = '' }: Props) {
  return <div className={`${styles.spinner} ${styles[size]} ${className}`} />
}

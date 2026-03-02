import styles from './Checkbox.module.scss'

interface Props {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function Checkbox({ label, checked, onChange, disabled }: Props) {
  return (
    <label className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={styles.input}
      />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}

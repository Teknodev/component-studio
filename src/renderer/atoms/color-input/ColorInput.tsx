import styles from './ColorInput.module.scss'

interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
}

export default function ColorInput({ label, value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.field}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.swatch}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.text}
        />
      </div>
    </div>
  )
}

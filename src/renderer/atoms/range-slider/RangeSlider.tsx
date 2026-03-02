import styles from './RangeSlider.module.scss'

interface Props {
  label?: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  disabled?: boolean
  onChange: (value: number) => void
}

export default function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  disabled,
  onChange
}: Props) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <div className={styles.header}>
          <label className={styles.label}>{label}</label>
          <span className={styles.value}>
            {value}{unit}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.slider}
      />
    </div>
  )
}

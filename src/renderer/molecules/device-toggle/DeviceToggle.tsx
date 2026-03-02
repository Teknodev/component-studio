import styles from './DeviceToggle.module.scss'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

const DEVICES: { key: DeviceType; label: string }[] = [
  { key: 'mobile', label: 'Mobile' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'desktop', label: 'Desktop' }
]

interface Props {
  active: DeviceType
  onChange: (device: DeviceType) => void
}

export default function DeviceToggle({ active, onChange }: Props) {
  return (
    <div className={styles.group}>
      {DEVICES.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`${styles.option} ${active === key ? styles.active : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

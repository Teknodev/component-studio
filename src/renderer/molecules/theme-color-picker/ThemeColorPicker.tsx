import { useCallback } from 'react'
import { type ThemeColors } from '../../contexts/ThemeConfigContext'
import ColorInput from '../../atoms/color-input/ColorInput'
import styles from './ThemeColorPicker.module.scss'

const COLOR_FIELDS: { key: keyof ThemeColors; label: string }[] = [
  { key: 'background', label: 'Background' },
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'tertiary', label: 'Tertiary' },
  { key: 'font_color_primary', label: 'Font Primary' },
  { key: 'font_color_secondary', label: 'Font Secondary' }
]

interface Props {
  colors: ThemeColors
  onChange: (colors: Partial<ThemeColors>) => void
}

export default function ThemeColorPicker({ colors, onChange }: Props) {
  const handleChange = useCallback(
    (key: keyof ThemeColors, value: string) => onChange({ [key]: value }),
    [onChange]
  )

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>Colors</h3>
      <div className={styles.grid}>
        {COLOR_FIELDS.map(({ key, label }) => (
          <ColorInput
            key={key}
            label={label}
            value={colors[key]}
            onChange={(val) => handleChange(key, val)}
          />
        ))}
      </div>
    </div>
  )
}

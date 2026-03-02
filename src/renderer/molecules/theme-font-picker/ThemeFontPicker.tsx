import { useCallback } from 'react'
import { type ThemeFonts } from '../../contexts/ThemeConfigContext'
import Select from '../../atoms/select/Select'
import styles from './ThemeFontPicker.module.scss'

interface Props {
  fonts: ThemeFonts
  onChange: (fonts: Partial<ThemeFonts>) => void
}

export default function ThemeFontPicker({ fonts, onChange }: Props) {
  const handleChange = useCallback(
    (family: string) => onChange({ current: family, family: `${family}, sans-serif` }),
    [onChange]
  )

  const options = fonts.available.map((f) => ({ value: f, label: f }))

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>Typography</h3>
      <Select
        label="Font Family"
        options={options}
        value={fonts.current}
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className={styles.preview} style={{ fontFamily: fonts.family }}>
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  )
}

import { useCallback } from 'react'
import { type ThemeEnvironments } from '../../contexts/ThemeConfigContext'
import RangeSlider from '../../atoms/range-slider/RangeSlider'
import Checkbox from '../../atoms/checkbox/Checkbox'
import Input from '../../atoms/input/Input'
import styles from './ThemeEnvironment.module.scss'

interface Props {
  environments: ThemeEnvironments
  onChange: (env: Partial<ThemeEnvironments>) => void
}

export default function ThemeEnvironment({ environments, onChange }: Props) {
  const handleBorderRadius = useCallback(
    (value: number) => onChange({ border_radius: value }),
    [onChange]
  )

  const handleContentWidth = useCallback(
    (width: number) => onChange({ content_width: { ...environments.content_width, width } }),
    [onChange, environments.content_width]
  )

  const handleFullWidth = useCallback(
    (fullWidth: boolean) => onChange({ content_width: { ...environments.content_width, full_width: fullWidth } }),
    [onChange, environments.content_width]
  )

  const handleBoxShadow = useCallback(
    (key: string, value: number | string) => onChange({ box_shadow: { ...environments.box_shadow, [key]: value } }),
    [onChange, environments.box_shadow]
  )

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>Environment</h3>

      <RangeSlider
        label="Border Radius"
        value={environments.border_radius}
        min={0}
        max={32}
        onChange={handleBorderRadius}
      />

      <RangeSlider
        label="Content Width"
        value={environments.content_width.width}
        min={800}
        max={1920}
        step={10}
        disabled={environments.content_width.full_width}
        onChange={handleContentWidth}
      />
      <Checkbox
        label="Full width"
        checked={environments.content_width.full_width}
        onChange={handleFullWidth}
      />

      <div className={styles.shadowSection}>
        <span className={styles.fieldLabel}>Box Shadow</span>
        <div className={styles.shadowGrid}>
          {(['x', 'y', 'blur', 'spread'] as const).map((prop) => (
            <div key={prop} className={styles.shadowField}>
              <span className={styles.shadowLabel}>{prop}</span>
              <input
                type="number"
                value={environments.box_shadow[prop] as number}
                onChange={(e) => handleBoxShadow(prop, Number(e.target.value))}
                className={styles.numberInput}
              />
            </div>
          ))}
        </div>
        <div className={styles.shadowField}>
          <span className={styles.shadowLabel}>Color</span>
          <Input
            value={environments.box_shadow.color}
            onChange={(e) => handleBoxShadow('color', e.target.value)}
          />
        </div>
        <div className={styles.previewBox}>
          <div
            className={styles.previewSample}
            style={{
              boxShadow: `${environments.box_shadow.x}px ${environments.box_shadow.y}px ${environments.box_shadow.blur}px ${environments.box_shadow.spread}px ${environments.box_shadow.color}`,
              borderRadius: environments.border_radius
            }}
          />
        </div>
      </div>
    </div>
  )
}

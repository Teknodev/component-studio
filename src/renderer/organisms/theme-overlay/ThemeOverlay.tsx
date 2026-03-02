import { useThemeConfig } from '../../contexts/ThemeConfigContext'
import ThemeColorPicker from '../../molecules/theme-color-picker/ThemeColorPicker'
import ThemeFontPicker from '../../molecules/theme-font-picker/ThemeFontPicker'
import ThemeEnvironment from '../../molecules/theme-environment/ThemeEnvironment'
import Button from '../../atoms/button/Button'
import Icon from '../../atoms/icon/Icon'
import styles from './ThemeOverlay.module.scss'

interface Props {
  open: boolean
  onClose: () => void
  onSave?: () => void
}

export default function ThemeOverlay({ open, onClose, onSave }: Props) {
  const { theme, updateColors, updateFonts, updateEnvironments, resetTheme } = useThemeConfig()

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} />}
      <div className={`${styles.panel} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Theme Configuration</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <ThemeColorPicker colors={theme.colors} onChange={updateColors} />
          <div className={styles.divider} />
          <ThemeFontPicker fonts={theme.fonts} onChange={updateFonts} />
          <div className={styles.divider} />
          <ThemeEnvironment environments={theme.environments} onChange={updateEnvironments} />
        </div>

        <div className={styles.footer}>
          <Button variant="secondary" size="sm" onClick={resetTheme} fullWidth>
            Reset
          </Button>
          {onSave && (
            <Button variant="primary" size="sm" onClick={onSave} fullWidth>
              Save to Project
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

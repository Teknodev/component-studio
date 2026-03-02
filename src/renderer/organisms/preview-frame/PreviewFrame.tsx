import { useRef, useEffect, useState, useCallback } from 'react'
import { type ThemeConfig } from '../../contexts/ThemeConfigContext'
import DeviceToggle, { type DeviceType } from '../../molecules/device-toggle/DeviceToggle'
import Spinner from '../../atoms/spinner/Spinner'
import Icon from '../../atoms/icon/Icon'
import styles from './PreviewFrame.module.scss'

const DEVICE_WIDTHS: Record<DeviceType, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 0
}

interface Props {
  port: number | null
  theme: ThemeConfig
  starting: boolean
}

export default function PreviewFrame({ port, theme, starting }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [device, setDevice] = useState<DeviceType>('desktop')
  const [iframeReady, setIframeReady] = useState(false)

  const sendThemeUpdate = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      { type: 'THEME_UPDATE', payload: theme },
      '*'
    )
  }, [theme])

  useEffect(() => {
    if (iframeReady) sendThemeUpdate()
  }, [theme, iframeReady, sendThemeUpdate])

  const handleIframeLoad = useCallback(() => {
    setIframeReady(true)
    setTimeout(sendThemeUpdate, 200)
  }, [sendThemeUpdate])

  console.log('[PreviewFrame] Port:', port, 'Starting:', starting)
  if (!port && !starting) {
    return (
      <div className={styles.placeholder}>
        <Icon name="monitor" size={48} className={styles.placeholderIcon} />
        <p className={styles.placeholderText}>Select a component to preview</p>
      </div>
    )
  }

  const width = DEVICE_WIDTHS[device]

  return (
    <div className={styles.frame}>
      <div className={styles.toolbar}>
        <DeviceToggle active={device} onChange={setDevice} />
        {port && (
          <span className={styles.serverInfo}>
            <span className={styles.dot} />
            localhost:{port}
          </span>
        )}
      </div>

      <div className={styles.canvas}>
        {starting ? (
          <div className={styles.loading}>
            <Spinner size="lg" />
            <p className={styles.loadingText}>Starting dev server...</p>
          </div>
        ) : (
          <div
            className={styles.viewport}
            style={{ width: width || '100%', maxWidth: '100%' }}
          >
            <iframe
              ref={iframeRef}
              src={`http://localhost:${port}`}
              onLoad={handleIframeLoad}
              className={styles.iframe}
              sandbox="allow-scripts allow-same-origin allow-forms"
              title="Component Preview"
            />
          </div>
        )}
      </div>
    </div>
  )
}

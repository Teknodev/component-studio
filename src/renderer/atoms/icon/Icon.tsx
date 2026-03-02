import type { CSSProperties } from 'react'
import styles from './Icon.module.scss'

type IconName =
  | 'external-link'
  | 'search'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'folder'
  | 'folder-open'
  | 'file'
  | 'code'
  | 'component'
  | 'monitor'
  | 'palette'
  | 'layout'
  | 'dot'
  | 'book'
  | 'upload'
  | 'check'
  | 'alert-circle'
  | 'loader'
  | 'trash'

interface Props {
  name: IconName
  size?: number
  className?: string
  style?: CSSProperties
}

const PATHS: Record<IconName, { d: string; fill?: boolean }> = {
  'external-link': {
    d: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
  },
  search: {
    d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
  },
  'chevron-left': {
    d: 'M15 19l-7-7 7-7'
  },
  'chevron-right': {
    d: 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z',
    fill: true
  },
  close: {
    d: 'M6 18L18 6M6 6l12 12'
  },
  folder: {
    d: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
  },
  'folder-open': {
    d: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z'
  },
  file: {
    d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  code: {
    d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
  },
  component: {
    d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
  },
  monitor: {
    d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  palette: {
    d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
  },
  layout: {
    d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  dot: {
    d: 'M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0',
    fill: true
  },
  book: {
    d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  upload: {
    d: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
  },
  check: {
    d: 'M5 13l4 4L19 7'
  },
  'alert-circle': {
    d: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  loader: {
    d: 'M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-5.07l-2.83 2.83M9.76 14.24l-2.83 2.83m11.14 0l-2.83-2.83M9.76 9.76L6.93 6.93'
  },
  trash: {
    d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
  }
}

export default function Icon({ name, size = 16, className = '', style }: Props) {
  const icon = PATHS[name]
  const viewBox = name === 'chevron-right' ? '0 0 20 20' : '0 0 24 24'

  return (
    <svg
      className={`${styles.icon} ${className}`}
      style={style}
      width={size}
      height={size}
      viewBox={viewBox}
      fill={icon.fill ? 'currentColor' : 'none'}
      stroke={icon.fill ? 'none' : 'currentColor'}
      strokeWidth={icon.fill ? undefined : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={icon.d} fillRule={icon.fill ? 'evenodd' : undefined} clipRule={icon.fill ? 'evenodd' : undefined} />
    </svg>
  )
}

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode
} from 'react'

export interface ThemeColors {
  background: string
  primary: string
  secondary: string
  tertiary: string
  font_color_primary: string
  font_color_secondary: string
}

export interface ThemeFonts {
  current: string
  available: string[]
  family: string
}

export interface ThemeEnvironments {
  box_shadow: {
    x: number
    y: number
    blur: number
    spread: number
    color: string
  }
  content_width: {
    width: number
    full_width: boolean
  }
  border_radius: number
}

export interface ThemeConfig {
  colors: ThemeColors
  fonts: ThemeFonts
  environments: ThemeEnvironments
}

const DEFAULT_THEME: ThemeConfig = {
  colors: {
    background: '#ffffff',
    primary: '#4F46E5',
    secondary: '#7C3AED',
    tertiary: '#EC4899',
    font_color_primary: '#1E293B',
    font_color_secondary: '#64748B'
  },
  fonts: {
    current: 'Inter',
    available: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat'],
    family: 'Inter, sans-serif'
  },
  environments: {
    box_shadow: { x: 0, y: 2, blur: 8, spread: 0, color: 'rgba(0,0,0,0.1)' },
    content_width: { width: 1200, full_width: false },
    border_radius: 8
  }
}

interface ThemeConfigState {
  theme: ThemeConfig
  setTheme: (theme: ThemeConfig) => void
  updateColors: (colors: Partial<ThemeColors>) => void
  updateFonts: (fonts: Partial<ThemeFonts>) => void
  updateEnvironments: (env: Partial<ThemeEnvironments>) => void
  resetTheme: () => void
  loadFromProject: (config: Partial<ThemeConfig>) => void
}

const ThemeConfigContext = createContext<ThemeConfigState>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  updateColors: () => {},
  updateFonts: () => {},
  updateEnvironments: () => {},
  resetTheme: () => {},
  loadFromProject: () => {}
})

export function ThemeConfigProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME)

  const updateColors = useCallback((colors: Partial<ThemeColors>) => {
    setTheme((prev) => ({ ...prev, colors: { ...prev.colors, ...colors } }))
  }, [])

  const updateFonts = useCallback((fonts: Partial<ThemeFonts>) => {
    setTheme((prev) => ({ ...prev, fonts: { ...prev.fonts, ...fonts } }))
  }, [])

  const updateEnvironments = useCallback((env: Partial<ThemeEnvironments>) => {
    setTheme((prev) => ({ ...prev, environments: { ...prev.environments, ...env } }))
  }, [])

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME)
  }, [])

  const loadFromProject = useCallback((config: Partial<ThemeConfig>) => {
    setTheme((prev) => ({
      colors: { ...prev.colors, ...config.colors },
      fonts: { ...prev.fonts, ...config.fonts },
      environments: { ...prev.environments, ...config.environments }
    }))
  }, [])

  return (
    <ThemeConfigContext.Provider
      value={{ theme, setTheme, updateColors, updateFonts, updateEnvironments, resetTheme, loadFromProject }}
    >
      {children}
    </ThemeConfigContext.Provider>
  )
}

export function useThemeConfig() {
  return useContext(ThemeConfigContext)
}

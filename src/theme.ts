/**
 * テーマ管理システム
 * 色のみのテーマ切替とlocalStorage保存機能を提供
 */

export type Theme = 'legacy-light' | 'legacy-dark'

const THEME_STORAGE_KEY = 'learning-style-checker-theme'

/**
 * 利用可能なテーマ一覧
 */
export const AVAILABLE_THEMES: Theme[] = ['legacy-light', 'legacy-dark']

/**
 * システムのデフォルトテーマを取得
 * prefers-color-scheme: dark の場合は legacy-dark、それ以外は legacy-light
 */
export function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'legacy-dark' 
      : 'legacy-light'
  }
  return 'legacy-light'
}

/**
 * 保存されたテーマを取得
 * 保存されていない場合はシステムのデフォルトテーマを返す
 */
export function loadTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'legacy-light'
  }

  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
    if (savedTheme && AVAILABLE_THEMES.includes(savedTheme)) {
      return savedTheme
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error)
  }

  return getSystemTheme()
}

/**
 * テーマを保存
 * @param theme - 保存するテーマ
 */
export function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
}

/**
 * テーマを設定してDOMに適用
 * @param theme - 適用するテーマ
 */
export function setTheme(theme: Theme): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  saveTheme(theme)
}

/**
 * 現在のテーマを取得
 */
export function getCurrentTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'legacy-light'
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') as Theme
  return currentTheme && AVAILABLE_THEMES.includes(currentTheme) ? currentTheme : 'legacy-light'
}

/**
 * テーマを切り替え
 * 現在のテーマが legacy-light なら legacy-dark に、その逆も同様
 */
export function toggleTheme(): Theme {
  const currentTheme = getCurrentTheme()
  const newTheme = currentTheme === 'legacy-light' ? 'legacy-dark' : 'legacy-light'
  setTheme(newTheme)
  return newTheme
}

/**
 * テーマ変更の監視を開始
 * @param callback - テーマ変更時のコールバック関数
 */
export function watchThemeChange(callback: (theme: Theme) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        const newTheme = getCurrentTheme()
        callback(newTheme)
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })

  return () => observer.disconnect()
}

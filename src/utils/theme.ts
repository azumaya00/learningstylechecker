export type ThemeMode = 'ls-light' | 'ls-dark'

const THEME_KEY = 'ls_theme'

export function getCurrentTheme(): ThemeMode {
  if (typeof document === 'undefined') {
    return 'ls-light'
  }

  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'ls-dark' ? 'ls-dark' : 'ls-light'
}

export function setTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (error) {
    console.warn('[theme] Failed to persist theme:', error)
  }
}

export function watchThemeChange(callback: (theme: ThemeMode) => void): () => void {
  if (typeof document === 'undefined') {
    return () => {}
  }

  const root = document.documentElement
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        callback(getCurrentTheme())
        break
      }
    }
  })

  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

  return () => observer.disconnect()
}

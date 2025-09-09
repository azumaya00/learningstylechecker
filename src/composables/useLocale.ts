import { useI18n } from 'vue-i18n'

const KEY = 'app-lang'
const SUPPORTED = ['ja','en'] as const
type Lang = typeof SUPPORTED[number]

export function useLocale() {
  const { locale } = useI18n()

  function detect(): Lang {
    const fromQuery = new URLSearchParams(location.search).get('lang')
    if (fromQuery && SUPPORTED.includes(fromQuery as Lang)) return fromQuery as Lang
    const saved = localStorage.getItem(KEY)
    if (saved && SUPPORTED.includes(saved as Lang)) return saved as Lang
    const browser = (navigator.language || 'ja').slice(0,2)
    return (SUPPORTED as readonly string[]).includes(browser) ? (browser as Lang) : 'ja'
  }

  function setLang(l: Lang) {
    locale.value = l
    localStorage.setItem(KEY, l)
    const url = new URL(location.href)
    url.searchParams.set('lang', l)
    history.replaceState(null, '', url.toString())
  }

  function init() {
    const l = detect()
    if (locale.value !== l) setLang(l)
  }

  return { locale, setLang, init }
}

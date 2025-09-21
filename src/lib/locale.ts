/**
 * 言語管理のユーティリティ関数
 * 言語の読み込み、保存、切り替え機能を提供
 */

export type Locale = 'ja' | 'en'

const LOCALE_KEY = 'learningstyle-locale'
const DEFAULT_LOCALE: Locale = 'ja'

/**
 * 現在の言語を取得
 * @returns 現在の言語設定
 */
export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }
  
  const saved = localStorage.getItem(LOCALE_KEY)
  if (saved && (saved === 'ja' || saved === 'en')) {
    return saved as Locale
  }
  
  // ブラウザの言語設定を確認
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('en')) {
    return 'en'
  }
  
  return DEFAULT_LOCALE
}

/**
 * 言語を保存
 * @param locale - 保存する言語
 */
export function saveLocale(locale: Locale): void {
  if (typeof window === 'undefined') {
    return
  }
  
  localStorage.setItem(LOCALE_KEY, locale)
}

/**
 * 言語を設定
 * @param locale - 設定する言語
 */
export function setLocale(locale: Locale): void {
  saveLocale(locale)
  // HTMLのlang属性を更新
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
}

/**
 * 利用可能な言語の一覧
 */
export const AVAILABLE_LOCALES: { code: Locale; name: string; flag: string }[] = [
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]






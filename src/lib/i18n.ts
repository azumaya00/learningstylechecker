/**
 * 国際化（i18n）システム
 * 動的な言語切り替えとテキスト管理を提供
 */

import ja from '../i18n/ja.js'
import en from '../i18n/en.js'
import type { Locale } from './locale'

export type I18nTexts = typeof ja

const translations: Record<Locale, I18nTexts> = {
  ja,
  en
}

/**
 * 現在の言語に基づいてテキストを取得
 * @param locale - 言語コード
 * @returns 言語に対応したテキストオブジェクト
 */
export function getTexts(locale: Locale): I18nTexts {
  return translations[locale] || translations.ja
}

/**
 * テキストのキーパスから値を取得
 * @param texts - テキストオブジェクト
 * @param keyPath - キーのパス（例: 'app.title'）
 * @returns テキストの値
 */
export function getTextByPath(texts: I18nTexts, keyPath: string): string {
  const keys = keyPath.split('.')
  let value: any = texts
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      console.warn(`[i18n] Key path not found: ${keyPath}`)
      return keyPath
    }
  }
  
  return typeof value === 'string' ? value : keyPath
}

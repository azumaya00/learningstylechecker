/**
 * シェア機能のユーティリティ関数
 * X / LINE / WhatsApp / Facebook / Copy Link の5つのシェア機能を提供
 */

export type ResultType = 'v' | 'a' | 't' | 'va' | 'vt' | 'at' | 'all'

export const RESULT_LABEL_JA: Record<ResultType, string> = {
  v: '視覚',
  a: '聴覚',
  t: '触覚・運動感覚',
  va: '視覚＆聴覚',
  vt: '視覚＆触覚',
  at: '聴覚＆触覚',
  all: '全部盛り（ネタ枠）'
}

export const RESULT_LABEL_EN: Record<ResultType, string> = {
  v: 'Visual',
  a: 'Auditory',
  t: 'Tactile / Kinesthetic',
  va: 'Visual + Auditory',
  vt: 'Visual + Tactile',
  at: 'Auditory + Tactile',
  all: 'All-rounder (Fun)'
}

/**
 * シェア用のテキストを生成
 * @param type - 診断結果のタイプ
 * @param locale - 言語設定
 * @returns シェア用テキスト
 */
export function buildShareText(type: ResultType, locale: 'ja' | 'en' = 'ja'): string {
  return locale === 'ja'
    ? `あなたの学習タイプは「${RESULT_LABEL_JA[type]}タイプ」でした！`
    : `My learning style is "${RESULT_LABEL_EN[type]}"!`
}

/**
 * ハッシュタグを生成
 * @returns ハッシュタグの配列（X用はカンマ区切りで # は不要）
 */
export function buildHashtags(): string[] {
  return ['LearningStyleChecker', '学習特性診断']
}

/**
 * シェア用ランディングページのURLを生成
 * @param type - 診断結果のタイプ
 * @returns OGP用の静的ページURL
 */
export function shareLandingUrl(type: ResultType): string {
  return `${location.origin}/share/${type}.html`
}

/**
 * 各SNS用のシェアURLを生成
 * @param type - 診断結果のタイプ
 * @param locale - 言語設定
 * @returns 各SNS用のシェアURLオブジェクト
 */
export function buildShareUrls(type: ResultType, locale: 'ja' | 'en' = 'ja') {
  const text = buildShareText(type, locale)
  const tags = buildHashtags().join(',')
  const url = shareLandingUrl(type)

  const u = encodeURIComponent(url)
  const t = encodeURIComponent(text)
  const h = encodeURIComponent(tags)

  return {
    x: `https://x.com/intent/tweet?text=${t}&url=${u}&hashtags=${h}`,
    line: `https://social-plugins.line.me/lineit/share?url=${u}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    copy: url
  }
}

/**
 * クリップボードにテキストをコピー
 * @param text - コピーするテキスト
 * @returns コピー成功のPromise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // フォールバック: 古いブラウザ対応
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

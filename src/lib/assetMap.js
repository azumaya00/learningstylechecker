/**
 * アセットマップ - 結果画像のパス管理
 * テーマ（light/dark）に応じて適切な画像パスを返す
 */

// 結果画像のマッピング
const resultImageMap = {
  v: {
    light: '/images/result-v-light.png',
    dark: '/images/result-v-dark.png'
  },
  a: {
    light: '/images/result-a-light.png',
    dark: '/images/result-a-dark.png'
  },
  t: {
    light: '/images/result-t-light.png',
    dark: '/images/result-t-dark.png'
  },
  va: {
    light: '/images/result-va-light.png',
    dark: '/images/result-va-dark.png'
  },
  vt: {
    light: '/images/result-vt-light.png',
    dark: '/images/result-vt-dark.png'
  },
  at: {
    light: '/images/result-at-light.png',
    dark: '/images/result-at-dark.png'
  },
  all: {
    light: '/images/result-all-light.png',
    dark: '/images/result-all-dark.png'
  }
}

/**
 * 現在のテーマに応じた結果画像のパスを取得
 * @param {string} type - 結果タイプ（v, a, t, va, vt, at, all）
 * @param {string} theme - テーマ（legacy-light/legacy-dark や ls-light/ls-dark など）
 * @returns {string} 画像パス
 */
export function getCurrentImagePath(type, theme) {
  const isDark = typeof theme === 'string' && theme.includes('dark')
  const variant = isDark ? 'dark' : 'light'
  
  const imageConfig = resultImageMap[type]
  if (!imageConfig) {
    console.warn(`[AssetMap] Unknown result type: ${type}`)
    return resultImageMap.v[variant] // デフォルトは視覚タイプ
  }
  
  return imageConfig[variant]
}








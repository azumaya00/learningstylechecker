/**
 * アセットマップ - 結果画像のパス管理
 * テーマ（light/dark）に応じて適切な画像パスを返す
 */

// 結果画像のマッピング
const resultImageMap = {
  v: {
    light: '/images/result-v-light.svg',
    dark: '/images/result-v-dark.svg'
  },
  a: {
    light: '/images/result-a-light.svg',
    dark: '/images/result-a-dark.svg'
  },
  t: {
    light: '/images/result-t-light.svg',
    dark: '/images/result-t-dark.svg'
  },
  va: {
    light: '/images/result-va-light.svg',
    dark: '/images/result-va-dark.svg'
  },
  vt: {
    light: '/images/result-vt-light.svg',
    dark: '/images/result-vt-dark.svg'
  },
  at: {
    light: '/images/result-at-light.svg',
    dark: '/images/result-at-dark.svg'
  },
  all: {
    light: '/images/result-all-light.svg',
    dark: '/images/result-all-dark.svg'
  }
}

/**
 * 現在のテーマに応じた結果画像のパスを取得
 * @param {string} type - 結果タイプ（v, a, t, va, vt, at, all）
 * @param {string} theme - テーマ（legacy-light, legacy-dark）
 * @returns {string} 画像パス
 */
export function getCurrentImagePath(type, theme) {
  const isDark = theme === 'legacy-dark'
  const variant = isDark ? 'dark' : 'light'
  
  const imageConfig = resultImageMap[type]
  if (!imageConfig) {
    console.warn(`[AssetMap] Unknown result type: ${type}`)
    return resultImageMap.v[variant] // デフォルトは視覚タイプ
  }
  
  return imageConfig[variant]
}

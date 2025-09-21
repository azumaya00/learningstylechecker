/**
 * ダミー画像生成スクリプト
 * Start画面用と結果画面用のダミー画像を生成
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 出力ディレクトリ
const outputDir = path.join(__dirname, '../public/images')

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * SVG画像を生成する関数
 * @param {string} text - 表示するテキスト
 * @param {number} width - 幅
 * @param {number} height - 高さ
 * @param {string} bgColor - 背景色
 * @param {string} textColor - テキスト色
 * @returns {string} SVG文字列
 */
function generateSVG(text, width, height, bgColor, textColor) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:0.8" />
      <stop offset="50%" style="stop-color:${bgColor};stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:${bgColor};stop-opacity:0.7" />
    </linearGradient>
    <filter id="noise">
      <feTurbulence baseFrequency="0.6" numOctaves="3" result="noise" seed="1"/>
      <feColorMatrix in="noise" type="saturate" values="0"/>
    </filter>
    <filter id="textShadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#bg)" filter="url(#noise)" opacity="0.05"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 20}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${textColor}" filter="url(#textShadow)">${text}</text>
</svg>`
}

/**
 * 結果画面用の色設定
 */
const resultColors = {
  v: { bg: '#69c4d0', text: '#ffffff' },      // 視覚 - 水色
  a: { bg: '#c14f7e', text: '#ffffff' },      // 聴覚 - ピンク
  t: { bg: '#9E7E9F', text: '#ffffff' },      // 触覚・運動感覚 - 紫
  va: { bg: '#5ab3c0', text: '#ffffff' },     // 視覚＆聴覚 - 水色系
  vt: { bg: '#8b6b8c', text: '#ffffff' },     // 視覚＆触覚・運動感覚 - 紫系
  at: { bg: '#a63d6a', text: '#ffffff' },     // 聴覚＆触覚・運動感覚 - ピンク系
  all: { bg: '#6b7280', text: '#ffffff' }     // 全部盛り - グレー
}

/**
 * 結果画面用の診断名
 */
const resultNames = {
  v: '視覚タイプ',
  a: '聴覚タイプ', 
  t: '触覚・運動感覚タイプ',
  va: '視覚＆聴覚タイプ',
  vt: '視覚＆触覚・運動感覚タイプ',
  at: '聴覚＆触覚・運動感覚タイプ',
  all: '全部盛りタイプ'
}

// Start画面用ダミー画像を生成
console.log('Generating Start screen dummy images...')

// モバイル用 (1080x1920) - 白に近いグレー
const startMobileSVG = generateSVG(
  'START CARD\nMOBILE DUMMY',
  1080,
  1920,
  '#f1f1f1',  // 白に近いグレー
  '#9ca3af'   // より薄いグレーのテキスト
)
fs.writeFileSync(path.join(outputDir, 'start-card-mobile.svg'), startMobileSVG)

// デスクトップ用 (1920x1080) - 白に近いグレー
const startDesktopSVG = generateSVG(
  'START CARD\nDESKTOP DUMMY',
  1920,
  1080,
  '#f1f1f1',  // 白に近いグレー
  '#9ca3af'   // より薄いグレーのテキスト
)
fs.writeFileSync(path.join(outputDir, 'start-card-desktop.svg'), startDesktopSVG)

// 結果画面用ダミー画像を生成
console.log('Generating Result screen dummy images...')

Object.keys(resultColors).forEach(key => {
  const colors = resultColors[key]
  const name = resultNames[key]
  
  const resultSVG = generateSVG(
    `RESULT\n${name}\n${key.toUpperCase()}`,
    1280,
    720,
    colors.bg,
    colors.text
  )
  
  fs.writeFileSync(path.join(outputDir, `result-${key}.svg`), resultSVG)
  console.log(`Generated result-${key}.svg`)
})

console.log('All dummy images generated successfully!')
console.log('Files created:')
console.log('- start-card-mobile.svg')
console.log('- start-card-desktop.svg')
console.log('- result-v.svg')
console.log('- result-a.svg')
console.log('- result-t.svg')
console.log('- result-va.svg')
console.log('- result-vt.svg')
console.log('- result-at.svg')
console.log('- result-all.svg')

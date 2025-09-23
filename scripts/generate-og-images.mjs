import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const TYPES = [
  'v', 'a', 't', 'va', 'vt', 'at', 'all'
]

const LABEL_JA = {
  v: '視覚',
  a: '聴覚',
  t: '触覚・運動感覚',
  va: '視覚＆聴覚',
  vt: '視覚＆触覚',
  at: '聴覚＆触覚',
  all: '全部盛り'
}

const COLORS = {
  v: '#3B82F6',      // 青
  a: '#10B981',       // 緑
  t: '#F59E0B',       // オレンジ
  va: '#8B5CF6',      // 紫
  vt: '#EF4444',      // 赤
  at: '#06B6D4',      // シアン
  all: '#EC4899'      // ピンク
}

function generateOGImage(type) {
  const width = 1200
  const height = 630
  const color = COLORS[type]
  const label = LABEL_JA[type]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
    </filter>
  </defs>
  
  <!-- 背景 -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  
  <!-- 装飾的な円 -->
  <circle cx="1000" cy="100" r="80" fill="${color}" opacity="0.1"/>
  <circle cx="150" cy="500" r="60" fill="${color}" opacity="0.15"/>
  <circle cx="1050" cy="550" r="40" fill="${color}" opacity="0.2"/>
  
  <!-- メインカード -->
  <rect x="100" y="150" width="1000" height="330" rx="24" fill="white" filter="url(#shadow)"/>
  
  <!-- タイトル -->
  <text x="600" y="250" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="#1f2937">
    学習スタイル診断
  </text>
  
  <!-- 結果テキスト -->
  <text x="600" y="320" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="600" fill="${color}">
    あなたの学習タイプは
  </text>
  
  <!-- タイプ名 -->
  <text x="600" y="380" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="800" fill="${color}">
    「${label}タイプ」
  </text>
  
  <text x="600" y="420" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="600" fill="${color}">
    でした！
  </text>
  
  <!-- ハッシュタグ -->
  <text x="600" y="480" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500" fill="#6b7280">
    #LearningStyleChecker #学習特性診断
  </text>
</svg>`
}

const outDir = join(process.cwd(), 'public', 'og')
mkdirSync(outDir, { recursive: true })

for (const type of TYPES) {
  const svgContent = generateOGImage(type)
  const filePath = join(outDir, `learningstyle-${type}-light.png`)
  
  // SVGをPNGとして保存（実際のPNG変換は後で行う）
  writeFileSync(filePath.replace('.png', '.svg'), svgContent, 'utf8')
  console.log(`Generated: /public/og/learningstyle-${type}-light.svg`)
}

console.log('\nNote: SVG files generated. For production, convert to PNG using:')
console.log('npx svg2png-cli public/og/*.svg --outdir public/og --width 1200 --height 630')


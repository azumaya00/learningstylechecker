import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ORIGIN = process.env.VITE_SITE_ORIGIN || 'http://localhost:5173'
const START_PATH = '/' // 診断スタートのパス

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
  all: '全部盛り（ネタ枠）'
}

function html(type) {
  const title = '学習スタイル診断'
  const desc = `あなたの学習タイプは「${LABEL_JA[type]}タイプ」でした！`
  const url = `${ORIGIN}/share/${type}.html`
  const image = `${ORIGIN}/images/result-${type}-light.svg`
  const redirect = `${ORIGIN}${START_PATH}`

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>${title} - ${desc}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${desc}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image}">

<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="2; url=${redirect}">
<style>
  body { 
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans JP", sans-serif; 
    display: grid; 
    place-items: center; 
    min-height: 100svh; 
    margin: 0; 
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
  .card { 
    padding: 32px; 
    max-width: 720px; 
    text-align: center; 
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
  h1 {
    color: #1f2937;
    font-size: 2rem;
    margin-bottom: 16px;
    font-weight: 700;
  }
  p {
    color: #6b7280;
    margin-bottom: 8px;
  }
  .hint { 
    opacity: 0.7; 
    font-size: 14px; 
    margin-top: 16px; 
  }
  .hint a {
    color: #3b82f6;
    text-decoration: none;
  }
  .hint a:hover {
    text-decoration: underline;
  }
</style>
</head>
<body>
  <div class="card">
    <h1>${desc}</h1>
    <p>数秒後に診断スタートページへ移動します。</p>
    <p class="hint"><a href="${redirect}">移動しない場合はこちら</a></p>
  </div>
</body>
</html>`
}

const outDir = join(process.cwd(), 'public', 'share')
mkdirSync(outDir, { recursive: true })

for (const type of TYPES) {
  writeFileSync(join(outDir, `${type}.html`), html(type), 'utf8')
  console.log(`Generated: /public/share/${type}.html`)
}

console.log(`\nOG pages generated with origin: ${ORIGIN}`)

#!/bin/bash

# 各タイプの定義
declare -A types=(
  ["a"]="聴覚タイプ"
  ["t"]="触覚・運動感覚タイプ"
  ["va"]="視覚＆聴覚タイプ"
  ["vt"]="視覚＆触覚・運動感覚タイプ"
  ["at"]="聴覚＆触覚・運動感覚タイプ"
  ["all"]="全部盛りタイプ"
)

# 各タイプの色定義
declare -A colors=(
  ["a"]="#c14f7e"
  ["t"]="#9E7E9F"
  ["va"]="#5ab3c0"
  ["vt"]="#8b6b8c"
  ["at"]="#a63d6a"
  ["all"]="#6b7280"
)

# ライト版テンプレート
create_light_svg() {
  local type=$1
  local name=$2
  local color=$3
  
  cat > "public/images/result-${type}-light.svg" << SVG_EOF
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
      <stop offset="50%" style="stop-color:${color};stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
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
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" filter="url(#textShadow)">RESULT
${name}
${type^^}</text>
  <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="24" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" filter="url(#textShadow)">(ライト)</text>
</svg>
SVG_EOF
}

# ダーク版テンプレート
create_dark_svg() {
  local type=$1
  local name=$2
  
  cat > "public/images/result-${type}-dark.svg" << SVG_EOF
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:0.9" />
      <stop offset="50%" style="stop-color:#2d2d2d;stop-opacity:0.95" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:0.8" />
    </linearGradient>
    <filter id="noise">
      <feTurbulence baseFrequency="0.6" numOctaves="3" result="noise" seed="1"/>
      <feColorMatrix in="noise" type="saturate" values="0"/>
    </filter>
    <filter id="textShadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(255,255,255,0.2)"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#bg)" filter="url(#noise)" opacity="0.05"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#e5e7eb" filter="url(#textShadow)">RESULT
${name}
${type^^}</text>
  <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="24" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#e5e7eb" filter="url(#textShadow)">(ダーク)</text>
</svg>
SVG_EOF
}

# 各タイプの画像を作成
for type in "${!types[@]}"; do
  name="${types[$type]}"
  color="${colors[$type]}"
  
  echo "Creating images for type: $type ($name)"
  create_light_svg "$type" "$name" "$color"
  create_dark_svg "$type" "$name"
done

# レア画像も作成
echo "Creating rare images for type: v"
cat > "public/images/result-v-rare-light.svg" << 'SVG_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.8" />
      <stop offset="50%" style="stop-color:#ff6b6b;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#ff6b6b;stop-opacity:0.7" />
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
  <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" filter="url(#textShadow)">RESULT
視覚タイプ
V</text>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#ffd700" filter="url(#textShadow)">★ レア ★</text>
  <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="24" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" filter="url(#textShadow)">(ライト)</text>
</svg>
SVG_EOF

cat > "public/images/result-v-rare-dark.svg" << 'SVG_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:0.9" />
      <stop offset="50%" style="stop-color:#2d2d2d;stop-opacity:0.95" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:0.8" />
    </linearGradient>
    <filter id="noise">
      <feTurbulence baseFrequency="0.6" numOctaves="3" result="noise" seed="1"/>
      <feColorMatrix in="noise" type="saturate" values="0"/>
    </filter>
    <filter id="textShadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(255,255,255,0.2)"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#bg)" filter="url(#noise)" opacity="0.05"/>
  <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#e5e7eb" filter="url(#textShadow)">RESULT
視覚タイプ
V</text>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#ffd700" filter="url(#textShadow)">★ レア ★</text>
  <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="24" font-weight="normal" text-anchor="middle" dominant-baseline="middle" fill="#e5e7eb" filter="url(#textShadow)">(ダーク)</text>
</svg>
SVG_EOF

echo "All result images created successfully!"

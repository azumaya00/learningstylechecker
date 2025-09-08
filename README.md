# Learning Style Checker

学習スタイル診断アプリケーション

## Phase 1: 等価移植完了

Vue2からVue3への等価移植が完了しました。

### 起動手順

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build
```

### Vercelデプロイ

```bash
# Vercelにデプロイ
vercel --prod
```

### 制約事項

- 見た目と挙動はVue2版と完全に等価
- Options APIを維持（Composition APIへの書き換えは行わない）
- CSSリセット、Tailwind/DaisyUI等は導入していない
- 最小レスポンシブ対応（1カラム、max-width: 42rem）
- 背景画像は `/images/bg-legacy.jpg` を使用

### 技術スタック

- Vue 3
- Vite
- Options API

### ファイル構成

```
# Vue3版（メイン）
src/
├── main.js          # エントリーポイント
├── App.vue          # メインアプリケーション
├── styles.css       # スタイルシート
└── components/
    ├── Start.vue    # スタート画面
    ├── Checklist.vue # 質問画面
    └── Result.vue   # 結果画面

public/
└── images/
    └── bg-legacy.jpg # 背景画像

# Vue2版（レガシー）
legacy-vue2/
├── js/app.js        # Vue2のメインアプリケーション
├── css/style.css    # スタイルシート
├── scss/            # SCSSファイル群
├── img/             # 画像ファイル
├── dist/            # ビルド済みファイル
└── index-vue2.html  # Vue2版のHTML
```

### デプロイ設定

- `vercel.json` - Vercelデプロイ設定
- `.gitignore` - Git除外設定

# Learning Style Checker

学習スタイル診断アプリケーション

## Phase 1: 等価移植完了

Vue2からVue3への等価移植が完了しました。

## Phase 2: レスポンシブ・レイアウト最適化完了

現代的なレスポンシブデザインとレイアウト最適化を追加しました。

## Phase 2.5: リファクタリング完了

コードの整理・コメント追加・命名統一を実施し、保守性を向上させました。

## Phase 3: テーマ切替・キャライラスト表示完了

テーマ切替（色のみ）と結果画面キャライラスト表示（ダミー）を追加しました。

## Phase 4: 全年齢専用リファクタリング完了

コンテンツパック関連・モード切替・レア抽選を除去し、全年齢専用のシンプル構成にリファクタリングしました。

## Phase 5: 包括的シェア機能実装完了

X / LINE / WhatsApp / Facebook / Copy Link の5つのシェア機能とOGP対応の静的ページを実装しました。

### Phase 5の実装内容

#### 包括的シェア機能
- **5つのシェアプラットフォーム**: X / LINE / WhatsApp / Facebook / Copy Link
- **OGP対応**: タイプ別の静的ページでSNS表示を最適化
- **自動生成**: ビルド時にOGページを自動生成
- **環境変数対応**: Vercelの環境変数で本番URLを設定

#### シェアシステム構成
- **共有文言**: 「あなたの学習タイプは「{タイプ名}タイプ」でした！」
- **ハッシュタグ**: #LearningStyleChecker #学習特性診断
- **ランディングページ**: `/share/{type}.html` でOGP表示後、診断ページへリダイレクト
- **OGP画像**: 1200×630pxのタイプ別画像（`/public/og/`）

#### 技術実装
- **ユーティリティ**: `src/utils/share.ts` でシェア機能を集約
- **コンポーネント**: `ShareButtons.vue` でUIを提供
- **自動生成**: `scripts/gen-share-pages.mjs` でOGページを生成
- **ビルド統合**: `prebuild` スクリプトでビルド前にOGページを生成

### Phase 4の実装内容

#### 全年齢専用リファクタリング
- **コンテンツパック除去**: 複雑なコンテンツパックシステムを削除
- **モード切替削除**: `APP_MODE` 関連のコードを完全除去
- **レア抽選削除**: 確率制御システムを削除
- **シンプル化**: 固定ID（v/a/t/va/vt/at/all）× i18n × assetMapの構成

### Phase 3の実装内容

#### テーマ切替システム
- **色のみのテーマ切替**: `legacy-light` / `legacy-dark` の2テーマ
- **自動検出**: `prefers-color-scheme: dark` に基づく初期テーマ設定
- **永続化**: localStorage によるテーマ設定の保存・復元
- **UI切替**: 右上のトグルボタンでテーマ切り替え

#### キャライラスト表示
- **Start画面**: カード内背景にダミー画像を表示（モバイル・デスクトップ対応）
- **結果画面**: 7タイプの診断結果に対応したダミー画像を表示
- **レスポンシブ**: 画像サイズとレイアウトの最適化

#### ダミー画像システム
- **自動生成**: Node.js スクリプトによる SVG ダミー画像生成
- **差し替え対応**: 同名ファイルで本番画像に置換可能
- **命名規則**: 統一されたファイル命名規則

### 画像差し替え手順

#### 1. Start画面用画像の差し替え
```bash
# 以下のファイルを同名で置き換え
/public/images/start-card-mobile.svg  # 1080x1920 推奨
/public/images/start-card-desktop.svg # 1920x1080 推奨
```

#### 2. 結果画面用画像の差し替え
```bash
# 以下のファイルを同名で置き換え（各 1280x720 推奨）
/public/images/result-v.svg    # 視覚タイプ
/public/images/result-a.svg    # 聴覚タイプ
/public/images/result-t.svg    # 触覚・運動感覚タイプ
/public/images/result-va.svg   # 視覚＆聴覚タイプ
/public/images/result-vt.svg   # 視覚＆触覚・運動感覚タイプ
/public/images/result-at.svg   # 聴覚＆触覚・運動感覚タイプ
/public/images/result-all.svg  # 全部盛りタイプ
```

#### 3. 画像形式の変更
- **推奨形式**: WebP（軽量・高品質）
- **代替形式**: SVG（ベクター）、PNG（ラスター）
- **命名規則**: ファイル名は変更不可（コード内で参照）

#### 4. 画像サイズの調整
- **Start画面**: アスペクト比を維持（モバイル: 9:16、デスクトップ: 16:9）
- **結果画面**: 16:9 のアスペクト比を推奨
- **最適化**: ファイルサイズを考慮した圧縮を推奨

## 画像差し替え方法

### 概要
`/public/images/` にあるダミー画像（.svg または .webp）は、同名の本番イラストに差し替えるだけで、コード変更なしで反映されます。

### 差し替え手順

#### 1. 本番イラストの準備
1. **PNG形式で描画**: まずPNG形式で本番イラストを描画
2. **WebP形式に変換**: PNGをWebP形式に変換（ファイルサイズ最適化）
3. **指定サイズで保存**: 以下のサイズで保存

#### 2. ファイル名とサイズ指定

**Start画面用画像**
- `start-card-mobile.webp` - 1080x1920（モバイル用、縦長）
- `start-card-desktop.webp` - 1920x1080（デスクトップ用、横長）

**結果画面用画像（各1280x720）**
- `result-v.webp` - 視覚タイプ
- `result-a.webp` - 聴覚タイプ
- `result-t.webp` - 触覚・運動感覚タイプ
- `result-va.webp` - 視覚＆聴覚タイプ
- `result-vt.webp` - 視覚＆触覚・運動感覚タイプ
- `result-at.webp` - 聴覚＆触覚・運動感覚タイプ
- `result-all.webp` - 全部盛りタイプ

#### 3. 差し替え実行
1. **既存ダミー削除**: 現在の`.svg`ファイルを削除
2. **本番画像配置**: 上記のファイル名で本番画像を`/public/images/`に配置
3. **動作確認**: アプリケーションを起動して画像が正しく表示されることを確認

#### 4. フォーマット注意事項
- **推奨**: WebP形式（軽量・高品質）
- **代替**: PNG、JPEG形式も使用可能
- **コード修正**: PNG/JPEG使用時は、コード内の`.svg`参照を`.png`/`.jpg`に変更が必要

### 技術仕様
- **自動読み込み**: ファイル名が一致していれば自動的に読み込まれる
- **レスポンシブ対応**: 画像サイズは自動調整される
- **キャッシュ対策**: ブラウザキャッシュをクリアして確認推奨

### リファクタリング内容

#### CSS整理
- **デザインシステム**: トークンをカテゴリ別に整理し、詳細なコメントを追加
- **セクション分割**: 機能別にセクションを明確に分離
- **命名統一**: 一貫したクラス命名規則を適用

#### Vueコンポーネント整理
- **JSDocコメント**: 全メソッドに詳細なドキュメントを追加
- **メソッド分割**: 複雑な処理を小さな関数に分割
- **命名改善**: より分かりやすいメソッド名に変更
- **エラーハンドリング**: 適切なエラー処理とフォールバックを追加

#### コード品質向上
- **型安全性**: propsの型定義を強化
- **可読性**: コードの構造を整理し、コメントで意図を明確化
- **保守性**: 機能別にメソッドを分割し、再利用性を向上

### 環境変数設定

#### シェア機能用のサイトURL設定

Vercelの環境変数でサイトの絶対URLを設定してください：

```bash
# Vercel Environment Variables
VITE_SITE_ORIGIN=https://your-domain.vercel.app
```

#### 開発環境での設定

ローカル開発時は `.env.development` ファイルを作成：

```bash
# .env.development ファイル
VITE_SITE_ORIGIN=http://localhost:5173
```

### シェア機能の使用方法

#### 1. シェアボタンの表示
結果画面で5つのシェアボタンが表示されます：
- **X**: 旧Twitterでシェア
- **LINE**: LINEでシェア
- **WhatsApp**: WhatsAppでシェア
- **Facebook**: Facebookでシェア
- **リンクをコピー**: クリップボードにコピー

#### 2. OGPページの動作
- シェアリンクは `/share/{type}.html` に誘導
- 2秒後に診断スタートページへ自動リダイレクト
- SNS上では適切なOGP画像とタイトルが表示

#### 3. 画像の差し替え
OGP画像は結果ページの画像を流用するため、結果ページ用の画像を差し替えるだけで両方に反映されます：

```bash
# 以下のファイルを差し替え（結果ページとOGPの両方に使用）
/public/images/result-v-light.svg    # 視覚タイプ
/public/images/result-a-light.svg    # 聴覚タイプ
/public/images/result-t-light.svg    # 触覚・運動感覚タイプ
/public/images/result-va-light.svg   # 視覚＆聴覚タイプ
/public/images/result-vt-light.svg   # 視覚＆触覚タイプ
/public/images/result-at-light.svg   # 聴覚＆触覚タイプ
/public/images/result-all-light.svg  # 全部盛りタイプ
```

### 起動手順

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド（OGページも自動生成）
npm run build
```

### Vercelデプロイ

```bash
# Vercelにデプロイ
vercel --prod
```

### Phase 2 の改善点

#### レスポンシブデザイン
- **流体タイポグラフィ**: `clamp()`を使用したスケーラブルなフォントサイズ
- **モバイルファースト**: 375px〜1920pxの全ブレークポイントに対応
- **タップ領域最適化**: 最小44×44pxのタップ領域を確保
- **iOS安全域対応**: `env(safe-area-inset-*)`でノッチ対応

#### デザインシステム
- **CSS変数トークン**: スペーシング、カラー、タイポグラフィを統一管理
- **ダークテーマ準備**: `data-theme="legacy-dark"`でダークモード対応（UI切替は次フェーズ）
- **背景画像切替**: モバイル/デスクトップ用の背景画像を自動切替
- **モダンCSS**: 論理プロパティ、`backdrop-filter`、`color-mix()`を活用

#### アクセシビリティ
- **キーボード操作**: `:focus-visible`でフォーカスリング表示
- **モーション配慮**: `prefers-reduced-motion`でアニメーション制御
- **コントラスト**: WCAG 4.5:1を満たすカラーコントラスト

#### パフォーマンス
- **軽量アニメーション**: 200-250msの最適化されたトランジション
- **モバイル最適化**: `background-attachment: scroll`でスクロール性能向上
- **効率的なCSS**: 論理プロパティとCSS変数でコード量削減

### 制約事項

- 見た目と挙動はVue2版と完全に等価
- Options APIを維持（Composition APIへの書き換えは行わない）
- CSSリセット、Tailwind/DaisyUI等は導入していない
- 1カラム固定（2カラム化は禁止）
- 過去回答の表示は禁止

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

### テーマ切り替え

現在は`legacy-light`テーマがデフォルトで適用されています。ダークテーマに切り替えるには：

```javascript
// ブラウザの開発者ツールで実行
document.documentElement.dataset.theme = 'legacy-dark'
```

### 背景画像の差し替え

新しい背景画像を適用するには：

1. `public/images/`に画像を配置
2. `src/styles.css`のCSS変数を更新：
   ```css
   :root {
     --bg-mobile: url('/images/新しいモバイル画像.jpg');
     --bg-desktop: url('/images/新しいデスクトップ画像.jpg');
   }
   ```

### ブレークポイント

- **モバイル**: 375px〜767px
- **タブレット**: 768px〜1023px  
- **デスクトップ**: 1024px以上

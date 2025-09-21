# Learning Style Checker

学習スタイル診断アプリケーション

## 概要

Vue 3 + Vite + Tailwind CSS + DaisyUI で構築された学習スタイル診断アプリケーションです。視覚・聴覚・触覚の3つの学習タイプを24問の質問で診断し、結果をシェアできるPWA対応のWebアプリです。

## クイックスタート

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# ビルド後のプレビュー（PWA動作確認）
npm run preview
```

**アクセス**: http://localhost:3000

## 進捗サマリー

### Phase 1: Vue2→Vue3等価移植完了
Vue2からVue3への完全な等価移植を実施。Options APIを維持し、既存の動作を完全に再現。

### Phase 2: レスポンシブ・レイアウト最適化完了
現代的なレスポンシブデザインとレイアウト最適化を実装。モバイルファーストで全デバイスに対応。

### Phase 3: テーマ切替・キャライラスト表示完了
ライト/ダークテーマ切替と結果画面キャライラスト表示（ダミー）を実装。

### Phase 4: 全年齢専用リファクタリング完了
コンテンツパック関連・モード切替・レア抽選を除去し、全年齢専用のシンプル構成にリファクタリング。

### Phase 5: 包括的シェア機能実装完了
X / LINE / WhatsApp / Facebook / Copy Link の5つのシェア機能とOGP対応の静的ページを実装。

### Phase 6: UI/UX改善・PWA対応完了
Tailwind CSS + DaisyUI導入、進捗UI改善、A11y仕上げ、PWA対応を実装。

### Phase 7: PWA/OGP 本番対応（2025-09-21）
- **PWA有効化**
  - `vite-plugin-pwa` を導入し、Service Worker を本番で登録
  - `main.js` に `registerSW` を追加し、自動更新・オフライン対応を確認
  - manifest とアイコン（192px/512px）を設定
  - 本番デプロイ後、インストールボタン表示とオフラインでトップページ表示を確認済み

- **OGP調整**
  - `index.html` の OGP/Twitter メタタグを `%VITE_SITE_ORIGIN%` を用いた絶対URLに修正
  - 共通 OGP: `/og/og-all.png` を使用
  - 結果タイプ別 OGP: `/public/share/*.html` を本番URLへ置換して生成
  - 各タイプでシェア時に正しいサムネイルが表示されることを確認

- **Vercel デプロイ**
  - 本番URL: [https://learningstylechecker.vercel.app](https://learningstylechecker.vercel.app)
  - `VITE_SITE_ORIGIN` を環境変数に設定し、本番ビルドで反映
  - master マージにより自動デプロイ → 正常に公開完了


## 実装ハイライト

### Tailwind CSS + DaisyUI
- **カスタムテーマ**: `ls-light` / `ls-dark` の2テーマを定義
- **DaisyUI活用**: 最小限のDaisyUIクラスでモダンなUIを実現
- **既存配色保持**: 元のデザインカラーを維持しつつ、アクセシビリティを向上

### 進捗UI
- **進捗数値**: カード右上に現在の質問番号を表示
- **進捗バー**: スムーズなアニメーション付きのプログレスバー
- **ステップドット**: 視覚的な進捗表示（デスクトップのみ）
- **PRM対応**: `prefers-reduced-motion`でアニメーション制御

### A11y（アクセシビリティ）
- **WAI-ARIA**: `role`、`aria-*`属性を適切に設定
- **フォーカス管理**: `focus-visible:outline-primary`でフォーカスリング改善
- **コントラスト**: `text-base-content/90`でAA基準をクリア
- **キーボード操作**: タブ順序とキーボードナビゲーションを最適化

### PWA
- **vite-plugin-pwa**: 自動更新機能付きのService Worker
- **マニフェスト**: アプリ名、アイコン、テーマカラーを設定
- **オフライン対応**: 基本的なオフライン機能を提供

### マイクロインタラクション
- **ボタンホバー**: `hover:scale-105`で軽やかな拡大効果
- **進捗アニメーション**: `transition-[width] duration-500 ease-out`でスムーズな進行
- **質問切替**: フェード/スライドアニメーション（PRM対応）

### タイポグラフィ改善
- **文字間隔**: `tracking-wide`で読みやすさを向上
- **行間**: `leading-relaxed`で余白感を演出
- **コントラスト**: 説明文・数値の視認性を向上

### ダークテーマ背景階層
- **二層構造**: `bg-base-100`（メインカード）+ `bg-base-200`（サブカード）
- **モダンなネオダークUI**: カード背景とページ背景の階層化

## 画像差し替え

### 仕様
- **形式**: WebP 推奨（品質~80, ≤200KB/枚）
- **サイズ**: 結果画像 1280x720 固定、Start画像（mobile 1080x1920 / desktop 1920x1080）
- **代替形式**: SVG（補足）

### 手順

#### 1. 結果画面用画像の差し替え
```bash
# 以下のファイルを同名で置き換え（各 1280x720）
/public/images/characters/v.webp    # 視覚タイプ
/public/images/characters/a.webp    # 聴覚タイプ
/public/images/characters/t.webp    # 触覚・運動感覚タイプ
/public/images/characters/va.webp   # 視覚＆聴覚タイプ
/public/images/characters/vt.webp   # 視覚＆触覚・運動感覚タイプ
/public/images/characters/at.webp   # 聴覚＆触覚・運動感覚タイプ
/public/images/characters/all.webp  # バランスタイプ
```

#### 2. Start画面用画像の差し替え
```bash
# 以下のファイルを同名で置き換え
/public/images/start-card-mobile.webp  # 1080x1920（モバイル用、縦長）
/public/images/start-card-desktop.webp # 1920x1080（デスクトップ用、横長）
```

#### 3. 差し替え実行
1. **既存ダミー削除**: 現在の`.svg`ファイルを削除
2. **本番画像配置**: 上記のファイル名で本番画像を`/public/images/`に配置
3. **動作確認**: アプリケーションを起動して画像が正しく表示されることを確認

## OGP とシェア

### デフォルトOGP
- **共通画像**: `/public/og/og-all.png` を使用
- **メタタグ**: 基本的なOGP設定を`index.html`に配置

### 任意拡張（動的OGP）
- **動的生成**: Vercel OG Image Function / Satori で variant クエリを受けて画像を出し分け
- **URL例**: `?variant=va` で視覚・聴覚タイプのOGP画像を生成

### シェア機能
- **5つのプラットフォーム**: X / LINE / WhatsApp / Facebook / Copy Link
- **共有文言**: 「あなたの学習タイプは「{タイプ名}タイプ」でした！」
- **ハッシュタグ**: #LearningStyleChecker #学習特性診断
- **UTM**: トラッキング用のUTMパラメータを自動付与

### キャッシュ対策
- **X**: キャッシュクリアツールを使用
- **Facebook**: デバッガーでキャッシュクリア
- **LINE**: 時間経過で自動更新
- **WhatsApp**: 即座に反映

## PWA

### 機能
- **自動更新**: `vite-plugin-pwa`によるService Worker自動更新
- **オフライン対応**: 基本的なオフライン機能
- **インストール**: ブラウザからアプリとしてインストール可能

### 設定
- **マニフェスト**: アプリ名、アイコン、テーマカラーを設定
- **アイコン**: `/public/icons/` に192x192、512x512のPNGファイルを配置

## 環境変数

### シェア機能用のサイトURL設定

Vercelの環境変数でサイトの絶対URLを設定：

```bash
# Vercel Environment Variables
VITE_SITE_ORIGIN=https://your-domain.vercel.app
```

### 開発環境での設定

ローカル開発時は `.env.development` ファイルを作成：

```bash
# .env.development ファイル
VITE_SITE_ORIGIN=http://localhost:3000
```

## 技術スタック

- **Vue 3**: フロントエンドフレームワーク
- **Vite**: ビルドツール
- **TypeScript**: 型安全性
- **Tailwind CSS**: ユーティリティファーストCSS
- **DaisyUI**: Tailwind CSSコンポーネントライブラリ
- **vue-i18n**: 国際化対応
- **vite-plugin-pwa**: PWA対応

## フォルダ構成

```
src/
├── main.ts              # エントリーポイント
├── App.vue              # メインアプリケーション
├── assets/
│   └── main.css         # スタイルシート
├── components/
│   ├── Start.vue        # スタート画面
│   ├── Checklist.vue    # 質問画面
│   ├── Result.vue       # 結果画面
│   ├── ShareButtons.vue # シェアボタン
│   └── ResultImage.vue  # 結果画像表示
├── composables/
│   └── useDiagnosis.ts  # 診断ロジック
├── utils/
│   └── buildQuestions.ts # 質問データ構築
├── i18n/
│   ├── ja.js            # 日本語翻訳
│   └── en.js            # 英語翻訳
└── styles.css           # グローバルスタイル

public/
├── images/
│   ├── characters/      # 結果画像（7種類）
│   ├── start-card-mobile.webp
│   └── start-card-desktop.webp
├── og/                  # OGP画像
├── icons/               # PWAアイコン
└── share/               # シェア用静的ページ
```

## 開発タスク（DoDチェックリスト）

### 画像関連
- [ ] 画像7種の表示確認（v, a, t, va, vt, at, all）
- [ ] alt属性のi18n対応確認
- [ ] 画像サイズ最適化（≤200KB/枚）
- [ ] WebP形式での配信確認

### 進捗UI
- [ ] 進捗数値表示（右上）
- [ ] 進捗バーアニメーション
- [ ] ステップドット表示
- [ ] PRM対応（アニメーション無効化）

### A11y
- [ ] role/aria属性の適切な設定
- [ ] フォーカスリング表示
- [ ] コントラストAA基準クリア
- [ ] キーボードナビゲーション

### PWA
- [ ] Service Worker登録確認
- [ ] オフライン閲覧テスト
- [ ] インストール機能確認
- [ ] マニフェスト設定確認

### OGP
- [ ] 共通OGP表示確認
- [ ] 動的OGP動作確認（任意）
- [ ] シェア機能動作確認
- [ ] キャッシュ対策確認

### README
- [ ] デモURL更新
- [ ] 環境変数設定手順
- [ ] 起動手順の最新化

## 付録：レガシー（Vue2）情報

### Vue2版の特徴
- **Options API**: Vue2の標準的な書き方
- **jQuery依存**: DOM操作にjQueryを使用
- **SCSS**: スタイリングにSCSSを使用
- **レガシー対応**: 古いブラウザサポート

### レガシーファイル
```
legacy-vue2/
├── js/app.js        # Vue2のメインアプリケーション
├── css/style.css    # スタイルシート
├── scss/            # SCSSファイル群
├── img/             # 画像ファイル
├── dist/            # ビルド済みファイル
└── index-vue2.html  # Vue2版のHTML
```

### 制約事項
- 見た目と挙動はVue2版と完全に等価
- Options APIを維持（Composition APIへの書き換えは行わない）
- 1カラム固定（2カラム化は禁止）
- 過去回答の表示は禁止
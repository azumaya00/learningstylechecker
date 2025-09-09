/**
 * コンテンツパックの型定義
 * 全年齢版と18禁版で異なるコンテンツを管理するためのスキーマ
 */

/**
 * アプリケーションモード
 * - allages: 全年齢版（レア画像なし）
 * - adult: 18禁版（レア画像あり）
 */
export type AppMode = 'allages' | 'adult';

/**
 * イラストエントリの設定
 * 通常画像とレア画像の配列、およびレア画像の排出率を定義
 */
export interface IllustEntry {
  /** 通常画像のID配列 */
  normal: string[];
  /** レア画像のID配列（全年齢版では空配列） */
  rare: string[];
  /** レア画像の排出率（0.0-1.0、全年齢版では0.0） */
  rareRate: number;
}

/**
 * カテゴリ別のイラスト設定
 * 将来的に聴覚、触覚などのカテゴリを追加予定
 */
export interface IllustCategories {
  /** 視覚学習タイプ用のイラスト設定 */
  visual: IllustEntry;
  // 今後追加予定のカテゴリ
  // auditory: IllustEntry;
  // tactile: IllustEntry;
}

/**
 * コンテンツパックの全体構造
 * モードとカテゴリ別のイラスト設定を含む
 */
export interface ContentPack {
  /** アプリケーションモード */
  mode: AppMode;
  /** カテゴリ別のイラスト設定 */
  categories: IllustCategories;
}

/**
 * アセット解決結果
 * 選択されたイラストのIDとタイプ（通常/レア）を返す
 */
export interface AssetResult {
  /** 選択されたイラストのID */
  id: string;
  /** イラストのタイプ（通常/レア） */
  type: 'normal' | 'rare';
  /** 選択されたカテゴリ */
  category: keyof IllustCategories;
}

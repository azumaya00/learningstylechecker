/**
 * コンテンツパック解決レイヤー
 * モードに応じて適切なコンテンツパックを返す
 */

import type { ContentPack, AppMode } from '../schema/contentpack.schema';

// コンテンツパックのインポート
import allAgesPack from '../contentpacks/allages.json';
import adultPack from '../contentpacks/adult.json';

/**
 * 指定されたモードに対応するコンテンツパックを取得
 * @param mode アプリケーションモード
 * @returns 対応するコンテンツパック
 */
export function getContentPack(mode: AppMode): ContentPack {
  switch (mode) {
    case 'allages':
      return allAgesPack as ContentPack;
    case 'adult':
      return adultPack as ContentPack;
    default:
      throw new Error(`Unknown app mode: ${mode}`);
  }
}

/**
 * 現在のアプリケーションモードに対応するコンテンツパックを取得
 * @returns 現在のモードに対応するコンテンツパック
 */
export function getCurrentContentPack(): ContentPack {
  const mode = import.meta.env.VITE_APP_MODE as AppMode || 'allages';
  return getContentPack(mode);
}

/**
 * コンテンツパックの整合性を検証
 * @param pack 検証するコンテンツパック
 * @returns 検証結果（true: 正常, false: 異常）
 */
export function validateContentPack(pack: ContentPack): boolean {
  // 全年齢版の場合の検証
  if (pack.mode === 'allages') {
    const visual = pack.categories.visual;
    
    // レア画像が空でない場合は警告
    if (visual.rare.length > 0) {
      console.warn('[ContentPack] All-ages mode should not have rare images');
      return false;
    }
    
    // レア排出率が0でない場合は警告
    if (visual.rareRate > 0) {
      console.warn('[ContentPack] All-ages mode should have rareRate = 0');
      return false;
    }
  }
  
  // 18禁版の場合の検証
  if (pack.mode === 'adult') {
    const visual = pack.categories.visual;
    
    // レア排出率が適切な範囲内かチェック
    if (visual.rareRate < 0.05 || visual.rareRate > 0.10) {
      console.warn(`[ContentPack] Adult mode rareRate should be between 0.05-0.10, got: ${visual.rareRate}`);
    }
  }
  
  return true;
}

/**
 * 利用可能なすべてのコンテンツパックを取得
 * @returns すべてのコンテンツパックの配列
 */
export function getAllContentPacks(): ContentPack[] {
  return [
    allAgesPack as ContentPack,
    adultPack as ContentPack
  ];
}

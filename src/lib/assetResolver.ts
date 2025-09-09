/**
 * アセット解決ロジック
 * 診断結果のIDをそのまま画像IDとして使用し、テーマに応じて画像を選択
 */

import { loadContentPack } from './dataLoader';
import type { ContentPack, TypeId } from '../schema/contentpack.schema';

/**
 * ランダム数値生成器の型定義
 * テスト時に固定値を渡せるようにする
 */
export type RandomNumberGenerator = () => number;

/**
 * 指定されたタイプIDからイラストを選択
 * @param typeId 診断結果のタイプID（result.idと一致）
 * @param rng ランダム数値生成器（デフォルト: Math.random）
 * @returns 選択された画像ID
 */
export function pickIllust(
  typeId: TypeId,
  rng: RandomNumberGenerator = Math.random
): string {
  const pack = loadContentPack();
  const config = pack.categories[typeId];
  
  if (!config) {
    throw new Error(`Unknown typeId: ${String(typeId)}`);
  }
  
  // レア画像の条件をチェック
  const hasRare = config.rare.length > 0 && config.rareRate > 0;
  
  // レア画像を試行するかどうかを判定
  if (hasRare && rng() < config.rareRate) {
    return config.rare[0]; // レアは1枚
  }
  
  // 通常画像を選択
  return config.normal[0]; // 通常は1枚
}

/**
 * 指定されたタイプIDのレア排出率を取得
 * @param typeId 診断結果のタイプID
 * @returns レア画像の排出率
 */
export function getRareRate(typeId: TypeId): number {
  const pack = loadContentPack();
  const config = pack.categories[typeId];
  
  if (!config) {
    throw new Error(`Unknown typeId: ${String(typeId)}`);
  }
  
  return config.rareRate;
}

/**
 * デバッグ用: 現在の設定をコンソールに出力
 */
export function debugContentPack(): void {
  const pack = loadContentPack();
  
  console.log('[AssetResolver] Current Configuration:', {
    mode: pack.mode,
    categories: Object.entries(pack.categories).map(([id, config]) => ({
      id,
      normalCount: config.normal.length,
      rareCount: config.rare.length,
      rareRate: config.rareRate
    }))
  });
}

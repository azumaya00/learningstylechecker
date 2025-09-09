/**
 * データローダー
 * コンテンツパックとアセットマップの読み込み・検証を行う
 */

import { ContentPackSchema, type ContentPack } from '../schema/contentpack.schema';
import { AssetMapSchema, type AssetMap } from '../schema/assets.schema';
import { getAppMode } from './env';

// JSONファイルのインポート
import allAgesPack from '../contentpacks/allages.json';
import adultPack from '../contentpacks/adult.json';
import allAgesAssetMap from '../assets/map.allages.json';
import adultAssetMap from '../assets/map.adult.json';

/**
 * コンテンツパックを読み込み・検証
 * @returns 検証済みのコンテンツパック
 */
export function loadContentPack(): ContentPack {
  const mode = getAppMode();
  
  // モードに応じてJSONファイルを選択
  const raw = mode === 'adult' ? adultPack : allAgesPack;

  // Zodスキーマで検証
  const pack = ContentPackSchema.parse(raw);

  // 全年齢版はレア禁止を強制
  if (pack.mode === 'allages') {
    for (const k of Object.keys(pack.categories) as Array<keyof typeof pack.categories>) {
      const e = pack.categories[k];
      if (!e) continue;
      e.rare = [];
      e.rareRate = 0;
    }
  }
  
  return pack;
}

/**
 * アセットマップを読み込み・検証
 * @returns 検証済みのアセットマップ
 */
export function loadAssetMap(): AssetMap {
  const mode = getAppMode();
  
  // モードに応じてJSONファイルを選択
  const raw = mode === 'adult' ? adultAssetMap : allAgesAssetMap;
    
  // Zodスキーマで検証
  return AssetMapSchema.parse(raw);
}

/**
 * 現在のモードで利用可能なすべての画像IDを取得
 * @returns 利用可能な画像IDの配列
 */
export function getAvailableImageIds(): string[] {
  const pack = loadContentPack();
  const ids: string[] = [];
  
  for (const category of Object.values(pack.categories)) {
    ids.push(...category.normal);
    ids.push(...category.rare);
  }
  
  return [...new Set(ids)]; // 重複を除去
}

/**
 * 指定された画像IDが存在するかチェック
 * @param imageId チェックする画像ID
 * @returns 存在する場合true
 */
export function hasImageId(imageId: string): boolean {
  const availableIds = getAvailableImageIds();
  return availableIds.includes(imageId);
}

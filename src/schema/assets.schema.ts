/**
 * アセットマップのZodスキーマ定義
 * light/darkテーマに対応した画像パス管理
 */

import { z } from 'zod';

/**
 * 画像のバリアント（light/dark）
 */
export const AssetVariantSchema = z.object({
  /** ライトテーマ用の画像パス */
  light: z.string().min(1),
  /** ダークテーマ用の画像パス */
  dark: z.string().min(1)
});

/**
 * アセットマップ（画像ID → { light, dark }）
 */
export const AssetMapSchema = z.record(z.string(), AssetVariantSchema);

/**
 * 画像バリアントの型定義
 */
export type AssetVariant = z.infer<typeof AssetVariantSchema>;

/**
 * アセットマップの型定義
 */
export type AssetMap = z.infer<typeof AssetMapSchema>;

/**
 * コンテンツパックのZodスキーマ定義
 * 診断結果のIDをそのまま画像IDとして使用する仕様に対応
 */

import { z } from 'zod';

/**
 * 診断結果のタイプID（result.idと完全一致）
 */
export const TypeId = z.enum(['v', 'a', 't', 'va', 'vt', 'at', 'all']);

/**
 * 通常画像のID（診断結果のIDと一致）
 */
const IdNormal = z.enum(['v', 'a', 't', 'va', 'vt', 'at', 'all']);

/**
 * レア画像のID（視覚のみ）
 */
const IdRare = z.literal('v__RARE');

/**
 * イラストエントリの設定
 */
export const IllustEntry = z.object({
  /** 通常画像のID配列（原則1要素だが将来拡張可） */
  normal: z.array(IdNormal).min(1),
  /** レア画像のID配列（視覚のみ） */
  rare: z.array(IdRare).default([]),
  /** レア画像の排出率（0-1） */
  rareRate: z.number().min(0).max(1).default(0)
});

/**
 * コンテンツパックの全体構造
 */
export const ContentPackSchema = z.object({
  /** アプリケーションモード */
  mode: z.enum(['allages', 'adult']),
  /** カテゴリ別のイラスト設定（診断結果のIDをキーとして使用） */
  categories: z.record(TypeId, IllustEntry)
});

/**
 * コンテンツパックの型定義
 */
export type ContentPack = z.infer<typeof ContentPackSchema>;

/**
 * 診断結果のタイプIDの型定義
 */
export type TypeId = z.infer<typeof TypeId>;

/**
 * 診断ロジック
 * スコアに基づいて学習タイプを判定
 */

import type { TypeId, Scores } from "../types/assets";

/**
 * 学習タイプを判定する
 * @param scores 各学習スタイルのスコア
 * @returns 判定された学習タイプのID
 */
export function computeTypeId(scores: Scores): TypeId {
  const { visual, auditory, tactile } = scores;

  // 各スコアの最大値を取得
  const maxScore = Math.max(visual, auditory, tactile);

  // 最高スコアの学習スタイルを特定
  const dominantStyles = [];
  if (visual === maxScore) dominantStyles.push("v");
  if (auditory === maxScore) dominantStyles.push("a");
  if (tactile === maxScore) dominantStyles.push("t");

  // 複数の学習スタイルが同点の場合
  if (dominantStyles.length > 1) {
    if (dominantStyles.includes("v") && dominantStyles.includes("a")) {
      return "va";
    }
    if (dominantStyles.includes("v") && dominantStyles.includes("t")) {
      return "vt";
    }
    if (dominantStyles.includes("a") && dominantStyles.includes("t")) {
      return "at";
    }
    if (dominantStyles.length === 3) {
      return "all";
    }
  }

  // 単一の学習スタイルが優勢の場合
  if (dominantStyles.length === 1) {
    return dominantStyles[0] as TypeId;
  }

  // デフォルトは全部盛りタイプ
  return "all";
}

/**
 * スコア配列をScoresオブジェクトに変換
 * @param scoreArray スコア配列
 * @returns Scoresオブジェクト
 */
export function convertScoreArray(
  scoreArray: Array<{ type: string; val: number }>
): Scores {
  const visual = scoreArray.find((s) => s.type === "visual")?.val || 0;
  const auditory = scoreArray.find((s) => s.type === "auditory")?.val || 0;
  const tactile = scoreArray.find((s) => s.type === "tactile")?.val || 0;

  return { visual, auditory, tactile };
}

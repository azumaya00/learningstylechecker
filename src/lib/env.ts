/**
 * 環境変数管理ユーティリティ
 * アプリケーションモードの取得と検証を行う
 */

import type { AppMode } from '../types/contentpack';

/**
 * 環境変数からアプリケーションモードを取得
 * @returns アプリケーションモード（デフォルト: 'allages'）
 */
export function getAppMode(): AppMode {
  const mode = import.meta.env.VITE_APP_MODE as string;
  
  // 環境変数が設定されていない場合は全年齢版をデフォルトとする
  if (!mode) {
    return 'allages';
  }
  
  // 有効なモードかチェック
  if (mode === 'allages' || mode === 'adult') {
    return mode as AppMode;
  }
  
  // 無効な値の場合は警告を出して全年齢版をデフォルトとする
  console.warn(`Invalid APP_MODE: ${mode}. Defaulting to 'allages'.`);
  return 'allages';
}

/**
 * アプリケーションモードが全年齢版かどうかを判定
 * @returns 全年齢版の場合true
 */
export function isAllAgesMode(): boolean {
  return getAppMode() === 'allages';
}

/**
 * アプリケーションモードが18禁版かどうかを判定
 * @returns 18禁版の場合true
 */
export function isAdultMode(): boolean {
  return getAppMode() === 'adult';
}

/**
 * 現在のアプリケーションモードをコンソールに出力（デバッグ用）
 */
export function logAppMode(): void {
  const mode = getAppMode();
  console.log(`[ContentPack] App Mode: ${mode}`);
}

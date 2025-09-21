/**
 * テーマ管理ユーティリティ
 * テーマの保存・復元・切り替え機能を提供
 * light/darkテーマの検出機能を追加
 */

/**
 * テーマの型定義
 */
export type Theme = 'legacy-light' | 'legacy-dark';

/**
 * ダークテーマが好まれるかどうかを判定
 * @returns ダークテーマが好まれる場合true
 */
export function isDarkPreferred(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * テーマ変更を監視
 * @param callback テーマ変更時のコールバック関数
 * @returns 監視を停止する関数
 */
export function onThemeChange(callback: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => callback(mediaQuery.matches);
  
  // イベントリスナーを追加
  mediaQuery.addEventListener?.('change', handler);
  
  // 監視を停止する関数を返す
  return () => mediaQuery.removeEventListener?.('change', handler);
}

/**
 * 保存されたテーマを読み込み
 * @returns 保存されたテーマ、またはnull
 */
export function loadTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem('theme');
  if (saved === 'legacy-light' || saved === 'legacy-dark') {
    return saved;
  }
  return null;
}

/**
 * テーマを保存
 * @param theme 保存するテーマ
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('theme', theme);
  document.documentElement.dataset.theme = theme;
}

/**
 * 現在のテーマを取得
 * @returns 現在のテーマ
 */
export function getCurrentTheme(): Theme {
  const saved = loadTheme();
  if (saved) return saved;
  
  // システム設定を確認
  return isDarkPreferred() ? 'legacy-dark' : 'legacy-light';
}

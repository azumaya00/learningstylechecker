/**
 * アセット解決ロジックのテスト
 * 診断結果IDをそのまま画像IDとして使用する仕様を検証
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { pickIllust, getRareRate } from './assetResolver'
import type { RandomNumberGenerator } from './assetResolver'

// モック用のランダム数値生成器
const createMockRNG = (values: number[]): RandomNumberGenerator => {
  let index = 0
  return () => {
    if (index >= values.length) {
      throw new Error('Mock RNG exhausted')
    }
    return values[index++]
  }
}

describe('AssetResolver', () => {
  beforeEach(() => {
    // 環境変数をリセット
    vi.stubEnv('VITE_APP_MODE', 'allages')
  })

  describe('pickIllust', () => {
    it('全年齢版では常に通常画像IDを選択する', () => {
      vi.stubEnv('VITE_APP_MODE', 'allages')
      
      // 10000回試行してレア画像IDが0件であることを確認
      let rareCount = 0
      const trials = 10000
      
      for (let i = 0; i < trials; i++) {
        const result = pickIllust('v')
        if (result === 'v__RARE') {
          rareCount++
        }
      }
      
      expect(rareCount).toBe(0)
    })

    it('18禁版では指定された確率でレア画像IDを選択する', () => {
      vi.stubEnv('VITE_APP_MODE', 'adult')
      
      // 10000回試行してレア画像IDの確率が約8%であることを確認
      let rareCount = 0
      const trials = 10000
      
      for (let i = 0; i < trials; i++) {
        const result = pickIllust('v')
        if (result === 'v__RARE') {
          rareCount++
        }
      }
      
      const rareRate = rareCount / trials
      // 8% ± 1% の範囲内であることを確認
      expect(rareRate).toBeGreaterThan(0.07)
      expect(rareRate).toBeLessThan(0.09)
    })

    it('レア画像が空配列の場合は通常画像IDを選択する', () => {
      vi.stubEnv('VITE_APP_MODE', 'allages')
      
      const result = pickIllust('a')
      expect(result).toBe('a')
    })

    it('レア排出率が0の場合は通常画像IDを選択する', () => {
      vi.stubEnv('VITE_APP_MODE', 'allages')
      
      const result = pickIllust('v')
      expect(result).toBe('v')
    })

    it('カスタムRNGを使用してレア画像IDを強制選択できる', () => {
      vi.stubEnv('VITE_APP_MODE', 'adult')
      
      // 常にレア画像を選択するRNG（0.01 < 0.08）
      const mockRNG = createMockRNG([0.01])
      const result = pickIllust('v', mockRNG)
      
      expect(result).toBe('v__RARE')
    })

    it('カスタムRNGを使用して通常画像IDを強制選択できる', () => {
      vi.stubEnv('VITE_APP_MODE', 'adult')
      
      // 常に通常画像を選択するRNG（0.09 > 0.08）
      const mockRNG = createMockRNG([0.09])
      const result = pickIllust('v', mockRNG)
      
      expect(result).toBe('v')
    })
  })

  describe('getRareRate', () => {
    it('全年齢版のレア排出率は0である', () => {
      vi.stubEnv('VITE_APP_MODE', 'allages')
      
      const rate = getRareRate('v')
      expect(rate).toBe(0)
    })

    it('18禁版のレア排出率は0.08である', () => {
      vi.stubEnv('VITE_APP_MODE', 'adult')
      
      const rate = getRareRate('v')
      expect(rate).toBe(0.08)
    })

    it('視覚以外のタイプはレア排出率0である', () => {
      vi.stubEnv('VITE_APP_MODE', 'adult')
      
      expect(getRareRate('a')).toBe(0)
      expect(getRareRate('t')).toBe(0)
      expect(getRareRate('va')).toBe(0)
      expect(getRareRate('vt')).toBe(0)
      expect(getRareRate('at')).toBe(0)
      expect(getRareRate('all')).toBe(0)
    })
  })

  describe('エラーハンドリング', () => {
    it('存在しないタイプIDでエラーを投げる', () => {
      expect(() => {
        pickIllust('unknown' as any)
      }).toThrow('Unknown typeId: unknown')
    })

    it('無効なモードでもエラーを投げない（フォールバック）', () => {
      vi.stubEnv('VITE_APP_MODE', 'invalid')
      
      // 無効なモードの場合は全年齢版にフォールバックされる
      const result = pickIllust('v')
      expect(result).toBe('v')
    })
  })

  describe('統計的検証', () => {
    it('18禁版で10000回試行した際のレア画像ID分布を検証', () => {
      vi.stubEnv('VITE_APP_MODE', 'adult')
      
      const trials = 10000
      const results = {
        normal: 0,
        rare: 0
      }
      
      for (let i = 0; i < trials; i++) {
        const result = pickIllust('v')
        if (result === 'v__RARE') {
          results.rare++
        } else {
          results.normal++
        }
      }
      
      // 合計が試行回数と一致することを確認
      expect(results.normal + results.rare).toBe(trials)
      
      // レア画像の割合が期待値に近いことを確認
      const rareRate = results.rare / trials
      expect(rareRate).toBeGreaterThan(0.05)
      expect(rareRate).toBeLessThan(0.10)
    })
  })
})

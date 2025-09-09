<template>
  <div class="p-result">
    <h1 class="p-result__title">Result</h1>
    <div class="p-result__container">
      <!-- キャライラスト表示 -->
      <div class="result-hero">
        <img 
          :src="resultImage" 
          :alt="`診断結果: ${resultDiagnosis}`"
          loading="lazy"
        />
      </div>
      
      <div class="p-result__diagnosis">
        <h2 class="p-result__diagnosis__title">{{ texts.results?.diagnosisTitle || 'あなたは' }}<span>{{ currentResult.title }}</span>{{ texts.results?.diagnosisSuffix || 'タイプです！' }}</h2>
        <p v-html="currentResult.description" class="p-result__diagnosis__text"></p>
      </div>
      <div class="p-result__score">
        <h3 class="p-result__score__title">{{ texts.results?.scoreTitle || 'score' }}</h3>
        <table class="p-result__score__table">
          <tbody>
            <tr>
              <td class="p-result__score__table__column">{{ texts.results?.visualLabel || '視覚' }}:</td>
              <td class="p-result__score__table__column">{{ score[0].val }}{{ texts.results?.pointsSuffix || '点' }}</td>
            </tr>
            <tr>
              <td class="p-result__score__table__column">{{ texts.results?.auditoryLabel || '聴覚' }}:</td>
              <td class="p-result__score__table__column">{{ score[1].val }}{{ texts.results?.pointsSuffix || '点' }}</td>
            </tr>
            <tr>
              <td class="p-result__score__table__column">
                <span>{{ texts.results?.tactileLabel || '触覚・運動感覚' }}:&nbsp;</span>
              </td>
              <td class="p-result__score__table__column">{{ score[2].val }}{{ texts.results?.pointsSuffix || '点' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- シェアボタン -->
    <ShareButtons :type="selectedType" :locale="currentLocale" />
    
    <div class="c-btn__group">
      <button class="c-btn c-btn--middle c-btn--main" @click="clickRetry">{{ texts.buttons?.retry || '最初からやり直す' }}</button>
    </div>
  </div>
</template>

<script>
import { computeTypeId, convertScoreArray } from '../lib/diagnosis'
import { isDarkPreferred, onThemeChange } from '../lib/theme'
import assetMapRaw from '../assets/assetMap.js'
import ShareButtons from './ShareButtons.vue'

/**
 * 結果画面コンポーネント
 * 診断結果を表示し、学習スタイルに応じたアドバイスを提供
 * スコアに基づいて適切な学習タイプを判定
 * 新しいアセット解決システムを使用してイラストを選択
 */
export default {
  name: 'Result',
  components: {
    ShareButtons
  },
  props: {
    // 親コンポーネントから受け取るスコア配列
    score: {
      type: Array,
      required: true
    },
    // 現在のテーマ
    currentTheme: {
      type: String,
      required: true
    },
    // 現在の言語
    currentLocale: {
      type: String,
      required: true
    },
    // 国際化テキスト
    texts: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 判定された学習タイプ
      selectedType: 'all',
      // 現在の画像パス
      currentImagePath: '',
      // アセットマップ
      assetMap: assetMapRaw,
      // テーマ変更監視の停止関数
      stopThemeWatch: null
    }
  },
  computed: {
    /**
     * 結果画像のパスを取得
     * テーマに応じてlight/dark画像を選択
     * @returns {string} 結果画像のURL
     */
    resultImage() {
      return this.currentImagePath || `/images/result-${this.selectedType}.svg`
    },

    /**
     * 結果診断名を取得
     * @returns {string} 診断名
     */
    resultDiagnosis() {
      return this.texts.resultsLabels[this.selectedType] || '不明'
    },

    /**
     * 現在の結果データを取得
     * @returns {Object} 結果データ
     */
    currentResult() {
      return this.texts.results[this.selectedType] || this.texts.results.all
    }
  },
  watch: {
    /**
     * テーマ変更を監視
     * テーマが変更されたときに画像パスを更新
     */
    currentTheme() {
      console.log('[Result] Theme changed to:', this.currentTheme)
      this.updateImagePath()
    }
  },
  created() {
    // コンポーネント作成時に学習タイプを判定
    this.determineLearningType()
    this.updateImagePath()
  },
  
  beforeUnmount() {
    // テーマ変更監視を停止
    if (this.stopThemeWatch) {
      this.stopThemeWatch()
    }
  },
  methods: {
    /**
     * 画像パスを更新
     * 現在のテーマに応じてlight/dark画像を選択
     */
    updateImagePath() {
      if (!this.assetMap || !this.selectedType) {
        console.warn('[Result] Missing assetMap or selectedType, using fallback')
        this.currentImagePath = `/images/result-${this.selectedType}.svg`
        return
      }
      
      const asset = this.assetMap[this.selectedType]
      if (!asset) {
        console.warn('[Result] Asset not found for type:', this.selectedType)
        this.currentImagePath = `/images/result-${this.selectedType}.svg`
        return
      }
      
      // 現在のテーマに応じて画像を選択
      const isDark = this.currentTheme === 'legacy-dark'
      this.currentImagePath = isDark ? asset.dark : asset.light
      
      console.log('[Result] Updated image path:', this.currentImagePath, '(isDark:', isDark, ', theme:', this.currentTheme, ')')
    },

    /**
     * スコアに基づいて学習タイプを判定
     * 新しい診断ロジックを使用
     */
    determineLearningType() {
      const scores = convertScoreArray(this.score)
      this.selectedType = computeTypeId(scores)
      console.log('[Result] Determined learning type:', this.selectedType)
    },


    /**
     * リトライボタンクリック時の処理
     * 親コンポーネントにリトライイベントを送信
     */
    clickRetry() {
      this.$emit('retry-check')
    }
  }
}
</script>

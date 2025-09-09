<template>
  <div class="p-checklist">
    <ul class="p-checklist__list">
      <transition-group appear mode="in-out" name="question" tag="ul">
        <li v-for="(question, index) in filteredItems" :key="question.id" class="p-checklist__list__item">
          <h1 class="p-checklist__title">Q{{ currentQuestion }}.</h1>
          <div class="p-checklist__question">
            <p v-html="question.text" class="p-checklist__question__text"></p>
          </div>
        </li>
      </transition-group>
    </ul>
    <div class="p-checklist__btn-group">
      <button class="c-btn c-btn--middle c-btn--accent" @click="addPoint(5)">いつも<br>そうだ</button>
      <button class="c-btn c-btn--middle c-btn--sub" @click="addPoint(3)">時々<br>そうだ</button>
      <button class="c-btn c-btn--middle c-btn--main" @click="addPoint(1)">めったに<br>ない</button>
    </div>
  </div>
</template>

<script>
import ja from '../i18n/ja.js'

/**
 * チェックリスト画面コンポーネント
 * 24問の質問を順次表示し、ユーザーの回答に基づいてスコアを計算
 * 視覚・聴覚・触覚・運動感覚の3つの学習スタイルを診断
 */
export default {
  name: 'Checklist',
  data() {
    return {
      // 現在の質問番号（1-24）
      currentQuestion: 1,
      // 各学習スタイルのスコア
      score: [
        { type: 'visual', val: 0 },      // 視覚学習
        { type: 'auditory', val: 0 },    // 聴覚学習
        { type: 'tactile', val: 0 }      // 触覚・運動感覚学習
      ],
      // 国際化テキスト
      texts: ja,
      // 診断用の質問リスト（i18nから取得）
      questions: ja.questions.map((text, index) => ({
        id: index + 1,
        text: text
      })),
      // ランダム化された質問順序
      shuffledQuestions: []
    }
  },
  computed: {
    /**
     * 現在表示する質問を取得
     * @returns {Array} 現在の質問オブジェクトの配列
     */
    filteredItems() {
      // ランダム化された質問配列から現在の質問を取得
      const currentQuestionData = this.shuffledQuestions[this.currentQuestion - 1]
      return currentQuestionData ? [currentQuestionData] : []
    }
  },
  created() {
    // コンポーネント作成時に質問をランダム化
    this.shuffleQuestions()
  },
  methods: {
    /**
     * 質問をランダム化する
     * 24個全ての質問をランダムに並び替える（Fisher-Yatesシャッフル）
     */
    shuffleQuestions() {
      // Fisher-Yatesシャッフルアルゴリズム
      const shuffleArray = (array) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
      }
      
      // 全24問をランダムに並び替え
      this.shuffledQuestions = shuffleArray(this.questions)
      
      // 重複チェック
      const ids = this.shuffledQuestions.map(q => q.id)
      const uniqueIds = [...new Set(ids)]
      if (ids.length !== uniqueIds.length) {
        console.warn('[Checklist] Duplicate questions detected! Re-shuffling...')
        this.shuffleQuestions()
        return
      }
      
      console.log('[Checklist] All questions shuffled:', this.shuffledQuestions.map(q => q.id))
    },

    /**
     * 回答に基づいてスコアを加算し、次の質問へ進む
     * ランダム化された質問でも正しいスコアを計算
     * @param {number} point - 加算するポイント（1, 3, 5のいずれか）
     */
    addPoint(point) {
      // 1問目：スコアをリセット（質問の再ランダム化は行わない）
      if (this.currentQuestion === 1) {
        this.score[0].val = 0
        this.score[1].val = 0
        this.score[2].val = 0
      }
      
      // 現在の質問の元のIDを取得
      const currentQuestionData = this.shuffledQuestions[this.currentQuestion - 1]
      const originalId = currentQuestionData.id
      
      // 元のIDに基づいてスコアを加算
      if (originalId >= 1 && originalId <= 8) {
        // 視覚学習（visual）
        this.score[0].val += point
      } else if (originalId >= 9 && originalId <= 16) {
        // 聴覚学習（auditory）
        this.score[1].val += point
      } else if (originalId >= 17 && originalId <= 24) {
        // 触覚・運動感覚学習（tactile）
        this.score[2].val += point
      }
      
      // 次の質問へ進む
      this.currentQuestion++
      
      // 最後の質問の場合は診断完了
      if (this.currentQuestion > 24) {
        this.completeDiagnosis()
      }
    },
    
    /**
     * スコアを初期化（リトライ時）
     */
    resetScores() {
      this.score[0].val = 0
      this.score[1].val = 0
      this.score[2].val = 0
      this.currentQuestion = 1
      // リトライ時は質問を再ランダム化
      this.shuffleQuestions()
    },
    
    /**
     * 診断完了時の処理
     * 親コンポーネントにスコアを送信して結果画面へ遷移
     */
    completeDiagnosis() {
      this.$emit('finish-check', this.score)
    }
  }
}
</script>

<template>
  <div class="p-checklist">
    <ul class="p-checklist__list">
      <transition-group appear mode="in-out" name="question" tag="ul">
        <li v-for="(question, index) in filteredItems" :key="question.id" class="p-checklist__list__item">
          <h1 class="p-checklist__title">Q{{ question.id }}.</h1>
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
      // 診断用の質問リスト
      questions: [
        {
          id: 1,
          text: '講義を聴くより教科書を読む方を好む'
        },
        {
          id: 2,
          text: 'フラッシュカードを使うと覚えやすい'
        },
        { id: 3, text: 'クロスワードパズルが好きだ' },
        {
          id: 4,
          text: '勉強するときは書きとめたり<br>ノートを取ることを好む'
        },
        {
          id: 5,
          text: '地図を読んで目的地に行くのは得意だ'
        },
        { id: 6, text: '新しい情報は読んで得る事を好む' },
        {
          id: 7,
          text: '何かを覚えようとするときに<br>頭の中に図や絵を描くのが好きだ'
        },
        { id: 8, text: '表やグラフを作るのは楽しい' },
        {
          id: 9,
          text: '情報を理解するために<br>声に出して読むことがある'
        },
        {
          id: 10,
          text: '表やグラフは誰かに説明して貰う必要がある'
        },
        {
          id: 11,
          text: 'ニュースは新聞を読むより<br>ラジオで聞く方が好きだ'
        },
        {
          id: 12,
          text: '数学などの公式は書いて覚えるより<br>唱えて覚える方が好きだ'
        },
        {
          id: 13,
          text: '道案内は書かれたものより<br>音声で聞くほうを好む'
        },
        {
          id: 14,
          text: '物語は読むより朗読を聞く方を好む'
        },
        { id: 15, text: '電話番号は何回か唱えて覚える' },
        {
          id: 16,
          text: '何かを学ぶなら本より講義や音声教材が良い'
        },
        { id: 17, text: '体験型のアクティビティは楽しい' },
        {
          id: 18,
          text: '鍵やコイン、ペンなどを手で触って遊ぶ'
        },
        { id: 19, text: '実際に体験して学ぶことが好きだ' },
        { id: 20, text: '体を使って何かを学ぶ方を好む' },
        {
          id: 21,
          text: '勉強するときにガムを噛んだり<br>何かを食べながらする'
        },
        {
          id: 22,
          text: '誰かとひっついたり<br>何かを触ったりすると落ち着く'
        },
        {
          id: 23,
          text: '何かを覚えるときは何度か書いて覚える'
        },
        {
          id: 24,
          text: '講義より実験の方がたくさんのことを学べる'
        }
      ]
    }
  },
  computed: {
    /**
     * 現在表示する質問をフィルタリング
     * @returns {Array} 現在の質問番号に該当する質問オブジェクトの配列
     */
    filteredItems() {
      return this.searchItem(this.questions, this.currentQuestion)
    }
  },
  methods: {
    /**
     * 指定されたIDの質問を取得
     * @param {Array} questionList - 質問リスト
     * @param {number} questionId - 取得する質問のID
     * @returns {Array} 該当する質問オブジェクトの配列
     */
    searchItem(questionList, questionId) {
      return questionList.filter(question => question.id === questionId)
    },
    
    /**
     * 回答に基づいてスコアを加算し、次の質問へ進む
     * 質問の範囲に応じて適切な学習スタイルのスコアに加算
     * @param {number} point - 加算するポイント（1, 3, 5のいずれか）
     */
    addPoint(point) {
      // 1問目：スコアをリセットして視覚学習に加算
      if (this.currentQuestion === 1) {
        this.resetScores()
        this.score[0].val += point
        this.currentQuestion++
      }
      // 2-8問目：視覚学習（visual）
      else if (this.currentQuestion <= 8) {
        this.score[0].val += point
        this.currentQuestion++
      }
      // 9-16問目：聴覚学習（auditory）
      else if (this.currentQuestion <= 16) {
        this.score[1].val += point
        this.currentQuestion++
      }
      // 17-23問目：触覚・運動感覚学習（tactile）
      else if (this.currentQuestion <= 23) {
        this.score[2].val += point
        this.currentQuestion++
      }
      // 24問目：最後の質問、診断完了
      else if (this.currentQuestion === 24) {
        this.score[2].val += point
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

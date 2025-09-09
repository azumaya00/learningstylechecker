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
        <ul>
          <li v-for="(result, index) in filteredResults" :key="result.id">
            <h2 class="p-result__diagnosis__title">あなたは<span>{{ result.diagnosis }}</span>タイプです！</h2>
            <p v-html="result.text" class="p-result__diagnosis__text">
            </p>
          </li>
        </ul>
      </div>
      <div class="p-result__score">
        <h3 class="p-result__score__title">score</h3>
        <table class="p-result__score__table">
          <tbody>
            <tr>
              <td class="p-result__score__table__column">視覚:</td>
              <td class="p-result__score__table__column">{{ score[0].val }}点</td>
            </tr>
            <tr>
              <td class="p-result__score__table__column">聴覚:</td>
              <td class="p-result__score__table__column">{{ score[1].val }}点</td>
            </tr>
            <tr>
              <td class="p-result__score__table__column">
                <span>触覚・<br />運動感覚:&nbsp;</span>
              </td>
              <td class="p-result__score__table__column">{{ score[2].val }}点</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="c-btn__group">
      <button class="c-btn c-btn--middle c-btn--main" @click="clickRetry">最初からやり直す</button>
    </div>
  </div>
</template>

<script>
/**
 * 結果画面コンポーネント
 * 診断結果を表示し、学習スタイルに応じたアドバイスを提供
 * スコアに基づいて適切な学習タイプを判定
 */
export default {
  name: 'Result',
  props: {
    // 親コンポーネントから受け取るスコア配列
    score: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 判定された学習タイプ
      selectedType: 'all',
      // シェア用の診断結果テキスト
      shareResult: '',
      // 学習タイプ別の診断結果とアドバイス
      results: [
        {
          id: 'v',
          diagnosis: '視覚',
          text:
            'このタイプは基本的に本や図形など「目で見る形」で学ぶと理解しやすくなります。良質な教科書や参考書、テキスト系のWebサイトを活用しましょう！<br>(なお聴覚の数値が15点以下の場合は、動画で学ぶ事が難しいです)'
        },
        {
          id: 'a',
          diagnosis: '聴覚',
          text:
            'このタイプは「音声」で学ぶのが得意です。一般的な学校の授業や学習塾の講義に向いているのはこのタイプでしょう。家庭教師なども良いかも知れません。また、音声教材を積極的に利用すると良いでしょう。<br>(なお視覚の数値が15点以下の場合は、動画で学ぶ事が難しいです)'
        },
        {
          id: 't',
          diagnosis: '触覚・運動感覚',
          text:
            'このタイプは実際に物に触れ、体を動かして学ぶのが得意です。<br>実験や実習・フィールドワークなど、教科書の上ではない学びや、実際に何かを書く、アウトプットする事が理解への早道です。実際に触れられる模型やモデルを利用するのも良いですね。'
        },
        {
          id: 'va',
          diagnosis: '視覚＆聴覚',
          text:
            'おめでとう！あなたは最近のはやりである「動画で学ぶ」という方法に一番向いているタイプです！学校や塾の授業も(レベルが合っていれば)すんなりこなせるのではないかな？より点数の高い方を意識して使ってみましょう。'
        },
        {
          id: 'vt',
          diagnosis: '視覚＆触覚・運動感覚',
          text:
            '文字や図を使って理解したり、実際に触れたり体を動かして体験することで理解を深めるタイプです。インプットでの理解もアウトプットでの理解も得意なのが強みですね！インプットの際は書籍やテキスト系Webサイトなど「目で見る」情報を中心にするのがオススメです。'
        },
        {
          id: 'at',
          diagnosis: '聴覚＆触覚・運動感覚',
          text:
            '音声をを聞いたり、実際に触れたり体を動かして体験することで理解を深めるタイプです。インプットでの理解もアウトプットでの理解も得意なのが強みですね！インプットの際は本よりも音声講座を選ぶのがオススメです。'
        },
        {
          id: 'all',
          diagnosis: '全部盛り',
          text:
            'なに？差が付かないだと……！？<br>そんなあなたにおすすめなのは、ズバリ！筋トレです！！<br>筋肉は世界を救います！さあプロテインを盛ってスクワットから始めましょう！！<br>（※ネタです。この診断では判断がつきませんので、一番点数の高いタイプから試してみましょう)'
        }
      ]
    }
  },
  computed: {
    /**
     * 選択された学習タイプに該当する結果を取得
     * @returns {Array} 該当する診断結果オブジェクトの配列
     */
    filteredResults() {
      return this.getResultByType(this.results, this.selectedType)
    },

    /**
     * 結果画像のパスを取得
     * @returns {string} 結果画像のURL
     */
    resultImage() {
      return `/images/result-${this.selectedType}.svg`
    },

    /**
     * 結果診断名を取得
     * @returns {string} 診断名
     */
    resultDiagnosis() {
      const result = this.getResultByType(this.results, this.selectedType)
      return result[0]?.diagnosis || '不明'
    }
  },
  created() {
    // コンポーネント作成時に学習タイプを判定
    this.determineLearningType()
    this.setupShareResult()
  },
  methods: {
    /**
     * スコアに基づいて学習タイプを判定
     * 各学習スタイルのスコアを比較して適切なタイプを決定
     */
    determineLearningType() {
      const vision = this.score[0].val
      const auditory = this.score[1].val
      const tactile = this.score[2].val

      // 単独タイプの判定（5点以上の差がある場合）
      if (vision >= auditory + 5 && vision >= tactile + 5) {
        this.selectedType = 'v' // 視覚タイプ
      } else if (auditory >= vision + 5 && auditory >= tactile + 5) {
        this.selectedType = 'a' // 聴覚タイプ
      } else if (tactile >= vision + 5 && tactile >= auditory + 5) {
        this.selectedType = 't' // 触覚・運動感覚タイプ
      }
      // 複合タイプの判定
      else if (vision >= tactile + 5 && auditory >= tactile + 5 && Math.abs(vision - auditory) < 5) {
        this.selectedType = 'va' // 視覚＆聴覚タイプ
      } else if (vision >= auditory + 5 && tactile >= auditory + 5 && Math.abs(vision - tactile) < 5) {
        this.selectedType = 'vt' // 視覚＆触覚・運動感覚タイプ
      } else if (tactile >= vision + 5 && auditory >= vision + 5 && Math.abs(tactile - auditory) < 5) {
        this.selectedType = 'at' // 聴覚＆触覚・運動感覚タイプ
      }
      // 全部盛りタイプ（全ての差が5未満）
      else if (Math.abs(vision - auditory) < 5 && Math.abs(tactile - vision) < 5 && Math.abs(tactile - auditory) < 5) {
        this.selectedType = 'all' // 全部盛りタイプ
      } else {
        console.warn('学習タイプの判定で予期しない結果が発生しました')
        this.selectedType = 'all' // フォールバック
      }
    },

    /**
     * シェア用の診断結果を設定
     */
    setupShareResult() {
      const shareItem = this.getResultByType(this.results, this.selectedType)
      this.shareResult = shareItem[0]?.diagnosis || '不明'
      this.$emit('share-diagnosis', this.shareResult)
    },

    /**
     * 指定されたタイプの結果を取得
     * @param {Array} resultList - 結果リスト
     * @param {string} typeId - 取得するタイプのID
     * @returns {Array} 該当する結果オブジェクトの配列
     */
    getResultByType(resultList, typeId) {
      return resultList.filter(result => result.id === typeId)
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

<template>
  <div class="p-result">
    <h1 class="p-result__title">Result</h1>
    <div class="p-result__container">
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
export default {
  name: 'Result',
  props: {
    score: Array
  },
  data() {
    return {
      selectedType: 'all',
      shareResult: '',
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
            'なに・・？差が付かないだと・・！？<br>そんなあなたにおすすめなのは、ズバリ！筋トレです！！<br>筋肉は世界を救います！さあプロテインを盛ってスクワットから始めましょう！！<br>（※ネタです。この診断では判断がつきませんので、一番点数の高いタイプから試してみましょう)'
        }
      ]
    }
  },
  computed: {
    // 当てはまる結果を表示
    filteredResults() {
      return this.searchResult(this.results, this.selectedType)
    }
  },
  created() {
    // 結果の判定
    // 変数定義
    var vision = this.score[0].val
    var auditory = this.score[1].val
    var tactile = this.score[2].val

    // ある値が他の物より5以上多いときは単独タイプ
    if (vision >= auditory + 5 && vision >= tactile + 5) {
      this.selectedType = 'v'
    } else if (auditory >= vision + 5 && auditory >= tactile + 5) {
      this.selectedType = 'a'
    } else if (tactile >= vision + 5 && tactile >= auditory + 5) {
      this.selectedType = 't'

      // 2つの要素が残り一つより5以上多く、2つの差が5未満の時は複合タイプ
    } else if (
      vision >= tactile + 5 &&
      auditory >= tactile + 5 &&
      Math.abs(vision - auditory) < 5
    ) {
      this.selectedType = 'va'
    } else if (
      vision >= auditory + 5 &&
      tactile >= auditory + 5 &&
      Math.abs(vision - tactile) < 5
    ) {
      this.selectedType = 'vt'
    } else if (
      tactile >= vision + 5 &&
      auditory >= vision + 5 &&
      Math.abs(tactile - auditory) < 5
    ) {
      this.selectedType = 'at'

      // 全ての差が5未満の時は全部盛りタイプ
    } else if (
      Math.abs(vision - auditory) < 5 &&
      Math.abs(tactile - vision) < 5 &&
      Math.abs(tactile - auditory) < 5
    ) {
      this.selectedType = 'all'
    } else {
      console.log('式がおかしいよ！')
    }

    const self = this
    // シェア用診断名を取り出す
    const shareItem = this.results.filter(function(item) {
      return item.id === self.selectedType
    })
    this.shareResult = shareItem[0].diagnosis

    // 診断名を親に送る
    this.$emit('share-diagnosis', this.shareResult)
  },
  methods: {
    // 当てはまる結果のみを抽出
    searchResult(list, key) {
      return list.filter(function(result) {
        return result.id === key
      })
    },
    // リトライボタンでスタート画面へ
    clickRetry() {
      this.$emit('retry-check')
    }
  }
}
</script>

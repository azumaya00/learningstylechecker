import Vue from "vue";
import { stringify } from "querystring";

//start画面
Vue.component("start", {
  data: function() {
    return {};
  },
  computed: {},
  methods: {
    //スタートを押したら質問画面へ移動
    clickStart() {
      this.$emit("start-check");
    }
  },
  template: `
  <div class="p-start">
  <h1 class="p-start__title">Learning style<br />checker</h1>
  <p class="p-start__subtitle">あなたの学習スタイルはどのタイプ？</p>
  <button class="c-btn c-btn--large c-btn--main" v-on:click="clickStart">診断をはじめる</button>
</div>
  `
});

//質問画面
Vue.component("checklist", {
  data: function() {
    return {
      currentQuestion: 1,
      score: [
        { type: "visual", val: 0 },
        { type: "auditory", val: 0 },
        { type: "tactile", val: 0 }
      ],
      questions: [
        {
          id: 1,
          text: "講義を聴くより教科書を読む方を好む"
        },
        {
          id: 2,
          text: "フラッシュカードを使うと覚えやすい"
        },
        { id: 3, text: "クロスワードパズルが好きだ" },
        {
          id: 4,
          text: "勉強するときは書きとめたり<br>ノートを取ることを好む"
        },
        {
          id: 5,
          text: "地図を読んで目的地に行くのは得意だ"
        },
        { id: 6, text: "新しい情報は読んで得る事を好む" },
        {
          id: 7,
          text: "何かを覚えようとするときに<br>頭の中に図や絵を描くのが好きだ"
        },
        { id: 8, text: "表やグラフを作るのは楽しい" },
        {
          id: 9,
          text: "情報を理解するために<br>声に出して読むことがある"
        },
        {
          id: 10,
          text: "表やグラフは誰かに説明して貰う必要がある"
        },
        {
          id: 11,
          text: "ニュースは新聞を読むより<br>ラジオで聞く方が好きだ"
        },
        {
          id: 12,
          text: "数学などの公式は書いて覚えるより<br>唱えて覚える方が好きだ"
        },
        {
          id: 13,
          text: "道案内は書かれたものより<br>音声で聞くほうを好む"
        },
        {
          id: 14,
          text: "物語は読むより朗読を聞く方を好む"
        },
        { id: 15, text: "電話番号は何回か唱えて覚える" },
        {
          id: 16,
          text: "何かを学ぶなら本より講義や音声教材が良い"
        },
        { id: 17, text: "体験型のアクティビティは楽しい" },
        {
          id: 18,
          text: "鍵やコイン、ペンなどを手で触って遊ぶ"
        },
        { id: 19, text: "実際に体験して学ぶことが好きだ" },
        { id: 20, text: "体を使って何かを学ぶ方を好む" },
        {
          id: 21,
          text: "勉強するときにガムを噛んだり<br>何かを食べながらする"
        },
        {
          id: 22,
          text: "誰かとひっついたり<br>何かを触ったりすると落ち着く"
        },
        {
          id: 23,
          text: "何かを覚えるときは何度か書いて覚える"
        },
        {
          id: 24,
          text: "講義より実験の方がたくさんのことを学べる"
        }
      ]
    };
  },
  computed: {
    //フィルタした質問を表示
    filteredItems() {
      return this.searchItem(this.questions, this.currentQuestion);
    }
  },
  methods: {
    //現在の質問のみを取り出す
    searchItem(list, key) {
      return list.filter(function(question) {
        return question.id === key;
      });
    },
    //点数加算
    //1問目でリトライ時の値をリセット
    //24問目で結果画面へ遷移
    addPoint(point) {
      if (this.currentQuestion === 1) {
        this.score[0].val = 0;
        this.score[1].val = 0;
        this.score[2].val = 0;
        this.score[0].val += point;
        this.currentQuestion++;
      } else if (this.currentQuestion <= 8) {
        this.score[0].val += point;
        this.currentQuestion++;
      } else if (this.currentQuestion <= 16) {
        this.score[1].val += point;
        this.currentQuestion++;
      } else if (this.currentQuestion <= 23) {
        this.score[2].val += point;
        this.currentQuestion++;
      } else if (this.currentQuestion === 24) {
        this.score[2].val += point;
        //親にscoreを渡す
        this.$emit("finish-check", this.score);
      }
    }
  },
  template: `
  <div class="p-checklist">
  <ul class="p-checklist__list">
  <transition-group appear mode="in-out" name="question" tag="ul"><li v-for="(question,index) in filteredItems" v-bind:key="question.id" class="p-checklist__list__item">
  <h1 class="p-checklist__title">Q{{question.id}}.</h1>
  <div class="p-checklist__question">
    <p v-html="question.text" class="p-checklist__question__text"></p>
  </div>
  </li>
  </transition-group>
  </ul>
  <div class="p-checklist__btn-group">
    <button class="c-btn c-btn--middle c-btn--accent" v-on:click="addPoint(5)">いつも<br>そうだ</button>
    <button class="c-btn c-btn--middle c-btn--sub" v-on:click="addPoint(3)">時々<br>そうだ</button>
    <button class="c-btn c-btn--middle c-btn--main" v-on:click="addPoint(1)">めったに<br>ない</button>
  </div>
</div>
  `
});

//result画面
Vue.component("result", {
  data: function() {
    return {
      selectedType: "all",
      shareResult: "",
      results: [
        {
          id: "v",
          diagnosis: "視覚",
          text:
            "このタイプは基本的に本や図形など「目で見る形」で学ぶと理解しやすくなります。良質な教科書や参考書、テキスト系のWebサイトを活用しましょう！<br>(なお聴覚の数値が15点以下の場合は、動画で学ぶ事が難しいです)"
        },
        {
          id: "a",
          diagnosis: "聴覚",
          text:
            "このタイプは「音声」で学ぶのが得意です。一般的な学校の授業や学習塾の講義に向いているのはこのタイプでしょう。家庭教師なども良いかも知れません。また、音声教材を積極的に利用すると良いでしょう。<br>(なお視覚の数値が15点以下の場合は、動画で学ぶ事が難しいです)"
        },
        {
          id: "t",
          diagnosis: "触覚・運動感覚",
          text:
            "このタイプは実際に物に触れ、体を動かして学ぶのが得意です。<br>実験や実習・フィールドワークなど、教科書の上ではない学びや、実際に何かを書く、アウトプットする事が理解への早道です。実際に触れられる模型やモデルを利用するのも良いですね。"
        },
        {
          id: "va",
          diagnosis: "視覚＆聴覚",
          text:
            "おめでとう！あなたは最近のはやりである「動画で学ぶ」という方法に一番向いているタイプです！学校や塾の授業も(レベルが合っていれば)すんなりこなせるのではないかな？より点数の高い方を意識して使ってみましょう。"
        },
        {
          id: "vt",
          diagnosis: "視覚＆触覚・運動感覚",
          text:
            "文字や図を使って理解したり、実際に触れたり体を動かして体験することで理解を深めるタイプです。インプットでの理解もアウトプットでの理解も得意なのが強みですね！インプットの際は書籍やテキスト系Webサイトなど「目で見る」情報を中心にするのがオススメです。"
        },
        {
          id: "at",
          diagnosis: "聴覚＆触覚・運動感覚",
          text:
            "音声をを聞いたり、実際に触れたり体を動かして体験することで理解を深めるタイプです。インプットでの理解もアウトプットでの理解も得意なのが強みですね！インプットの際は本よりも音声講座を選ぶのがオススメです。"
        },
        {
          id: "all",
          diagnosis: "全部盛り",
          text:
            "なに・・？差が付かないだと・・！？<br>そんなあなたにおすすめなのは、ズバリ！筋トレです！！<br>筋肉は世界を救います！さあプロテインを盛ってスクワットから始めましょう！！<br>（※ネタです。この診断では判断がつきませんので、一番点数の高いタイプから試してみましょう)"
        }
      ]
    };
  },
  props: {
    score: Array
  },
  computed: {
    //当てはまる結果を表示
    filteredResults() {
      return this.searchResult(this.results, this.selectedType);
    }
  },
  created() {
    //結果の判定
    //変数定義
    var vision = this.score[0].val;
    var auditory = this.score[1].val;
    var tactile = this.score[2].val;

    //ある値が他の物より5以上多いときは単独タイプ
    if (vision >= auditory + 5 && vision >= tactile + 5) {
      this.selectedType = "v";
    } else if (auditory >= vision + 5 && auditory >= tactile + 5) {
      this.selectedType = "a";
    } else if (tactile >= vision + 5 && tactile >= auditory + 5) {
      this.selectedType = "t";

      //2つの要素が残り一つより5以上多く、2つの差が5未満の時は複合タイプ
    } else if (
      vision >= tactile + 5 &&
      auditory >= tactile + 5 &&
      Math.abs(vision - auditory) < 5
    ) {
      this.selectedType = "va";
    } else if (
      vision >= auditory + 5 &&
      tactile >= auditory + 5 &&
      Math.abs(vision - tactile) < 5
    ) {
      this.selectedType = "vt";
    } else if (
      tactile >= vision + 5 &&
      auditory >= vision + 5 &&
      Math.abs(tactile - auditory) < 5
    ) {
      this.selectedType = "at";

      //全ての差が5未満の時は全部盛りタイプ
    } else if (
      Math.abs(vision - auditory) < 5 &&
      Math.abs(tactile - vision) < 5 &&
      Math.abs(tactile - auditory) < 5
    ) {
      this.selectedType = "all";
    } else {
      console.log("式がおかしいよ！");
    }

    const self = this;
    //シェア用診断名を取り出す
    const shareItem = this.results.filter(function(item) {
      return item.id === self.selectedType;
    });
    this.shareResult = shareItem[0].diagnosis;

    //診断名を親に送る
    this.$emit("share-diagnosis", this.shareResult);
  },
  methods: {
    //当てはまる結果のみを抽出
    searchResult(list, key) {
      return list.filter(function(result) {
        return result.id === key;
      });
    },
    //リトライボタンでスタート画面へ
    clickRetry() {
      this.$emit("retry-check");
    }
  },
  template: `
  <div class="p-result">
  <h1 class="p-result__title">Result</h1>
  <div class="p-result__container">
    <div class="p-result__diagnosis">
    <ul>
    <li v-for="(result,index) in filteredResults" v-bind:key="result.id">
      <h2 class="p-result__diagnosis__title">あなたは<span>{{result.diagnosis}}</span>タイプです！</h2>
      <p v-html="result.text" class="p-result__diagnosis__text">
      </p>
      </li>
      </ul>
    </div>
    <div class="p-result__score">
      <h3 class="p-result__score__title">score</h3>
      <table class="p-result__score__table">
        <tr>
          <td class="p-result__score__table__column">視覚:</td>
          <td class="p-result__score__table__column">{{score[0].val}}点</td>
        </tr>
        <tr>
          <td class="p-result__score__table__column">聴覚:</td>
          <td class="p-result__score__table__column">{{score[1].val}}点</td>
        </tr>
        <tr>
          <td class="p-result__score__table__column">
            <span>触覚・<br />運動感覚:&nbsp;</span>
          </td>
          <td class="p-result__score__table__column">{{score[2].val}}点</td>
        </tr>
      </table>
    </div>
  </div>
  <div class="c-btn__group">
  <button class="c-btn c-btn--middle c-btn--main" v-on:click="clickRetry">最初からやり直す</button>
  </div>

</div>
  `
});

new Vue({
  el: "#app",
  data: {
    currentPage: "start",
    score: [],
    isShare: false,
    twitterUrl: "",
    fbUrl: ""
  },
  computed: {},
  methods: {
    //スタートで質問画面へ
    moveCheck() {
      this.currentPage = "checklist";
    },

    //質問画面からscore貰って結果画面へ
    moveResult(score) {
      this.score = score;
      this.currentPage = "result";
      this.isShare = true;
    },

    //リトライでスタート画面へ
    moveStart() {
      this.currentPage = "start";
      this.isShare = false;
    },

    //シェアリンク生成
    createShareLink: function(shareResult) {
      console.log("ここまできたよ");
      console.log(shareResult);

      const shareText =
        "あなたの学習タイプは「" + shareResult + "タイプ」でした！";
      const shareUrl = location.href;
      this.twitterUrl =
        "https://twitter.com/share?text=" +
        shareText +
        "&hashtags=学習タイプ診断&url=" +
        shareUrl;
      this.fbUrl = 'http://www.facebook.com/share.php?u='+ shareUrl;
    },

    //シェアボタンクリック時の動作
    popupWindow: function(url) {
      window.open(
        url,
        "",
        "width=580,height=400,menubar=no,toolbar=no,scrollbars=yes"
      );
    }
  }
});

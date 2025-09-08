<template>
  <div id="app">
    <main class="l-main">
      <div class="l-main__container">
        <div class="l-main__inner">
          <transition mode="out-in">
            <component
              :is="currentPage"
              :score="score"
              @start-check="moveCheck"
              @finish-check="moveResult"
              @retry-check="moveStart"
              @share-diagnosis="createShareLink"
            />
          </transition>
        </div>
        <!-- container end -->
      </div>
      <div class="l-share" v-if="isShare">
        <div class="l-share__container">
          <p class="l-share__text">気に入ったらシェアしてね！</p>
          <div class="c-btn__group">
            <!-- twitterボタン -->
            <span @click="popupWindow(twitterUrl)" class="c-btn c-btn--small c-btn--twitter">
              <i class="fab fa-twitter l-share__icon"></i>Twitterでシェア
            </span>
            <!-- FBボタン -->
            <span @click="popupWindow(fbUrl)" class="c-btn c-btn--small c-btn--facebook">
              <i class="fab fa-facebook-f l-share__icon"></i>Facebookでシェア
            </span>
          </div>
        </div>
        <!-- container end -->
      </div>
    </main>

    <footer class="l-footer">
      <p class="p-footer__text">
        &copy;Copyright2019
        <a href="https://yuruknowledge.com/" class="p-footer__link">ゆるナレッジfromマレーシア</a>
        .All Rights Reserved
      </p>
    </footer>
  </div>
</template>

<script>
import Start from './components/Start.vue'
import Checklist from './components/Checklist.vue'
import Result from './components/Result.vue'

export default {
  name: 'App',
  components: {
    Start,
    Checklist,
    Result
  },
  data() {
    return {
      currentPage: 'Start',
      score: [],
      isShare: false,
      twitterUrl: '',
      fbUrl: ''
    }
  },
  methods: {
    // スタートで質問画面へ
    moveCheck() {
      this.currentPage = 'Checklist'
    },

    // 質問画面からscore貰って結果画面へ
    moveResult(score) {
      this.score = score
      this.currentPage = 'Result'
      this.isShare = true
    },

    // リトライでスタート画面へ
    moveStart() {
      this.currentPage = 'Start'
      this.isShare = false
    },

    // シェアリンク生成
    createShareLink(shareResult) {
      console.log('ここまできたよ')
      console.log(shareResult)

      const shareText = 'あなたの学習タイプは「' + shareResult + 'タイプ」でした！'
      const shareUrl = location.href
      this.twitterUrl =
        'https://twitter.com/share?text=' +
        shareText +
        '&hashtags=学習タイプ診断&url=' +
        shareUrl
      this.fbUrl = 'http://www.facebook.com/share.php?u=' + shareUrl
    },

    // シェアボタンクリック時の動作
    popupWindow(url) {
      window.open(
        url,
        '',
        'width=580,height=400,menubar=no,toolbar=no,scrollbars=yes'
      )
    }
  }
}
</script>

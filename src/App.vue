<template>
  <div id="app" class="page">
    <div class="page__bg"></div>
    
    <!-- テーマ切替UI -->
    <div class="theme-toggle">
      <button 
        :class="{ active: currentTheme === 'legacy-light' }"
        @click="switchTheme('legacy-light')"
      >
        ライト
      </button>
      <button 
        :class="{ active: currentTheme === 'legacy-dark' }"
        @click="switchTheme('legacy-dark')"
      >
        ダーク
      </button>
    </div>
    
    <main class="l-main">
      <div class="l-main__container">
        <div :class="['l-main__inner', { 'l-main__inner--start': currentPage === 'Start' }]">
          <transition mode="out-in">
            <div :class="{ 'card--hero': currentPage === 'Start' }">
              <component
                :is="currentPage"
                :score="score"
                :current-theme="currentTheme"
                @start-check="moveCheck"
                @finish-check="moveResult"
                @retry-check="moveStart"
                @share-diagnosis="createShareLink"
              />
            </div>
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
        &copy;Copyright{{ currentYear }}
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
import { loadTheme, setTheme, getCurrentTheme } from './lib/theme'
import { getAppMode } from './lib/env'
import { getCurrentContentPack, validateContentPack } from './lib/contentPack'

/**
 * メインアプリケーションコンポーネント
 * 学習スタイル診断アプリの全体を管理し、画面遷移とシェア機能を提供
 */
export default {
  name: 'App',
  components: {
    Start,
    Checklist,
    Result
  },
  data() {
    return {
      // 現在表示中のページコンポーネント名
      currentPage: 'Start',
      // 診断結果のスコア配列
      score: [],
      // シェア機能の表示状態
      isShare: false,
      // Twitterシェア用URL
      twitterUrl: '',
      // Facebookシェア用URL
      fbUrl: '',
      // 現在のテーマ（初期化時にgetCurrentTheme()で設定される）
      currentTheme: 'legacy-light'
    }
  },
  computed: {
    /**
     * 現在の年を動的に取得（年が変わる度に自動更新）
     * @returns {number} 現在の年
     */
    currentYear() {
      return new Date().getFullYear()
    }
  },
  created() {
    // テーマを早期に設定（フラッシュを防ぐ）
    this.loadInitialTheme()
  },
  mounted() {
    // アプリケーション初期化
    this.initializeApp()
  },
  methods: {
    /**
     * アプリケーション初期化
     * コンテンツパック検証、その他の初期化処理を実行
     */
    initializeApp() {
      this.validateContentPack()
    },

    /**
     * 初期テーマを読み込み
     * 初回アクセス時はデバイスのテーマ設定を優先し、保存されたテーマがある場合はそれを使用
     */
    loadInitialTheme() {
      const theme = getCurrentTheme()
      this.currentTheme = theme
      setTheme(theme)
    },

    /**
     * テーマを切り替え
     * @param {Theme} theme - 切り替えるテーマ
     */
    switchTheme(theme) {
      this.currentTheme = theme
      setTheme(theme)
    },

    /**
     * コンテンツパックの整合性を検証
     * 起動時に全年齢版でレア画像が設定されていないかチェック
     */
    validateContentPack() {
      try {
        const mode = getAppMode()
        const pack = getCurrentContentPack()
        
        console.log(`[App] Validating content pack for mode: ${mode}`)
        
        if (!validateContentPack(pack)) {
          console.warn('[App] Content pack validation failed!')
          
          // 全年齢版でレア画像が設定されている場合は強制的に通常枠のみにフォールバック
          if (mode === 'allages') {
            console.warn('[App] Forcing all-ages mode to use normal images only')
            // ここで強制的に通常画像のみを使用するように設定
            // 実際の実装では、アセット解決時にガードをかける
          }
        } else {
          console.log('[App] Content pack validation passed')
        }
      } catch (error) {
        console.error('[App] Content pack validation error:', error)
      }
    },

    /**
     * 診断開始時の画面遷移
     * スタート画面からチェックリスト画面へ遷移
     */
    moveCheck() {
      this.currentPage = 'Checklist'
    },

    /**
     * 診断完了時の画面遷移
     * チェックリスト画面から結果画面へ遷移し、シェア機能を有効化
     * @param {Array} score - 診断結果のスコア配列
     */
    moveResult(score) {
      this.score = score
      this.currentPage = 'Result'
      this.isShare = true
    },

    /**
     * リトライ時の画面遷移
     * 結果画面からスタート画面へ戻り、シェア機能を無効化
     */
    moveStart() {
      this.currentPage = 'Start'
      this.isShare = false
    },

    /**
     * シェアリンクを生成
     * TwitterとFacebook用のシェアURLを作成
     * @param {string} shareResult - シェア用の診断結果テキスト
     */
    createShareLink(shareResult) {
      const shareText = `あなたの学習タイプは「${shareResult}タイプ」でした！`
      const shareUrl = location.href
      
      // TwitterシェアURL生成
      this.twitterUrl = `https://twitter.com/share?text=${encodeURIComponent(shareText)}&hashtags=学習タイプ診断&url=${encodeURIComponent(shareUrl)}`
      
      // FacebookシェアURL生成
      this.fbUrl = `https://www.facebook.com/share.php?u=${encodeURIComponent(shareUrl)}`
    },

    /**
     * シェア用ポップアップウィンドウを開く
     * @param {string} url - 開くURL
     */
    popupWindow(url) {
      window.open(
        url,
        'share',
        'width=580,height=400,menubar=no,toolbar=no,scrollbars=yes,resizable=yes'
      )
    }
  }
}
</script>

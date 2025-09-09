<template>
  <div id="app" class="page">
    <div class="page__bg"></div>
    
    <!-- コントロールパネル -->
    <div class="control-panel">
      <!-- 言語切り替え -->
      <div class="locale-toggle">
        <button 
          v-for="locale in availableLocales"
          :key="locale.code"
          :class="{ active: currentLocale === locale.code }"
          @click="switchLocale(locale.code)"
          :title="locale.name"
        >
          {{ locale.flag }}
        </button>
      </div>
      
      <!-- テーマ切り替え -->
      <div class="theme-toggle">
        <button 
          :class="{ active: currentTheme === 'legacy-light' }"
          @click="switchTheme('legacy-light')"
          title="ライトテーマ"
        >
          <i class="fas fa-sun"></i>
        </button>
        <button 
          :class="{ active: currentTheme === 'legacy-dark' }"
          @click="switchTheme('legacy-dark')"
          title="ダークテーマ"
        >
          <i class="fas fa-moon"></i>
        </button>
      </div>
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
                :current-locale="currentLocale"
                :texts="texts"
                @start-check="moveCheck"
                @finish-check="moveResult"
                @retry-check="moveStart"
              />
            </div>
          </transition>
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
import { getCurrentLocale, setLocale, AVAILABLE_LOCALES } from './lib/locale'
import { getTexts } from './lib/i18n'

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
    // 初期化時に言語とテキストを設定
    const initialLocale = getCurrentLocale()
    const initialTexts = getTexts(initialLocale)
    
    return {
      // 現在表示中のページコンポーネント名
      currentPage: 'Start',
      // 診断結果のスコア配列
      score: [],
      // 現在のテーマ（初期化時にgetCurrentTheme()で設定される）
      currentTheme: 'legacy-light',
      // 現在の言語（初期化時にgetCurrentLocale()で設定される）
      currentLocale: initialLocale,
      // 国際化テキスト
      texts: initialTexts,
      // 利用可能な言語一覧
      availableLocales: AVAILABLE_LOCALES
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
    // 言語は既にdata()で初期化済み
  },
  mounted() {
    // アプリケーション初期化
    this.initializeApp()
  },
  methods: {
    /**
     * アプリケーション初期化
     * 基本的な初期化処理を実行
     */
    initializeApp() {
      console.log('[App] Application initialized')
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
     * 言語を切り替え
     * @param {string} locale - 切り替える言語
     */
    switchLocale(locale) {
      this.currentLocale = locale
      this.texts = getTexts(locale)
      setLocale(locale)
    },


    /**
     * 診断開始時の画面遷移
     * スタート画面からチェックリスト画面へ遷移
     */
    moveCheck() {
      this.currentPage = 'Checklist'
      // ページの最上部にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    /**
     * 診断完了時の画面遷移
     * チェックリスト画面から結果画面へ遷移し、シェア機能を有効化
     * @param {Array} score - 診断結果のスコア配列
     */
    moveResult(score) {
      this.score = score
      this.currentPage = 'Result'
      // ページの最上部にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    /**
     * リトライ時の画面遷移
     * 結果画面からスタート画面へ戻り、シェア機能を無効化
     */
    moveStart() {
      this.currentPage = 'Start'
      // ページの最上部にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

  }
}
</script>

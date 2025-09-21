<template>
  <div id="app" class="page theme-app">
    <div class="page__bg theme-bg"></div>
    
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
      <div class="theme-toggle flex items-center gap-2">
        <button 
          class="px-3 py-1 rounded text-sm font-medium transition-colors theme-btn"
          :class="currentTheme === 'ls-light' ? 'theme-btn-active' : 'theme-btn-inactive'"
          @click="switchTheme('ls-light')"
          title="ライトテーマ"
        >
          ☀️
        </button>
        <button 
          class="px-3 py-1 rounded text-sm font-medium transition-colors theme-btn"
          :class="currentTheme === 'ls-dark' ? 'theme-btn-active' : 'theme-btn-inactive'"
          @click="switchTheme('ls-dark')"
          title="ダークテーマ"
        >
          🌙
        </button>
      </div>
    </div>
    
    <main class="l-main">
      <div class="l-main__container max-w-screen-md mx-auto">
        <div :class="['l-main__inner', { 'l-main__inner--start': currentPage === 'Start' }]">
          
          <transition mode="out-in">
            <div :class="cardWrapperClasses" :style="cardWrapperStyle">
              <component
                :is="currentPage"
                :result="diagnosisResult"
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

    <footer class="l-footer bg-neutral text-neutral-content py-3 md:py-4">
      <p class="p-footer__text text-xs md:text-sm text-neutral-content">
        &copy;Copyright{{ currentYear }}
        <a href="https://yuruknowledge.com/" class="p-footer__link">ゆるナレッジfromマレーシア</a>
        .All Rights Reserved
      </p>
    </footer>
  </div>
</template>

<style scoped>


/* テーマボタンのスタイル（言語切り替えボタンと同じスタイル） */
.theme-btn-active {
  background-color: var(--c-primary, #69c4d0);
  color: white;
  border: 1px solid var(--c-primary, #69c4d0);
}

.theme-btn-inactive {
  background-color: transparent;
  color: var(--c-text-muted, #6b7280);
  border: 1px solid var(--c-border, #e5e7eb);
}

.theme-btn-inactive:hover {
  background-color: var(--c-border, #e5e7eb);
  color: var(--c-text, #403734);
}

</style>

<script>
import Start from './components/Start.vue'
import Checklist from './components/Checklist.vue'
import Result from './components/Result.vue'
import { useTheme } from './composables/useTheme'
import { getCurrentLocale, setLocale, AVAILABLE_LOCALES } from './lib/locale'
import { getTexts } from './lib/i18n'
import { applyOg } from './utils/seo'
// useLocale は Composition API のコンポーザブルのため、Options API では使用しない
// VueのOptions APIでは型定義が制限されるため、any型を使用

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
      // 診断結果
      diagnosisResult: null,
      // 現在のテーマ（初期化時にgetCurrentTheme()で設定される）
      currentTheme: 'ls-light',
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
    },

    cardWrapperClasses() {
      if (this.currentPage !== 'Start') {
        return []
      }

      return ['card--hero']
    },

    cardWrapperStyle() {
      if (this.currentPage !== 'Start') {
        return {}
      }

      const isDark = this.currentTheme === 'ls-dark'
      return {
        '--card-hero-mobile': `url('/images/start-card-mobile-${isDark ? 'dark' : 'light'}.png')`,
        '--card-hero-desktop': `url('/images/start-card-desktop-${isDark ? 'dark' : 'light'}.png')`,
        '--card-hero-foreground': isDark ? 'hsl(188deg 72% 76%)' : 'hsl(188deg 62% 32%)',
        '--card-hero-text-shadow': isDark ? '0 3px 8px rgba(15, 23, 42, 0.55)' : '0 1px 2px rgba(255, 255, 255, 0.45)',
        '--card-hero-title-shadow': isDark ? '0 6px 16px rgba(15, 23, 42, 0.62)' : '0 1px 3px rgba(255, 255, 255, 0.4)',
        '--card-hero-subtitle': isDark ? 'rgba(248, 250, 252, 0.92)' : 'rgba(71, 79, 88, 0.9)'
      }
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
    // テーマを再適用（DOMが準備できた後）
    this.loadInitialTheme()
    this.applyDefaultOg()
    // 少し遅延してテーマを再適用（確実にするため）
    this.$nextTick(() => {
      this.loadInitialTheme()
    })
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
      const saved = localStorage.getItem('ls_theme')
      if (saved && (saved === 'ls-light' || saved === 'ls-dark')) {
        this.currentTheme = saved
      } else {
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
        this.currentTheme = prefersDark ? 'ls-dark' : 'ls-light'
      }
      
      // DOMにテーマを適用（強制的に）
      document.documentElement.setAttribute('data-theme', this.currentTheme)
      document.documentElement.className = `theme-${this.currentTheme}`
      
      // CSS変数を直接設定
      this.applyThemeColors(this.currentTheme)
      
      console.log('[App] Theme applied:', this.currentTheme)
    },

    /**
     * テーマを切り替え
     * @param {string} theme - 切り替えるテーマ
     */
    switchTheme(theme) {
      console.log('[App] Switching theme to:', theme)
      this.currentTheme = theme
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.className = `theme-${theme}`
      localStorage.setItem('ls_theme', theme)
      
      // CSS変数を直接設定
      this.applyThemeColors(theme)
      
      console.log('[App] Theme applied to DOM:', document.documentElement.getAttribute('data-theme'))
    },

    /**
     * テーマの色を直接適用
     * @param {string} theme - 適用するテーマ
     */
    applyThemeColors(theme) {
      const root = document.documentElement
      
      // Startカード用のCSS変数はコンポーネント側で制御するため、ここではリセットのみ
      root.style.removeProperty('--card-hero-mobile')
      root.style.removeProperty('--card-hero-desktop')

      if (theme === 'ls-light') {
        // ライトモード：既存のCSS変数をクリア（デフォルト値を使用）
        root.style.removeProperty('--c-bg')
        root.style.removeProperty('--c-text')
        root.style.removeProperty('--c-primary')
        root.style.removeProperty('--c-secondary')
        root.style.removeProperty('--c-accent')
        root.style.removeProperty('--c-border')
        root.style.removeProperty('--c-card')
        root.style.removeProperty('--c-card-text')
      } else {
        // ダークモード：既存のCSS変数を上書き
        root.style.setProperty('--c-bg', '#1a1a1a')
        root.style.setProperty('--c-text', '#e5e7eb')
        root.style.setProperty('--c-primary', '#69c4d0')
        root.style.setProperty('--c-secondary', '#9E7E9F')
        root.style.setProperty('--c-accent', '#c14f7e')
        root.style.setProperty('--c-border', '#374151')
        root.style.setProperty('--c-card', 'rgba(30, 30, 30, 0.9)')
        root.style.setProperty('--c-card-text', '#e5e7eb')
      }
      
      // クラスと属性を設定
      root.className = `theme-${theme}`
      root.setAttribute('data-theme', theme)
      
      console.log('[App] Theme colors applied:', theme)
    },

    /**
     * 言語を切り替え
     * @param {string} locale - 切り替える言語
     */
    switchLocale(locale) {
      this.currentLocale = locale
      this.texts = getTexts(locale)
      setLocale(locale)
      if (this.currentPage === 'Start') {
        this.$nextTick(() => this.applyDefaultOg())
      }
    },

    applyDefaultOg() {
      const title = this.texts?.app?.title || 'Learning Style Checker'
      const description = this.texts?.app?.subtitle || ''
      const origin = window.location.origin
      applyOg({
        title,
        description,
        url: origin + '/',
        image: origin + '/og/og-all.png'
      })
    },


    /**
     * 診断開始時の画面遷移
     * スタート画面からチェックリスト画面へ遷移
     */
    moveCheck() {
      this.currentPage = 'Checklist'
      // ページの最上部にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // 背景をクリア
      document.documentElement.style.backgroundImage = 'none'
    },

    /**
     * 診断完了時の画面遷移
     * チェックリスト画面から結果画面へ遷移し、シェア機能を有効化
     * @param {DiagnoseResult} result - 診断結果
     */
    moveResult(result) {
      this.diagnosisResult = result
      this.currentPage = 'Result'
      // ページの最上部にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    /**
     * リトライ時の画面遷移
     * 結果画面からスタート画面へ戻り、シェア機能を無効化
     */
    moveStart() {
      this.diagnosisResult = null
      this.currentPage = 'Start'
      // ページの最上部にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // 背景をリセット
      document.documentElement.style.backgroundImage = ''
      this.$nextTick(() => this.applyDefaultOg())
    },

  }
}
</script>

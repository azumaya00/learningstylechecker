import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './assets/main.css'
import './styles.css'
import './styles/a11y.css'

// i18n設定
import ja from './i18n/ja.js'
import en from './i18n/en.js'

const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'ja',
  messages: {
    ja,
    en
  }
})

createApp(App).use(i18n).mount('#app')

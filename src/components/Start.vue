<template>
  <div class="p-start">
    <h1 class="p-start__title">{{ texts.app.title }}</h1>
    <p class="p-start__subtitle">{{ texts.app.subtitle }}</p>
    <button class="c-btn c-btn--large c-btn--main" @click="handleStartClick">
      {{ texts.app.startCta }}
    </button>
  </div>
</template>

<script>
import ja from '../i18n/ja.js'

/**
 * スタート画面コンポーネント
 * アプリケーションの最初の画面を表示し、診断開始のトリガーを提供
 */
export default {
  name: 'Start',
  data() {
    return {
      texts: ja
    }
  },
  methods: {
    /**
     * 診断開始ボタンクリック時の処理
     * 親コンポーネントに診断開始イベントを送信
     */
    handleStartClick() {
      this.$emit('start-check')
    }
  }
}
</script>

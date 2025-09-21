<template>
  <section class="p-start">
    <div class="p-start__header">
      <h1 class="p-start__title">{{ texts.app?.title || 'Learning Style Checker' }}</h1>
      <p class="p-start__subtitle">{{ texts.app?.subtitle || 'あなたの学習スタイルはどのタイプ？' }}</p>
    </div>

    <div class="p-start__spacer" aria-hidden="true"></div>

    <div class="p-start__cta">
      <button class="c-btn c-btn--large c-btn--main" @click="handleStartClick">
        {{ texts.app?.startCta || '診断をはじめる' }}
      </button>
    </div>
  </section>
</template>

<script>
/**
 * スタート画面コンポーネント
 * アプリケーションの最初の画面を表示し、診断開始のトリガーを提供
 */
export default {
  name: 'Start',
  props: {
    // 現在の言語
    currentLocale: {
      type: String,
      required: true
    },
    // 国際化テキスト
    texts: {
      type: Object,
      required: true
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

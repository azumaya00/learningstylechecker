<template>
  <div class="p-start">
    <h1 class="p-start__title">Learning style<br />checker</h1>
    <p class="p-start__subtitle">あなたの学習スタイルはどのタイプ？</p>
    <button class="c-btn c-btn--large c-btn--main" @click="handleStartClick">
      診断をはじめる
    </button>
  </div>
</template>

<script>
/**
 * スタート画面コンポーネント
 * アプリケーションの最初の画面を表示し、診断開始のトリガーを提供
 */
export default {
  name: 'Start',
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

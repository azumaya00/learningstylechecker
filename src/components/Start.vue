<template>
  <div class="p-start">
    <h1 class="p-start__title">Learning style<br />checker</h1>
    <p class="p-start__subtitle">あなたの学習スタイルはどのタイプ？</p>
    <button class="c-btn c-btn--large c-btn--main" @click="clickStart">診断をはじめる</button>
  </div>
</template>

<script>
export default {
  name: 'Start',
  methods: {
    // スタートを押したら質問画面へ移動
    clickStart() {
      this.$emit('start-check')
    }
  }
}
</script>

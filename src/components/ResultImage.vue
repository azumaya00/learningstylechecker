<template>
  <figure class="w-full">
    <img 
      :src="src" 
      :alt="alt" 
      width="1280" 
      height="720" 
      class="w-full h-auto rounded-box" 
    />
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ 
  resultKey: 'v' | 'a' | 't' | 'va' | 'vt' | 'at' | 'all' 
}>()

const { t } = useI18n()

// 後で実画像に差し替えるためのダミーパス
const src = computed(() => `/images/characters/${props.resultKey}.webp`)
const alt = computed(() => t(`alt.resultImage.${props.resultKey}`))
</script>





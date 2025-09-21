<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ 
  current: number; 
  total: number; 
  label?: string 
}>();

const percent = computed(() => {
  if (!props.total) return 0;
  // currentは0ベースなので、そのまま使用
  const p = Math.round((props.current / props.total) * 100);
  return Math.min(100, Math.max(0, p));
});

const ariaLabel = computed(() => props.label || 'Progress');
</script>

<template>
  <div class="w-full">
    <div class="mb-2 text-sm opacity-80 sr-only" v-if="ariaLabel">{{ ariaLabel }}</div>
    <div
      class="w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
      role="progressbar"
      :aria-label="ariaLabel"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="percent"
    >
      <div 
        class="bg-blue-500 h-3 md:h-4 transition-[width] duration-200 ease-out" 
        :style="{ width: percent + '%' }" 
      />
    </div>
    <!-- デバッグ用 -->
    <div class="text-xs text-gray-500 mt-1">
      Progress: {{ percent }}% ({{ props.current }}/{{ props.total }})
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  div[role="progressbar"] > div { 
    transition: none !important; 
  }
}
</style>

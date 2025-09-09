<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
const { theme, toggle } = useTheme();
</script>

<template>
  <button class="btn btn-ghost" @click="toggle" aria-label="テーマ切替">
    <span v-if="theme === 'ls-light'">🌞</span><span v-else>🌙</span>
  </button>
</template>

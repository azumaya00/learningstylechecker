<script setup lang="ts">
const props = defineProps<{ 
  current: number; 
  total: number; 
  maxVisible?: number 
}>();

const max = props.maxVisible ?? 7;

// 単純実装：total<=max のときは全件、超える場合は代表点（先頭/中間/末尾）で間引き
function indices(total: number, max: number) {
  if (total <= max) return Array.from({ length: total }, (_, i) => i);
  const arr = [0];
  for (let i = 1; i < max - 1; i++) {
    arr.push(Math.round((i * (total - 1)) / (max - 1)));
  }
  arr.push(total - 1);
  return Array.from(new Set(arr));
}

const dots = indices(props.total, max);
</script>

<template>
  <div class="hidden md:flex items-center gap-1 mt-2" aria-hidden="true">
    <span
      v-for="i in dots"
      :key="i"
      class="rounded-full"
      :class="[ 
        i === props.current ? 'bg-primary' : 'bg-base-300', 
        'w-2 h-2 md:w-2.5 md:h-2.5' 
      ]"
    />
  </div>
</template>





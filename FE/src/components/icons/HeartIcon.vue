<template>
  <div class="relative">
    <svg xmlns="http://www.w3.org/2000/svg" :fill="fillColor" viewBox="0 0 24 24" stroke-width="1.5" :stroke="color"
      :class="['icon', `size-${size}`]">
      <path fill="inherit" stroke-linecap="round" stroke-linejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        :class="customClass" />
    </svg>
    <div v-if="showBadge && displayCount > 0"
      class="absolute -top-2 -right-2 bg-red-600 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center select-none">
      {{ displayCount > 99 ? '99+' : displayCount }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  customClass: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  fillColor: {
    type: String,
    default: 'none',
  },
  size: {
    type: String,
    default: '6',
  },
  itemCount: {
    type: Number,
    default: 0
  },
  showBadge: {
    type: Boolean,
    default: true
  }
});

const displayCount = computed(() => {
  return props.itemCount || 0;
})
</script>

<style lang="scss" scoped>
@use '../../css/_icon.scss' as *;
</style>

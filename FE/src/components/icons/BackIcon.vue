<template>
  <div class="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      :class="['icon', `size-${size}`, $attrs.class]"
      v-bind="$attrs"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      />
    </svg>
    <div
      v-if="showBadge && displayCount > 0"
      class="absolute -top-2 -right-2 bg-red-600 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center select-none"
    >
      {{ displayCount > 99 ? '99+' : displayCount }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
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
  },
  minSize: {
    type: Number,
    default: 5
  }
})

const displayCount = computed(() => {
  return props.itemCount || 0
})
</script>

<style lang="scss" scoped>
@use '../../css/_icon.scss' as *;
</style>

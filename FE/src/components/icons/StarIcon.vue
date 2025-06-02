<template>
  <svg :class="[`w-${size}`, `h-${size}`]" :fill="filled ? color : 'none'" :stroke="color" stroke-width="2"
    viewBox="0 0 24 24">
    <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" />
  </svg>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: '6',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  filled: {
    type: Boolean,
    default: false,
  },
  half: {
    type: Boolean,
    default: false,
  }
})
</script>

<style lang="scss" scoped>
@use '../../css/_icon.scss' as *;
</style>

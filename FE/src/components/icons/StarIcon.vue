<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" :stroke="color"
    :class="['icon', `size-${size}`]">
    <defs>
      <linearGradient id="half-gradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="50%" :stop-color="color" />
        <stop offset="50%" stop-color="#fff" />
      </linearGradient>
    </defs>
    <path v-if="half" stroke-linecap="round" stroke-linejoin="round" :fill="'url(#half-gradient)'"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    <path v-else stroke-linecap="round" stroke-linejoin="round" :fill="filled ? color : 'none'"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
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

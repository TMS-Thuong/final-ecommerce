<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    :stroke="color"
    :class="['icon', `size-${size}`, customClass]"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  customClass: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  size: {
    type: String,
    default: '6',
  },
});
</script>

<style lang="scss" scoped>
@use '../../css/_icon.scss' as *;
</style>

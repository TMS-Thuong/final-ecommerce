<template>
  <svg xmlns="http://www.w3.org/2000/svg" :fill="color" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
    :class="['icon', `size-${size}`, $attrs.class]" v-bind="$attrs">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
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
})
</script>

<style lang="scss" scoped>
@use '../../css/_icon.scss' as *;
</style>

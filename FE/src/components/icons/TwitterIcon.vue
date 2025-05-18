<template>
  <svg xmlns="http://www.w3.org/2000/svg" :fill="color" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
    :class="['icon', `size-${size}`, $attrs.class]" v-bind="$attrs">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
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

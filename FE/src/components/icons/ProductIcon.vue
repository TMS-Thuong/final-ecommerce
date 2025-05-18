<template>
  <svg xmlns="http://www.w3.org/2000/svg" :fill="color" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
    :class="['icon', `size-${size}`, $attrs.class]" v-bind="$attrs">
    <path d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
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

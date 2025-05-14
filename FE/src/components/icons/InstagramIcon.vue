<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
    :class="['icon', `size-${size}`, $attrs.class]" v-bind="$attrs">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M12 2.25c-2.69 0-3.02.01-4.07.06-1.05.05-1.77.22-2.4.46-.65.25-1.2.59-1.74 1.14-.55.55-.89 1.1-1.14 1.74-.25.63-.41 1.35-.46 2.4-.05 1.05-.06 1.38-.06 4.07s.01 3.02.06 4.07c.05 1.05.22 1.77.46 2.4.25.65.59 1.2 1.14 1.74.55.55 1.1.89 1.74 1.14.63.25 1.35.41 2.4.46 1.05.05 1.38.06 4.07.06s3.02-.01 4.07-.06c1.05-.05 1.77-.22 2.4-.46.65-.25 1.2-.59 1.74-1.14.55-.55.89-1.1 1.14-1.74.25-.63.41-1.35.46-2.4.05-1.05.06-1.38.06-4.07s-.01-3.02-.06-4.07c-.05-1.05-.22-1.77-.46-2.4-.25-.65-.59-1.2-1.14-1.74-.55-.55-1.1-.89-1.74-1.14-.63-.25-1.35-.41-2.4-.46-1.05-.05-1.38-.06-4.07-.06z" />
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M12 6.375a5.625 5.625 0 1 0 0 11.25 5.625 5.625 0 0 0 0-11.25zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    <circle cx="17.5" cy="6.5" r="1.5" />
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

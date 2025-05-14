<template>
  <div class="image-container">
    <img :src="src" alt="image description" />
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    default: 'src/assets/no-img.png',
  },
  minWidth: {
    type: String,
    default: '15rem',
  },
  height: {
    type: String,
    default: '10rem',
  },
})
</script>

<style scoped lang="scss">
@use '@/css/_image-display.scss' as *;
</style>

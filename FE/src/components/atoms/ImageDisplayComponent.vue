<template>
  <div
    :style="{
      minWidth: minWidth,
      height: height,
    }"
    class="bg-neutral-100 rounded-xl flex items-center justify-center border border-dashed border-neutral-300 ml-8 mt-4"
  >
    <img
      :src="src"
      class="h-auto max-w-full object-cover"
      alt="image description"
    />
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

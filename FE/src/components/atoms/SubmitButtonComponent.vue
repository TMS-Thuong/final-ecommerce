<template>
  <button
    type="submit"
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts">
defineProps({
  text: String,
})
</script>

<template>
  <button
    type="submit"
    class="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg __web-inspector-hide-shortcut__"
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts">
defineProps({
  text: String,
})
</script>

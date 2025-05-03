<template>
  <button
    type="submit"
    class="w-full bg-[#704F38] hover:bg-[#674833] text-white py-2 rounded-md transition-colors"
  >
    {{ text }}
  </button>
</template>

<script setup>
defineProps({
  text: String,
})
</script>

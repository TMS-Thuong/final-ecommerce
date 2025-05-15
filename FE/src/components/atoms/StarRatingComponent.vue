<template>
  <div class="flex items-center">
    <div class="flex items-center">
      <span 
        v-for="i in 5" 
        :key="i" 
        class="text-xl mr-1 cursor-pointer" 
        :class="{ 'text-yellow-500': i <= Math.round(rating), 'text-gray-300': i > Math.round(rating) }"
        @click="$emit('update:rating', i)"
      >
        ★
      </span>
    </div>
    <span v-if="showCount" class="ml-1 text-lg text-neutral-600">({{ count }})</span>
  </div>
</template>

<script setup>
const props = defineProps({
  rating: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
  showCount: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:rating'])
</script>

<style scoped>
.flex span {
  color: #d4d4d4;
}
.flex span:nth-child(-n+{{ Math.round(rating) }}) {
  color: #737373;
}
</style>

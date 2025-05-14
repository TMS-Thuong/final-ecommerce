<template>
  <div class="flex items-center">
    <div class="flex">
      <StarIcon
        v-for="i in 5"
        :key="i"
        :color="i <= Math.round(rating) ? '#737373' : '#d4d4d4'"
        size="8"
        class="mr-0.5"
      />
    </div>
    <span v-if="showCount" class="ml-1 text-lg text-neutral-600">({{ count }})</span>
  </div>
</template>

<script setup>
import StarIcon from '@/components/icons/StarIcon.vue'

defineProps({
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
</script>

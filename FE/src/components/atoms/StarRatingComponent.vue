<template>
  <div class="flex items-center">
    <div class="flex items-center">
      <span v-for="i in 5" :key="i" :class="[
          'mr-1', 
          { 
            'cursor-pointer': !readonly,
            'cursor-default': readonly
          }
        ]"
        @click="!readonly && $emit('update:rating', i)">
        <StarIcon :size="size" :filled="i <= Math.round(rating)" :color="i <= Math.round(rating) ? 'rgb(234 179 8)' : 'rgb(209 213 219)'" />
      </span>
    </div>
    <span v-if="showCount" class="ml-1 text-lg text-neutral-600">({{ count }})</span>
  </div>
</template>

<script setup>
import StarIcon from '@/components/icons/StarIcon.vue'

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
  },
  readonly: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: '5'
  }
})

defineEmits(['update:rating'])
</script>

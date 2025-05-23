<template>
  <div class="flex items-center">
    <div class="flex items-center">
      <span v-for="i in 5" :key="i" :class="['mr-1', { 'cursor-pointer': !readonly, 'cursor-default': readonly }]"
        @click="!readonly && $emit('update:rating', i)">
        <StarIcon :size="size" :filled="i <= Math.floor(rating)" :half="i === Math.ceil(rating) && (rating % 1) >= 0.5"
          :color="i <= Math.floor(rating) || (i === Math.ceil(rating) && (rating % 1) >= 0.5) ? 'rgb(234 179 8)' : 'rgb(209 213 219)'" />
      </span>
    </div>
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
    default: '6'
  }
})

defineEmits(['update:rating'])
</script>

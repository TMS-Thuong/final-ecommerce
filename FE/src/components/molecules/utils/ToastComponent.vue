<template>
  <div :class="[
    'flex items-center w-full max-w-s p-4 mb-3 text-lg rounded-lg shadow-sm',
    baseStyle,
  ]" role="alert">
    <div :class="['inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg', iconWrapperStyle]">
      <component :is="iconComponent" class="w-5 h-5" />
      <span class="sr-only">{{ type }} icon</span>
    </div>
    <div class="ms-3 font-normal">{{ message }}</div>
    <button @click="$emit('close')"
      class="ms-auto -mx-1.5 -my-1.5 p-1.5 inline-flex items-center justify-center h-8 w-8 rounded-lg focus:ring-2 hover:bg-gray-100 dark:hover:bg-gray-700">
      <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CheckIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  type: { type: String, default: 'success' },
  message: { type: String, required: true }
})

const iconComponent = computed(() => {
  return {
    success: CheckIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon
  }[props.type] || CheckIcon
})

const baseStyle = computed(() => {
  return {
    success: 'text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-800',
    error: 'text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-800',
    warning: 'text-orange-700 bg-orange-100 dark:text-orange-200 dark:bg-orange-700'
  }[props.type]
})

const iconWrapperStyle = computed(() => {
  return {
    success: 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200',
    error: 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200',
    warning: 'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200'
  }[props.type]
})
</script>

<template>
  <div v-if="isBannerVisible" class="w-full bg-orange-500 text-white px-4 py-2 flex items-center justify-center">
    <span class="mr-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </span>
    <p class="text-sm font-medium">{{ message }}</p>
    <button @click="closeBanner" class="ml-4 text-white hover:text-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: 'Checkout feature is under development'
  },
  closeable: {
    type: Boolean,
    default: true
  }
});

const isBannerVisible = ref(true);

const closeBanner = () => {
  if (props.closeable) {
    isBannerVisible.value = false;
  }
};
</script> 
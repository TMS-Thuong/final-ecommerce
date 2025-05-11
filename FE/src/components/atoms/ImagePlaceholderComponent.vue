<template>
  <div class="relative w-full h-80 sm:w-96">
    <div v-if="!loaded"
      class="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-sm dark:bg-gray-700">
      <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 18">
        <path
          d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
      </svg>
    </div>
    <img :src="src" :alt="alt" class="w-full h-full object-cover rounded-sm transition-opacity duration-500"
      :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }" @load="loaded = true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
}>()

const loaded = ref(false)
</script>

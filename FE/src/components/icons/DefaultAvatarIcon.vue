<template>
    <div class="flex items-center justify-center w-full h-full overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
        :class="customClass">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-4/5 h-4/5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    customClass: {
        type: String,
        default: ''
    }
})
</script>
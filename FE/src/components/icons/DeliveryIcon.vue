<template>
    <svg :class="[`w-${size}`, `h-${size}`, 'mr-2']" :fill="'none'" :stroke="color" stroke-width="2"
        viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    </svg>
</template>

<script setup>
const props = defineProps({
    size: {
        type: String,
        default: '4',
    },
    color: {
        type: String,
        default: 'currentColor',
    },
})
</script>
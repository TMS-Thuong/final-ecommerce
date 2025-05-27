<template>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        :class="['icon', `size-${size}`]">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
</template>

<script setup>
const props = defineProps({
    size: {
        type: String,
        default: '6',
    }
})
</script>

<style scoped lang="scss">
@use '../../css/_icon.scss' as *;
</style>
<template>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" :stroke="color"
        :class="['icon', `size-${size}`]">
        <path stroke-linecap="round" stroke-linejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
</template>

<script setup>
const props = defineProps({
    size: {
        type: String,
        default: '6',
    },
    color: {
        type: String,
        default: 'currentColor',
    },
})
</script>
<style lang="scss" scoped>
@use '../../css/_icon.scss' as *;
</style>
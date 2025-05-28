<template>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        :class="['icon', `size-${size}`, $attrs.class]" v-bind="$attrs">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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
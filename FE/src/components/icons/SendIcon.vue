<template>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        :class="['icon', `size-${size}`, $attrs.class]" v-bind="$attrs">
        <path stroke-linecap="round" stroke-linejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
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
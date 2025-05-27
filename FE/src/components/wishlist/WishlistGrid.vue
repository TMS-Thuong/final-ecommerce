<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <WishlistItem v-for="item in items" :key="item.id" :item="item" @update="$emit('update')" />
    </div>
</template>
<script setup>
import WishlistItem from './WishlistItem.vue'
const props = defineProps({ items: Array })
const emit = defineEmits(['update'])
</script>
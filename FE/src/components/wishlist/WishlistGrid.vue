<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <WishlistItem v-for="item in items" :key="item.id" :item="item" @update="$emit('update')" />
    </div>
    <div class="text-center pt-8">
        <button
            class="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-2 rounded-lg font-medium transition">
            Load More Items
        </button>
    </div>
</template>
<script setup>
import WishlistItem from './WishlistItem.vue'
const props = defineProps({ items: Array })
</script>
<template>
    <div
        class="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <HeartIcon class="w-6 h-6" />
            </div>
            <div>
                <h2 class="text-3xl font-bold">My Wishlist</h2>
                <p class="text-gray-300 mt-2 text-lg">
                    {{ count }} {{ count === 1 ? 'item' : 'items' }} saved for later
                </p>
            </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
            <button
                class="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center px-4 py-2 rounded border"
                type="button">
                <ShareIcon class="w-4 h-4 mr-2" /> Share List
            </button>
            <button v-if="count"
                class="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center px-4 py-2 rounded border"
                type="button" @click="$emit('clear')">
                <TrashIcon class="w-4 h-4 mr-2" /> Clear All
            </button>
        </div>
    </div>
</template>
<script setup>
import HeartIcon from '@/components/icons/HeartIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import ShareIcon from '@/components/icons/ShareIcon.vue'
const props = defineProps({ count: Number })
</script>
<template>
    <div class="text-center py-16">
        <div
            class="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            <HeartIcon class="w-12 h-12 text-gray-600" />
        </div>
        <h3 class="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
        <p class="text-gray-500 mb-6">Start adding items you love to keep track of them</p>
        <button
            class="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white flex items-center px-4 py-2 rounded"
            type="button">
            <PlusIcon class="w-4 h-4 mr-2" /> Start Shopping
        </button>
    </div>
</template>
<script setup>
import HeartIcon from '@/components/icons/HeartIcon.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
</script>
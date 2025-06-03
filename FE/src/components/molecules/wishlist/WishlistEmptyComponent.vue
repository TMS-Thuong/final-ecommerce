<template>
    <div class="text-center py-16">
        <div
            class="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            <HeartIcon size="12" />
        </div>
        <h3 class="text-3xl font-semibold text-gray-700 mb-2">{{ $t('wishlist.emptyTitle') }}</h3>
        <p class="text-xl text-gray-500 mb-6">{{ $t('wishlist.emptyDesc') }}</p>
        <button
            class="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white flex items-center gap-2 px-4 py-2 rounded"
            type="button" @click="$router.push({ name: 'ProductList' })">
            <BackIcon size="6" />
            <span class="text-lg">{{ $t('wishlist.startShopping') }}</span>
        </button>

    </div>
</template>
<script setup>
import HeartIcon from '@/components/icons/HeartIcon.vue'
import BackIcon from '@/components/icons/BackIcon.vue'
</script>
<template>
    <div
        class="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <HeartIcon size="9" />
            </div>
            <div>
                <h2 class="text-3xl font-bold">{{ $t('wishlist.headerTitle') }}</h2>
                <p class="text-gray-300 mt-2 text-xl">
                    {{ count }} {{ count === 1 ? 'item' : 'items' }} saved for later
                </p>
            </div>
        </div>
        <div class="text-right">
            <p class="text-xl font-bold">Total</p>
            <div class="text-2xl font-bold text-white">
                {{ total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}
            </div>
        </div>
    </div>
</template>
<script setup>
import HeartIcon from '@/components/icons/HeartIcon.vue'
const props = defineProps({ count: Number, total: Number })
</script>
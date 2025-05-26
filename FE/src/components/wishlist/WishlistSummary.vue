<template>
    <div class="border border-gray-200 bg-white rounded mb-6">
        <div class="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-800">Wishlist Summary</h3>
                <p class="text-gray-600">Total value of saved items</p>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-gray-900">{{ total.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }) }}</div>
                <button
                    class="mt-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white flex items-center justify-center px-4 py-2 rounded-md text-lg font-medium transition"
                    type="button">
                    <CartIcon size="6" class="mr-2" /> Add All to Cart
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import CartIcon from '@/components/icons/CartIcon.vue'
const props = defineProps({ total: Number })
</script>
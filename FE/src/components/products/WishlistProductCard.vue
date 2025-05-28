<template>
    <div class="border rounded-lg p-4 flex items-center gap-4 bg-white relative">
        <img :src="item.images[0]?.imageUrl" alt="" class="w-20 h-20 object-cover rounded" />
        <div class="flex-1">
            <div class="font-semibold text-lg">{{ item.name }}</div>
            <div class="text-red-600 font-bold">{{ formatPrice(item.salePrice || item.basePrice) }}</div>
        </div>
        <button @click="remove" class="text-gray-400 hover:text-red-600 transition" title="Remove from wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { useWishlistStore } from '@/stores/wishlist/wishlist'

const props = defineProps({
    item: { type: Object, required: true }
})
const wishlistStore = useWishlistStore()

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const remove = async () => {
    await wishlistStore.removeFromWishlist(props.item.id)
}
</script>
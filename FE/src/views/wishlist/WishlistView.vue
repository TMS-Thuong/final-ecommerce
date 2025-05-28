<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-0 md:p-2">
        <div class="mx-6 md:mx-10 max-w-full">
            <div class="shadow-xl border-0 bg-white rounded-lg">
                <WishlistHeader :count="wishlistItems.length" :total="totalValue" @clear="clearWishlist" />
                <div class="p-4 bg-gray-50">
                    <WishlistGrid v-if="wishlistItems.length" :items="wishlistItems" @update="fetchWishlist" />
                    <WishlistEmpty v-else />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWishlistStore } from '@/stores/wishlist/wishlist'
import { storeToRefs } from 'pinia'
import WishlistHeader from '@/components/wishlist/WishlistHeader.vue'
import WishlistGrid from '@/components/wishlist/WishlistGrid.vue'
import WishlistEmpty from '@/components/wishlist/WishlistEmpty.vue'

const wishlistStore = useWishlistStore()
const { wishlistItems } = storeToRefs(wishlistStore)
const totalValue = computed(() =>
    wishlistItems.value.reduce(
        (sum, item) => sum + (item.product?.salePrice ?? item.product?.basePrice ?? 0),
        0
    )
)
const fetchWishlist = () => wishlistStore.fetchWishlist && wishlistStore.fetchWishlist()
const clearWishlist = () => wishlistStore.clearWishlist && wishlistStore.clearWishlist()
</script>

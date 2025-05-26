<template>
    <div class="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col h-full cursor-pointer"
        @click="goToDetail">
        <div class="relative flex justify-center items-center pt-6 pb-2 px-4">
            <img :src="item.images?.[0]?.imageUrl || '/placeholder.svg'"
                class="w-64 h-64 object-contain rounded-xl bg-gray-50" alt="product" />
            <button
                class="absolute top-3 right-3 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition"
                @click.stop="removeFromWishlist">
                <HeartIcon class="w-5 h-5 text-red-500 fill-red-500" />
            </button>
            <span v-if="item.basePrice && item.salePrice && item.salePrice < item.basePrice"
                class="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow">
                Sale
            </span>
            <div v-if="item.stockQuantity <= 0"
                class="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <span class="bg-gray-800 text-white px-4 py-1 rounded-full text-sm">Out of Stock</span>
            </div>
        </div>
        <div class="flex-1 flex flex-col justify-between p-4 space-y-2">
            <div>
                <h3 class="font-semibold text-gray-900 text-base mb-1 line-clamp-2">{{ item.name }}</h3>
                <div class="flex items-center gap-2 mb-1">
                    <StarRatingComponent :rating="item.averageRating || 0" :count="item.ratingCount || 0"
                        :showCount="true" :readonly="true" size="5" />
                    <span class="text-xs text-gray-500">{{ item.averageRating || 0 }} ({{ item.ratingCount || 0
                        }})</span>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-lg font-bold text-gray-900">{{ formatPrice(item.salePrice || item.basePrice)
                        }}</span>
                    <span v-if="item.basePrice && item.salePrice && item.salePrice < item.basePrice"
                        class="text-xs text-gray-400 line-through">{{ formatPrice(item.basePrice) }}</span>
                </div>
            </div>
            <div class="flex gap-2 pt-2">
                <button
                    class="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-3 py-2 rounded-lg flex items-center justify-center font-medium transition"
                    :disabled="item.stockQuantity <= 0" @click.stop>
                    <CartIcon class="w-4 h-4 mr-2" />
                    {{ item.stockQuantity > 0 ? 'Add to Cart' : 'Notify Me' }}
                </button>
                <button
                    class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center justify-center transition"
                    @click.stop="removeFromWishlist">
                    <TrashIcon class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import CartIcon from '@/components/icons/CartIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import StarRatingComponent from '@/components/atoms/StarRatingComponent.vue'
import { useWishlistStore } from '@/stores/wishlist'
const props = defineProps({ item: Object })
const wishlistStore = useWishlistStore()
const router = useRouter()
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
const removeFromWishlist = async () => {
    await wishlistStore.removeFromWishlist(props.item.id)
}
const goToDetail = () => {
    router.push(`/products/${props.item.id}`)
}
</script>
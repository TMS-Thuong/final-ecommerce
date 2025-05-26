<template>
    <div class="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col h-full cursor-pointer"
        @click="goToDetail">
        <div class="relative flex justify-center items-center pt-6 pb-2 px-4">
            <img :src="item.product.images?.[0]?.imageUrl || '/placeholder.svg'"
                class="w-64 h-64 object-contain rounded-xl bg-gray-50" alt="product" />
            <button
                class="absolute top-3 right-3 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition p-0 m-0"
                @click.stop="removeFromWishlist">
                <HeartIcon class="w-6 h-6 block m-0 p-0 text-red-500 fill-red-500" />
            </button>
            <span
                v-if="item.product.basePrice && item.product.salePrice && item.product.salePrice < item.product.basePrice"
                class="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow">
                {{ $t('wishlist.sale') }}
            </span>
            <div v-if="item.product.stockQuantity <= 0"
                class="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <span class="bg-gray-800 text-white px-4 py-1 rounded-full text-sm">{{ $t('wishlist.outOfStock')
                }}</span>
            </div>
        </div>
        <div class="flex-1 flex flex-col justify-between p-4 space-y-2">
            <div>
                <h3 class="font-semibold text-gray-900 text-base mb-1 line-clamp-2">{{ item.product.name }}</h3>
                <div class="flex items-center gap-2 mb-1">
                    <StarRatingComponent :rating="item.product.averageRating || 0"
                        :count="item.product.ratingCount || 0" :showCount="true" :readonly="true" size="5" />
                    <span class="text-xs text-gray-500">{{ item.product.averageRating || 0 }} ({{
                        item.product.ratingCount || 0
                    }})</span>
                </div>
                <div class="flex items-end gap-2">
                    <span class="text-lg font-bold text-gray-900">{{ formatPrice(item.product.salePrice ||
                        item.product.basePrice)
                    }}</span>
                    <span
                        v-if="item.product.basePrice && item.product.salePrice && item.product.salePrice < item.product.basePrice"
                        class="text-xs text-gray-400 line-through">{{ formatPrice(item.product.basePrice) }}</span>
                </div>
            </div>
            <div class="flex gap-2 pt-2">
                <button
                    class="flex-1 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-lg text-white rounded-md flex items-center justify-center font-medium transition"
                    :disabled="item.product.stockQuantity <= 0" @click.stop="handleAddToCart">
                    <CartIcon size="6" class="mr-2" />
                    {{ $t('wishlist.addToCart') }}
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
import { addToCart } from '@/api/cart'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'
import { useI18n } from 'vue-i18n'
const props = defineProps({ item: Object })
const wishlistStore = useWishlistStore()
const router = useRouter()
const { showToast } = useToast()
const { t } = useI18n()
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
const removeFromWishlist = async () => {
    if (!props.item.favoriteItemId) {
        showToast(ToastEnum.Error, t('wishlist.errors.notFoundId'))
        return
    }
    try {
        await wishlistStore.removeFromWishlist(props.item.favoriteItemId)
        showToast(ToastEnum.Success, t('wishlist.messages.removed'))
    } catch (e) {
        showToast(ToastEnum.Error, t('wishlist.errors.removeFailed'))
    }
}
const goToDetail = () => {
    router.push(`/products/${props.item.product.id}`)
}
const handleAddToCart = async () => {
    try {
        await addToCart(props.item.product.id, 1)
        showToast(ToastEnum.Success, t('wishlist.messages.addedToCart'))
    } catch (e) {
        showToast(ToastEnum.Error, t('wishlist.errors.addToCartFailed'))
    }
}
</script>
<template>
    <div class="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col h-full cursor-pointer"
        @click="goToDetail">
        <div class="relative flex justify-center items-center pt-4 sm:pt-6 pb-2 px-2 sm:px-4">
            <img :src="item.product.images?.[0]?.imageUrl || '/src/assets/no-img.png'"
                class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-contain rounded-xl bg-gray-50" alt="product" />
            <button
                class="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border-none bg-transparent hover:bg-gray-100 transition p-0 m-0">
                <HeartIcon fillColor="currentColor" customClass="text-red-500 fill-red-500" size="8"
                    @click.stop="removeFromWishlist" />
            </button>

            <span
                v-if="item.product.basePrice && item.product.salePrice && item.product.salePrice < item.product.basePrice"
                class="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white text-sm sm:text-lg px-2 py-0.5 rounded-full font-semibold shadow">
                {{ $t('wishlist.sale') }}
            </span>
            <div v-if="item.product.stockQuantity <= 0"
                class="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <span class="bg-gray-800 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">{{
                    $t('wishlist.outOfStock')
                    }}</span>
            </div>
        </div>

        <div class="p-2 sm:p-4 flex flex-col flex-grow">
            <div>
                <h3 class="font-semibold text-gray-900 text-base sm:text-lg md:text-xl mb-1 line-clamp-2">{{
                    item.product.name }}</h3>
                <div class="flex items-center gap-1 sm:gap-2 mb-1">
                    <StarRatingComponent :rating="item.product.averageRating || 0"
                        :count="item.product.ratingCount || 0" :showCount="true" :readonly="true" size="6" />
                    <span class="text-sm sm:text-lg text-gray-500">{{ item.product.averageRating || 0 }} ({{
                        item.product.ratingCount || 0
                    }})</span>
                </div>
                <div class="flex items-end gap-1 sm:gap-2">
                    <span class="text-base sm:text-lg md:text-xl font-bold text-gray-900">{{
                        formatPrice(item.product.salePrice ||
                            item.product.basePrice)
                    }}</span>
                    <span
                        v-if="item.product.basePrice && item.product.salePrice && item.product.salePrice < item.product.basePrice"
                        class="text-sm sm:text-lg text-gray-400 line-through">{{ formatPrice(item.product.basePrice)
                        }}</span>
                </div>
            </div>
            <div class="flex gap-2 pt-2 mt-auto">
                <button
                    class="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-sm sm:text-lg text-white rounded-md flex items-center justify-center font-medium transition"
                    :disabled="item.product.stockQuantity <= 0" @click.stop="handleAddToCart">
                    <CartIcon size="6" class="mr-1 sm:mr-2" />
                    {{ $t('wishlist.addToCart') }}
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import CartIcon from '@/components/icons/CartIcon.vue'
import StarRatingComponent from '@/components/atoms/StarRatingComponent.vue'
import { useWishlistStore } from '@/stores/wishlist/wishlist'
import { useCartStore } from '@/stores/cart/cart'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'
import { useI18n } from 'vue-i18n'
import { getCookie } from '@/utils/cookie'
const props = defineProps({ item: Object })
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const { showToast } = useToast()
const { t } = useI18n()
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
const removeFromWishlist = async () => {
    if (!props.item.favoriteItemId) {
        showToast(ToastEnum.Error, t('wishlist.errors.notFoundId'))
        return
    }
    try {
        if (!getCookie('accessToken')) {
            showToast(ToastEnum.Error, t('common.authenticationRequired'));
            router.push({ name: 'Login', query: { redirect: route.fullPath } });
            return;
        }
        await wishlistStore.removeFromWishlist(props.item.favoriteItemId)
        showToast(ToastEnum.Success, t('wishlist.messages.removed'))
    } catch (e) {
        if (e.message === 'authenticationRequired') {
            showToast(ToastEnum.Error, t('common.authenticationRequired'));
            router.push({ name: 'Login', query: { redirect: route.fullPath } });
            return;
        }
        const msg =
            e?.response?.data?.message ||
            e?.response?.data?.error ||
            e?.response?.data?.code ||
            (typeof e?.response?.data === 'string' ? e.response.data : '') ||
            e?.message ||
            t('wishlist.errors.removeFailed');
        showToast(ToastEnum.Error, msg)
    }
}
const goToDetail = () => {
    router.push(`/products/${props.item.product.id}`)
}
const handleAddToCart = async () => {
    try {
        if (!getCookie('accessToken')) {
            showToast(ToastEnum.Error, t('common.authenticationRequired'));
            router.push({ name: 'Login', query: { redirect: route.fullPath } });
            return;
        }
        await cartStore.addItem(props.item.product.id, 1)
        showToast(ToastEnum.Success, t('wishlist.messages.addedToCart'))
    } catch (e) {
        if (e.message === 'authenticationRequired') {
            showToast(ToastEnum.Error, t('common.authenticationRequired'));
            router.push({ name: 'Login', query: { redirect: route.fullPath } });
            return;
        }
        const msg =
            e?.response?.data?.message ||
            e?.response?.data?.error ||
            e?.response?.data?.code ||
            (typeof e?.response?.data === 'string' ? e.response.data : '') ||
            e?.message ||
            t('wishlist.errors.addToCartFailed');
        showToast(ToastEnum.Error, msg)
    }
}
</script>
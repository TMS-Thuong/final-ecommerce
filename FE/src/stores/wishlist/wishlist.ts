import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { wishlistApi } from '@/api/wishlist';
import { getCookie, setCookie, removeCookie } from '@/utils/cookie';

export interface WishlistItem {
    id: number;
    favoriteId: number;
    productId: number;
    product: {
        id: number;
        name: string;
        basePrice: number;
        salePrice: number | null;
        stockQuantity: number;
        images: {
            id: number;
            productId: number;
            imageUrl: string;
            isThumbnail: boolean;
            displayOrder: number;
        }[];
    };
}

export interface Wishlist {
    id: number;
    userId: number;
    items: WishlistItem[];
    createdAt: string;
}

const WISHLIST_STORAGE_KEY = 'ecommerce_wishlist_data';

export const useWishlistStore = defineStore('wishlist', () => {
    const wishlistProducts = ref<any[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    watch(() => wishlistProducts.value, (newVal) => {
        setCookie(WISHLIST_STORAGE_KEY, JSON.stringify(newVal));
    }, { deep: true });

    const fetchWishlist = async () => {
        if (!getCookie('accessToken')) {
            wishlistProducts.value = [];
            setCookie(WISHLIST_STORAGE_KEY, JSON.stringify([]));
            return;
        }
        try {
            isLoading.value = true;
            error.value = null;
            const response = await wishlistApi.getWishlist();
            if (response && response.data && Array.isArray(response.data.data)) {
                wishlistProducts.value = response.data.data;
            } else if (response && Array.isArray(response.data)) {
                wishlistProducts.value = response.data;
            } else {
                wishlistProducts.value = [];
            }
        } catch (err) {
            error.value = 'Failed to fetch wishlist';
            wishlistProducts.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const addToWishlist = async (productId: number) => {
        if (!getCookie('accessToken')) {
            error.value = 'authenticationRequired';
            throw new Error('authenticationRequired');
        }
        try {
            isLoading.value = true;
            error.value = null;
            await wishlistApi.addToWishlist(productId);
            await fetchWishlist();
            return true;
        } catch (err) {
            error.value = 'Failed to add item to wishlist';
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const removeFromWishlist = async (productId: number) => {
        if (!getCookie('accessToken')) {
            error.value = 'authenticationRequired';
            throw new Error('authenticationRequired');
        }
        try {
            isLoading.value = true;
            error.value = null;
            await wishlistApi.removeFromWishlist(productId);
            await fetchWishlist();
            return true;
        } catch (err) {
            error.value = 'Failed to remove item from wishlist';
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const initWishlist = async () => {
        if (getCookie('accessToken')) {
            await fetchWishlist();
        } else {
            const stored = getCookie(WISHLIST_STORAGE_KEY);
            if (stored) {
                wishlistProducts.value = JSON.parse(stored);
            } else {
                wishlistProducts.value = [];
            }
        }
    };

    const clearWishlist = () => {
        wishlistProducts.value = [];
        removeCookie(WISHLIST_STORAGE_KEY);
        setCookie(WISHLIST_STORAGE_KEY, JSON.stringify([]));
    };

    const isInWishlist = (productId: number) => {
        return wishlistProducts.value.some(item => item.productId === productId || (item.product && item.product.id === productId));
    };

    const totalItems = computed(() => wishlistProducts.value.length);
    const wishlistItems = computed(() => wishlistProducts.value);
    const isEmpty = computed(() => wishlistProducts.value.length === 0);

    return {
        wishlistProducts,
        isLoading,
        error,
        isEmpty,
        totalItems,
        wishlistItems,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        initWishlist,
        clearWishlist,
        isInWishlist
    };
}); 
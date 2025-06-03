import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { wishlistApi } from '@/api/wishlist';
import Cookies from 'js-cookie';

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

const WISHLIST_COOKIE_KEY = 'ecommerce_wishlist_data';

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
                Cookies.set(WISHLIST_COOKIE_KEY, JSON.stringify(response.data.data), { expires: 7 });
            } else if (response && Array.isArray(response.data)) {
                wishlistProducts.value = response.data;
                Cookies.set(WISHLIST_COOKIE_KEY, JSON.stringify(response.data), { expires: 7 });
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
        if (localStorage.getItem('accessToken')) {
            const stored = Cookies.get(WISHLIST_COOKIE_KEY);
            if (stored) {
                wishlistProducts.value = JSON.parse(stored);
            } else {
                wishlistProducts.value = [];
            }
        }
    };

    const clearWishlist = () => {
        wishlistProducts.value = defaultWishlistValue();
        Cookies.remove(WISHLIST_COOKIE_KEY);
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
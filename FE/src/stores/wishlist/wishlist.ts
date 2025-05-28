import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { wishlistApi } from '@/api/wishlist';

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

    const fetchWishlist = async () => {
        if (!localStorage.getItem('accessToken')) {
            wishlistProducts.value = []
            return
        }
        try {
            isLoading.value = true;
            error.value = null;
            const response = await wishlistApi.getWishlist();
            if (response && response.data && Array.isArray(response.data.data)) {
                wishlistProducts.value = response.data.data;
                localStorage.setItem('ecommerce_wishlist_data', JSON.stringify(response.data.data));
            } else if (response && Array.isArray(response.data)) {
                wishlistProducts.value = response.data;
                localStorage.setItem('ecommerce_wishlist_data', JSON.stringify(response.data));
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
        if (!localStorage.getItem('accessToken')) {
            error.value = 'authentication_required';
            throw new Error('authentication_required');
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
        if (!localStorage.getItem('accessToken')) {
            error.value = 'authentication_required';
            throw new Error('authentication_required');
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
            const stored = localStorage.getItem('ecommerce_wishlist_data');
            if (stored) {
                wishlistProducts.value = JSON.parse(stored);
            }
            return await fetchWishlist();
        } else {
            return false;
        }
    };

    const defaultWishlistValue = () => ([]);

    const clearWishlist = () => {
        wishlistProducts.value = defaultWishlistValue();
        localStorage.removeItem('ecommerce_wishlist_data');
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
import instanceAxios from '@/helpers/configAxios'

const API_URL = '/api'

export const wishlistApi = {
    getWishlist: () =>
        instanceAxios.get(`${API_URL}/wishlist`),

    addToWishlist: (productId: number) =>
        instanceAxios.post(`${API_URL}/wishlist`, { productId }),

    removeFromWishlist: (favoriteItemId: number) =>
        instanceAxios.delete(`${API_URL}/wishlist/${favoriteItemId}`)
}

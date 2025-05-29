import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import type { Router } from 'vue-router'
import { AuthRouterEnum } from '@/enums/router'
import { useCartStore } from '@/stores/cart/cart'
import { getCookie, setCookie, removeCookie } from '@/utils/cookie'
import { useWishlistStore } from '@/stores/wishlist/wishlist'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: getCookie('accessToken'),
    refreshToken: getCookie('refreshToken'),
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.accessToken,
  },

  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      setCookie('accessToken', accessToken)
      setCookie('refreshToken', refreshToken)
    },

    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      removeCookie('accessToken')
      removeCookie('refreshToken')
      removeCookie('ecommerce_cart_data')
      removeCookie('ecommerce_wishlist_data')
      const wishlistStore = useWishlistStore();
      wishlistStore.wishlistProducts = [];
    },

    async refreshAccessToken() {
      const refreshToken = this.refreshToken
      if (!refreshToken) {
        return
      }

      try {
        const response = await authApi.refreshAccessToken(refreshToken)
        const { accessToken, refreshToken: newRefreshToken } = response.data
        this.setTokens(accessToken, newRefreshToken)
        return accessToken
      } catch (error) {
        this.clearTokens()
        return null
      }
    },

    logout(router: Router) {
      const currentPath = router.currentRoute.value.fullPath
      this.clearTokens()
      const cartStore = useCartStore()
      cartStore.clearCart()
      router.push({
        name: AuthRouterEnum.Login,
        query: { redirect: currentPath }
      })
    }
  },
})

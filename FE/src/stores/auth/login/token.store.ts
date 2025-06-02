import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import type { Router } from 'vue-router'
import { AuthRouterEnum } from '@/enums/router'
import { useCartStore } from '@/stores/cart/cart'
import { useWishlistStore } from '@/stores/wishlist/wishlist'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.accessToken,
  },

  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },

    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
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
      localStorage.removeItem('ecommerce_cart_data')
      const cartStore = useCartStore()
      cartStore.clearCart()
      const wishlistStore = useWishlistStore()
      wishlistStore.clearWishlist()
      window.location.reload()
      router.push({
        name: AuthRouterEnum.Login,
        query: { redirect: currentPath }
      })
    }
  },
})

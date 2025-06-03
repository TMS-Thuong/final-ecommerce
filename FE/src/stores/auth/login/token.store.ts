import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import type { Router } from 'vue-router'
import { AuthRouterEnum } from '@/enums/router'
import { useCartStore } from '@/stores/cart/cart'
import { useWishlistStore } from '@/stores/wishlist/wishlist'
import { getCookie, removeCookie, setCookie } from '@/utils/cookie'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticating: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: getCookie('accessToken'),
    refreshToken: getCookie('refreshToken'),
    isAuthenticating: false
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.accessToken,
  },

  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      try {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        setCookie('accessToken', accessToken, 7)
        setCookie('refreshToken', refreshToken, 7)
      } catch (error) {
        console.error('Error setting tokens:', error)
        this.clearTokens()
      }
    },

    clearTokens() {
      try {
        this.accessToken = null
        this.refreshToken = null
        removeCookie('accessToken')
        removeCookie('refreshToken')
        removeCookie('ecommerce_cart_data')
        removeCookie('ecommerce_wishlist_data')
        const wishlistStore = useWishlistStore()
        wishlistStore.wishlistProducts = []
      } catch (error) {
        console.error('Error clearing tokens:', error)
      }
    },

    async refreshAccessToken() {
      if (this.isAuthenticating) return null
      this.isAuthenticating = true

      const refreshToken = this.refreshToken
      if (!refreshToken) {
        this.isAuthenticating = false
        return null
      }

      try {
        const response = await authApi.refreshAccessToken(refreshToken)
        const { accessToken, refreshToken: newRefreshToken } = response.data
        this.setTokens(accessToken, newRefreshToken)
        this.isAuthenticating = false
        return accessToken
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.clearTokens()
        this.isAuthenticating = false
        return null
      }
    },

    logout(router: Router) {
      try {
        const currentPath = router.currentRoute.value.fullPath
        this.clearTokens()
        const cartStore = useCartStore()
        cartStore.clearCart()
        const wishlistStore = useWishlistStore()
        wishlistStore.clearWishlist()

        // Use router.replace instead of push to prevent back navigation
        router.replace({
          name: AuthRouterEnum.Login,
          query: { redirect: currentPath }
        })
      } catch (error) {
        console.error('Error during logout:', error)
        // Force reload as fallback
        window.location.href = '/login'
      }
    }
  },
})

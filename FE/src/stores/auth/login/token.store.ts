import { authApi } from '@/api/auth'
import { defineStore } from 'pinia'

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
    isAuthenticated: (state) => !!state.accessToken,
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
        console.error('No refresh token found')
        return
      }

      try {
        const response = await authApi.refreshAccessToken(refreshToken)
        const { accessToken, refreshToken: newRefreshToken } = response.data
        this.setTokens(accessToken, newRefreshToken)
        console.log('Access token refreshed successfully:', accessToken)
        return accessToken
      } catch (error) {
        console.error('Error refreshing token:', error)
        this.clearTokens()
        return null
      }
    }
  },
})

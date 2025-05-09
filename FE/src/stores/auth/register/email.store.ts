import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    email: localStorage.getItem('email') || '',
    needsVerification: false,
    resending: false,
  }),
  actions: {
    setEmail(email: string) {
      this.email = email
      localStorage.setItem('email', email)
    },
    setNeedsVerification(status: boolean) {
      this.needsVerification = status
    },
    setResending(status: boolean) {
      this.resending = status
    },
  },
})

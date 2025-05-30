import { RouterEnum } from "@/enums/router"
import router from "@/router"
import { useAuthStore } from "@/stores/auth/login/token.store"
import axios from "axios"
import { getCookie } from '@/utils/cookie'

const instanceAxios = axios.create({
  timeout: 5000,
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

instanceAxios.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instanceAxios.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    console.error('Error response:', error.response)
    const status = error.response?.status
    const originalRequest = error.config
    const authStore = useAuthStore()

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newAccessToken = await authStore.refreshAccessToken()
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return instanceAxios(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        authStore.clearTokens()
        router.push({ name: RouterEnum.Login })
        return Promise.reject({ code: 'error.tokenRefreshFailed' })
      }
    }

    switch (status) {
      case 400:
      case 403:
      case 404:
      case 409:
      case 500:
        return Promise.reject({
          code: error.response?.data?.code || 'error.unexpectedError',
          message: error.response?.data?.message || '',
          data: error.response?.data
        })
      case 401:
        authStore.clearTokens()
        router.push({ name: RouterEnum.Login })
        break;
      default:
        return Promise.reject({ code: 'error.unexpectedError' })
    }
  }
)
export default instanceAxios;

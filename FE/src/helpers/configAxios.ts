import { RouterEnum } from "@/enums/router"
import router from "@/router"
import { useAuthStore } from "@/stores/auth/login/token.store"
import axios from "axios"
import { getCookie } from '@/utils/cookie'

const instanceAxios = axios.create({
  timeout: 10000,
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

instanceAxios.interceptors.request.use(
  (config) => {
    try {
      const accessToken = getCookie('accessToken')
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }
      return config
    } catch (error) {
      console.error('Error in request interceptor:', error)
      return Promise.reject(error)
    }
  },
  (error) => {
    console.error('Request interceptor error:', error)
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
        router.replace({ name: RouterEnum.Login })
        return Promise.reject({ code: 'error.tokenRefreshFailed' })
      }
    }

    switch (status) {
      case 400:
        return Promise.reject({
          code: error.response?.data?.code || 'error.badRequest',
          message: error.response?.data?.message || 'Invalid request',
          data: error.response?.data
        })
      case 401:
        authStore.clearTokens()
        router.replace({ name: RouterEnum.Login })
        return Promise.reject({
          code: 'error.unauthorized',
          message: 'Please login to continue'
        })
      case 403:
        return Promise.reject({
          code: 'error.forbidden',
          message: 'You do not have permission to perform this action'
        })
      case 404:
        return Promise.reject({
          code: 'error.notFound',
          message: 'The requested resource was not found'
        })
      case 409:
        return Promise.reject({
          code: 'error.conflict',
          message: 'There was a conflict with the current state'
        })
      case 500:
        return Promise.reject({
          code: 'error.serverError',
          message: 'An unexpected error occurred'
        })
      default:
        return Promise.reject({
          code: 'error.unexpectedError',
          message: 'An unexpected error occurred'
        })
    }
  }
)
export default instanceAxios;

import axios from 'axios'
import { ApiEndpoint } from '@/api/api' 
import router from '@/router'
import { RouterName } from '@/enums/router'

const instanceAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

instanceAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

instanceAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('Không có refresh token')
        }

        const response = await instanceAxios.post(ApiEndpoint.auth.refreshToken, {
          refreshToken,
        })

        const { accessToken } = response.data.data

        localStorage.setItem('accessToken', accessToken)

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

        return instanceAxios(originalRequest)
      } catch (err) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push({ name: RouterName.Login })
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default instanceAxios

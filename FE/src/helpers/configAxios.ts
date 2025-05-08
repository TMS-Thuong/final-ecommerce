import axios from 'axios'

const instanceAxios = axios.create({
  timeout: 5000,
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})


instanceAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const code = error.response?.data?.code || 'error.UNEXPECTED_ERROR'
    switch (status) {
      case 400:
      case 401:
      case 403:
      case 404:
      case 409:
      case 429:
      case 500:
        return Promise.reject({ code })
      default:
        return Promise.reject({ code })
    }
  }
)

export default instanceAxios

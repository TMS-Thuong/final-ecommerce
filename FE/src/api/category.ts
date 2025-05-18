import instanceAxios from '@/helpers/configAxios'

const API_URL = '/api'

export const categoryApi = {
  getCategories: () => 
    instanceAxios.get(`${API_URL}/categories`),
  
  getCategoryById: (id: number) => 
    instanceAxios.get(`${API_URL}/categories/${id}`)
} 
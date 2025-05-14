import instanceAxios from '@/helpers/configAxios'

const API_URL = '/api'

export const productApi = {
  getProducts: (params = {}) => 
    instanceAxios.get(`${API_URL}/products`, { params }),
  
  getProductById: (id: number) => 
    instanceAxios.get(`${API_URL}/products/${id}`),
  
  getProductImages: (productId: number) => 
    instanceAxios.get(`${API_URL}/products/${productId}/images`)
}
import instanceAxios from '@/helpers/configAxios'

const API_URL = '/api'

export const brandApi = {
  getBrands: () => 
    instanceAxios.get(`${API_URL}/brands`),
  
  getBrandById: (id: number) => 
    instanceAxios.get(`${API_URL}/brands/${id}`)
} 
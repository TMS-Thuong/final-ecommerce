import instanceAxios from '@/helpers/configAxios'

const API_URL = '/api'

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
  brandId?: number;
  stockStatus?: string;
  categories?: string[];
  brands?: string[];
  averageRating?: number;
  sortBy?: string;
}

export const productApi = {
  getProducts: (params: ProductQueryParams = {}) =>
    instanceAxios.get(`${API_URL}/products`, {
      params: {
        ...params,
        sortBy: params.sortBy,
        categoryId: params.categoryId || (params.categories && params.categories.length > 0 ? params.categories : undefined),
        brandId: params.brandId || (params.brands && params.brands.length > 0 ? params.brands : undefined),
      }
    }),

  getProductById: (id: number) =>
    instanceAxios.get(`${API_URL}/products/${id}`),

  getProductImages: (productId: number) =>
    instanceAxios.get(`${API_URL}/products/${productId}/images`)
}
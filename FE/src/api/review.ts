import instanceAxios from '@/helpers/configAxios'

const API_URL = '/api'

export const reviewApi = {
    getProductReviews: (productId: number) =>
        instanceAxios.get(`${API_URL}/products/${productId}/reviews`),

    getMyReviews: () =>
        instanceAxios.get(`${API_URL}/reviews/me`),

    createReview: (data: any) =>
        instanceAxios.post(`${API_URL}/reviews`, data),

    updateReview: (reviewId: number, data: any) =>
        instanceAxios.put(`${API_URL}/reviews/${reviewId}`, data),

    uploadReviewImage: (reviewId: number, formData: FormData) =>
        instanceAxios.post(`${API_URL}/reviews/${reviewId}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    deleteReviewImage: (reviewId: number, imageId: number) =>
        instanceAxios.delete(`${API_URL}/reviews/${reviewId}/images/${imageId}`)
} 
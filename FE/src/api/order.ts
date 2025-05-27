import axios from 'axios';
import { getAuthHeader } from '@/utils/auth';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export interface CreateOrderRequest {
  addressId: number;
  shippingMethodId: number;
  paymentMethodId: number;
  customerNotes?: string;
  couponCode?: string;
  cartItemIds?: number[];
}

export default {
  async createOrder(orderData: CreateOrderRequest) {
    const response = await axios.post(`${API_URL}/api/orders`, orderData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async getOrderDetail(orderId: number) {
    const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async getUserOrders() {
    const response = await axios.get(`${API_URL}/api/orders`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async cancelOrder(orderId: number) {
    const response = await axios.post(`${API_URL}/api/orders/${orderId}/cancel`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async getPurchasedProducts() {
    const response = await axios.get(`${API_URL}/api/orders/purchased-products`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
}; 
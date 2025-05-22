import axios from 'axios';
import { getAuthHeader } from '@/utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ShippingMethod {
  id: number;
  name: string;
  description: string;
  code?: string;
  price?: number;
  estimatedDeliveryTime?: string;
}

export default {
  async getShippingMethods() {
    try {
      const response = await axios.get(`${BASE_URL}/api/shipping/methods`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Standard Shipping',
            description: 'Delivery within 3-5 business days',
            price: 30000,
            estimatedDeliveryTime: '3-5 business days'
          },
          {
            id: 2,
            name: 'Express Shipping',
            description: 'Delivery within 1-2 business days',
            price: 50000,
            estimatedDeliveryTime: '1-2 business days'
          }
        ]
      };
    }
  },

  async calculateShippingFee(shippingMethodId: number, totalAmount: number) {
    try {
      const response = await axios.post(`${BASE_URL}/api/shipping/calculate-fee`, {
        shippingMethodId,
        totalAmount
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      const baseFee = 30000;
      const fee = totalAmount > 1000000 ? baseFee * 0.5 : baseFee;
      
      return {
        success: true,
        data: { fee }
      };
    }
  }
}; 
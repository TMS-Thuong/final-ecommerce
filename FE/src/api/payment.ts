import axios from 'axios';
import { getAuthHeader } from '@/utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ShippingMethod {
  id: number;
  name: string;
  code: string;
  description: string | null;
  cost: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault: boolean;
}

export interface CreateOrderData {
  addressId: number;
  shippingMethodId: number;
  paymentMethodId: number;
  couponCode?: string;
  customerNotes?: string;
}

export const getUserAddresses = async (): Promise<Address[]> => {
  const response = await axios.get(`${BASE_URL}/user/api/addresses`, {
    headers: getAuthHeader()
  });
  return response.data.data;
};

export const addAddress = async (addressData: Omit<Address, 'id' | 'userId'>): Promise<Address> => {
  const response = await axios.post(`${BASE_URL}/user/api/addresses`, addressData, {
    headers: getAuthHeader()
  });
  return response.data.data;
};

export const getShippingMethods = async (): Promise<ShippingMethod[]> => {
  const response = await axios.get(`${BASE_URL}/api/shipping/methods`);
  return response.data.data;
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await axios.get(`${BASE_URL}/api/payment/methods`);
  return response.data.data;
};

export const createOrder = async (orderData: CreateOrderData): Promise<{order: any, paymentUrl?: string}> => {
  const response = await axios.post(`${BASE_URL}/user/api/orders`, orderData, {
    headers: getAuthHeader()
  });
  return response.data.data;
};

export const getPaymentStatus = async (orderId: number): Promise<{
  orderId: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
}> => {
  const response = await axios.get(`${BASE_URL}/api/payment/status/${orderId}`, {
    headers: getAuthHeader()
  });
  return response.data.data;
};

export const createPaymentUrl = async (orderId: number): Promise<{paymentUrl: string}> => {
  const response = await axios.get(`${BASE_URL}/api/payment/create-url/${orderId}`, {
    headers: getAuthHeader()
  });
  return { paymentUrl: response.data.paymentUrl };
};

export default {
  async createVnpayUrl(orderId: number) {
    const response = await axios.post(`${BASE_URL}/api/payment/create-url/${orderId}`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async checkPaymentStatus(orderId: number) {
    const response = await axios.get(`${BASE_URL}/api/payment/status/${orderId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async processVnpayReturn(queryParams: any) {
    const response = await axios.get(`${BASE_URL}/api/payment/vnpay_return`, {
      params: queryParams
    });
    return response.data;
  },

  async getPaymentMethods() {
    const response = await axios.get(`${BASE_URL}/api/payment/methods`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
}; 
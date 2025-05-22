import axios from 'axios';
import { getAuthHeader } from '@/utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Address {
  id?: number;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export default {
  async getAddresses() {
    const response = await axios.get(`${BASE_URL}/user/api/addresses`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async getAddressById(id: number) {
    const response = await axios.get(`${BASE_URL}/user/api/addresses/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async addAddress(addressData: Address) {
    const response = await axios.post(`${BASE_URL}/user/api/addresses`, addressData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async updateAddress(id: number, addressData: Address) {
    const response = await axios.put(`${BASE_URL}/user/api/addresses/${id}`, addressData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async deleteAddress(id: number) {
    const response = await axios.delete(`${BASE_URL}/user/api/addresses/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async setDefaultShippingAddress(id: number) {
    const response = await axios.patch(`${BASE_URL}/user/api/addresses/${id}/default-shipping`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  async setDefaultBillingAddress(id: number) {
    const response = await axios.patch(`${BASE_URL}/user/api/addresses/${id}/default-billing`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }
}; 
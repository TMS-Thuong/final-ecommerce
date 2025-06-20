import axios from 'axios';
import { getAuthHeader } from '@/utils/auth';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getCart = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/cart`, {
      headers: getAuthHeader(),
    });

    const cartData = response.data.data || response.data;

    if (cartData) {
      let actualTotalItems = 0;
      if (cartData.items && Array.isArray(cartData.items)) {
        actualTotalItems = cartData.items.reduce((total: number, item: { quantity?: number }) =>
          total + (item.quantity || 0), 0);
      }

      return {
        ...cartData,
        totalItems: actualTotalItems
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const addToCart = async (productId: number, quantity: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/cart`,
      { productId, quantity },
      {
        headers: getAuthHeader(),
      }
    );

    const responseData = response.data.data || response.data;

    return responseData;
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (cartItemId: number, quantity: number) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/cart/${cartItemId}`,
      { quantity },
      {
        headers: getAuthHeader(),
      }
    );

    const responseData = response.data.data || response.data;

    return responseData;
  } catch (error) {
    throw error;
  }
};

export const removeCartItem = async (cartItemId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/api/cart/${cartItemId}`, {
      headers: getAuthHeader(),
    });

    const responseData = response.data.data || response.data;
    return responseData;
  } catch (error) {
    throw new Error('Failed to remove item from cart');
  }
};

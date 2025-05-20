import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/api/cart';

export interface CartItem {
  id: number;
  cartId: string;
  productId: number;
  quantity: number;
  addedAt: string;
  product: {
    id: number;
    name: string;
    basePrice: number;
    salePrice: number | null;
    stockQuantity: number;
    image: string | null;
  };
  price: number;
  subtotal: number;
  options: Record<string, unknown>;
}

export interface Cart {
  id: string | null;
  userId: number | null;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const defaultCartValue = (): Cart => ({
    id: null,
    userId: null,
    items: [],
    totalAmount: 0,
    totalItems: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const isEmpty = computed(() => !cart.value || !cart.value.items || cart.value.items.length === 0);
  const totalItems = computed(() => {
    if (!cart.value || !cart.value.items) {
      return 0;
    }
    
    const total = cart.value.items.reduce((sum: number, item: CartItem) => sum + (item.quantity || 0), 0);
    return total;
  });
  const totalAmount = computed(() => cart.value?.totalAmount || 0);
  const cartItems = computed(() => cart.value?.items || []);

  const fetchCart = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await getCart();
      
      if (response) {
        cart.value = response;
      } else {
        cart.value = defaultCartValue();
      }
    } catch (err) {
      error.value = 'Failed to fetch cart';
      cart.value = defaultCartValue();
    } finally {
      isLoading.value = false;
    }
  };

  const addItem = async (productId: number, quantity: number) => {
    if (!localStorage.getItem('accessToken')) {
      error.value = 'authentication_required';
      return false;
    }
    
    try {
      isLoading.value = true;
      error.value = null;
      await addToCart(productId, quantity);
      
      await fetchCart();
      
      return true;
    } catch (err) {
      error.value = 'Failed to add item to cart';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateItem = async (cartItemId: number, quantity: number) => {
    if (!localStorage.getItem('accessToken')) {
      error.value = 'authentication_required';
      return false;
    }
    
    try {
      isLoading.value = true;
      error.value = null;
      await updateCartItem(cartItemId, quantity);
      
      await fetchCart();
      
      return true;
    } catch (err) {
      error.value = 'Failed to update cart item';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (!localStorage.getItem('accessToken')) {
      error.value = 'authentication_required';
      return false;
    }
    
    try {
      isLoading.value = true;
      error.value = null;
      await removeCartItem(cartItemId);
      
      await fetchCart();
      
      return true;
    } catch (err) {
      error.value = 'Failed to remove item from cart';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const initCart = async () => {
    if (localStorage.getItem('accessToken')) {
      return await fetchCart();
    } else {
      return false;
    }
  };

  const clearCart = () => {
    cart.value = null;
  };

  return {
    cart,
    isLoading,
    error,
    isEmpty,
    totalItems,
    totalAmount,
    cartItems,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    initCart,
    clearCart
  };
}); 
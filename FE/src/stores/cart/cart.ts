import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
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

const CART_STORAGE_KEY = 'ecommerce_cart_data';

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null);
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

  const initializeCartFromLocalStorage = () => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        cart.value = JSON.parse(storedCart);
      } else {
        cart.value = defaultCartValue();
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      cart.value = defaultCartValue();
    }
  };

  initializeCartFromLocalStorage();

  watch(() => cart.value, (newCart) => {
    if (newCart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    }
  }, { deep: true });

  const isEmpty = computed(() => !cart.value || !cart.value.items || cart.value.items.length === 0);
  const totalItems = computed(() => {
    if (!cart.value || !cart.value.items) {
      return 0;
    }

    const total = cart.value.items.reduce((sum: number, item: CartItem) => sum + (item.quantity || 0), 0);
    return total;
  });
  const totalAmount = computed(() => {
    if (!cart.value || !cart.value.items) {
      return 0;
    }

    return cart.value.items.reduce((sum: number, item: CartItem) => sum + (item.subtotal || 0), 0);
  });
  const cartItems = computed(() => cart.value?.items || []);

  const fetchCart = async () => {
    if (!localStorage.getItem('accessToken')) {
      cart.value = defaultCartValue();
      return;
    }
    try {
      error.value = null;
      const response = await getCart();

      if (response) {
        cart.value = response;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(response));
      } else {
        cart.value = defaultCartValue();
      }
    } catch (err) {
      error.value = 'Failed to fetch cart';
      cart.value = defaultCartValue();
    }
  };

  const addItem = async (productId: number, quantity: number) => {
    if (!localStorage.getItem('accessToken')) {
      error.value = 'authentication_required';
      return false;
    }

    try {
      error.value = null;
      await addToCart(productId, quantity);
      await fetchCart();
      return true;
    } catch (err) {
      error.value = 'Failed to add item to cart';
      throw err;
    }
  };

  const updateItem = async (cartItemId: number, quantity: number) => {
    if (!localStorage.getItem('accessToken')) {
      error.value = 'authentication_required';
      return false;
    }

    try {
      error.value = null;
      await updateCartItem(cartItemId, quantity);

      if (cart.value && cart.value.items) {
        const item = cart.value.items.find(item => item.id === cartItemId);
        if (item) {
          item.quantity = quantity;
          item.subtotal = item.price * quantity;
          cart.value.totalAmount = cart.value.items.reduce((sum, i) => sum + i.subtotal, 0);
          cart.value.totalItems = cart.value.items.reduce((sum, i) => sum + i.quantity, 0);
          cart.value.updatedAt = new Date().toISOString();
        }
      }

      return true;
    } catch (err) {
      error.value = 'Failed to update cart item';
      throw err;
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (!localStorage.getItem('accessToken')) {
      error.value = 'authentication_required';
      return false;
    }

    try {
      error.value = null;

      if (cart.value && cart.value.items) {
        const itemIndex = cart.value.items.findIndex(item => item.id === cartItemId);
        if (itemIndex !== -1) {
          cart.value.items.splice(itemIndex, 1);
          cart.value.totalAmount = cart.value.items.reduce((sum, i) => sum + i.subtotal, 0);
          cart.value.totalItems = cart.value.items.reduce((sum, i) => sum + i.quantity, 0);
          cart.value.updatedAt = new Date().toISOString();
        }
      }

      await removeCartItem(cartItemId);

      return true;
    } catch (err) {
      error.value = 'Failed to remove item from cart';
      await fetchCart();
      throw err;
    }
  };

  const initCart = async () => {
    if (localStorage.getItem('accessToken')) {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        cart.value = JSON.parse(storedCart);
      }

      return await fetchCart();
    } else {
      return false;
    }
  };

  const clearCart = () => {
    cart.value = defaultCartValue();
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const saveCartToLocalStorage = () => {
    if (cart.value) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.value));
    }
  };

  const syncCartWithLocalData = async () => {
    initializeCartFromLocalStorage();

    try {
      const serverCart = await getCart();

      if (serverCart && serverCart.items && serverCart.items.length > 0) {
        if (cart.value && cart.value.items && cart.value.items.length > 0) {
          serverCart.items.forEach((serverItem: any) => {
            const localItem = cart.value?.items.find(item => item.id === serverItem.id);
            if (localItem) {
              serverItem.quantity = localItem.quantity;
              serverItem.subtotal = serverItem.price * localItem.quantity;
            }
          });

          serverCart.totalItems = serverCart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
          serverCart.totalAmount = serverCart.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
        }

        cart.value = serverCart;
        saveCartToLocalStorage();
      }
    } catch (error) {
      console.error('Error when synchronizing cart:', error);
    }
  };

  return {
    cart,
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
    clearCart,
    initializeCartFromLocalStorage,
    saveCartToLocalStorage,
    syncCartWithLocalData
  };
}); 
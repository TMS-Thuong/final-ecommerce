import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/api/cart';
import { getCookie, setCookie, removeCookie } from '@/utils/cookie';

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
      if (!getCookie('accessToken')) {
        const storedCart = getCookie(CART_STORAGE_KEY);
        if (storedCart) {
          cart.value = JSON.parse(storedCart);
        } else {
          cart.value = defaultCartValue();
        }
      } else {
        cart.value = defaultCartValue();
      }
    } catch (err) {
      cart.value = defaultCartValue();
    }
  };

  initializeCartFromLocalStorage();

  watch(() => cart.value, (newCart) => {
    if (newCart && !getCookie('accessToken')) {
      setCookie(CART_STORAGE_KEY, JSON.stringify(newCart));
    }
  }, { deep: true });

  const isEmpty = computed(() => !cart.value || !cart.value.items || cart.value.items.length === 0);
  const totalItems = computed(() => {
    if (!cart.value || !cart.value.items) {
      return 0;
    }
    return cart.value.items.reduce((sum: number, item: CartItem) => sum + (item.quantity || 0), 0);
  });
  const totalAmount = computed(() => {
    if (!cart.value || !cart.value.items) {
      return 0;
    }
    return cart.value.items.reduce((sum: number, item: CartItem) => sum + (item.subtotal || 0), 0);
  });
  const cartItems = computed(() => cart.value?.items || []);

  const fetchCart = async () => {
    if (!getCookie('accessToken')) {
      cart.value = defaultCartValue();
      return;
    }
    try {
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
    }
  };

  const addItem = async (productId: number, quantity: number) => {
    if (!getCookie('accessToken')) {
      error.value = 'authenticationRequired';
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
    if (!getCookie('accessToken')) {
      error.value = 'authenticationRequired';
      return false;
    }

    try {
      error.value = null;
      await updateCartItem(cartItemId, quantity);
      await fetchCart();
      return true;
    } catch (err) {
      error.value = 'Failed to update cart item';
      throw err;
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (!getCookie('accessToken')) {
      error.value = 'authenticationRequired';
      return false;
    }

    try {
      error.value = null;
      await removeCartItem(cartItemId);
      await fetchCart();
      return true;
    } catch (err) {
      error.value = 'Failed to remove item from cart';
      throw err;
    }
  };

  const initCart = async () => {
    if (getCookie('accessToken')) {
      return await fetchCart();
    } else {
      const storedCart = getCookie(CART_STORAGE_KEY);
      if (storedCart) {
        cart.value = JSON.parse(storedCart);
      } else {
        cart.value = defaultCartValue();
      }
      return false;
    }
  };

  const clearCart = () => {
    cart.value = defaultCartValue();
    removeCookie(CART_STORAGE_KEY);
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
    syncCartWithLocalData
  };
}); 
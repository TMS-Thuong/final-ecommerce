import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/api/cart';
import Cookies from 'js-cookie';

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

const CART_COOKIE_KEY = 'ecommerce_cart_data';

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

  const initializeCartFromCookie = () => {
    try {
      const storedCart = Cookies.get(CART_COOKIE_KEY);
      if (storedCart) {
        cart.value = JSON.parse(storedCart);
      } else {
        cart.value = defaultCartValue();
      }
    } catch (err) {
      console.error('Error loading cart from cookie:', err);
      cart.value = defaultCartValue();
    }
  };

  initializeCartFromCookie();

  watch(() => cart.value, (newCart) => {
    if (newCart) {
      Cookies.set(CART_COOKIE_KEY, JSON.stringify(newCart), { expires: 7 });
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
        Cookies.set(CART_COOKIE_KEY, JSON.stringify(response), { expires: 7 });
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
    if (localStorage.getItem('accessToken')) {
      const storedCart = Cookies.get(CART_COOKIE_KEY);
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
    Cookies.remove(CART_COOKIE_KEY);
  };

  const saveCartToLocalStorage = () => {
    if (cart.value) {
      Cookies.set(CART_COOKIE_KEY, JSON.stringify(cart.value), { expires: 7 });
    }
  };

  const syncCartWithLocalData = async () => {
    initializeCartFromCookie();

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
    initializeCartFromCookie,
    saveCartToLocalStorage,
    syncCartWithLocalData
  };
}); 
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

const CART_COOKIE_KEY = 'ecommerce_cart_data';

const isValidCart = (cart: any): cart is Cart => {
  return (
    cart &&
    typeof cart === 'object' &&
    Array.isArray(cart.items) &&
    typeof cart.totalAmount === 'number' &&
    typeof cart.totalItems === 'number'
  );
};

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
      const storedCart = getCookie(CART_COOKIE_KEY);
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          if (isValidCart(parsedCart)) {
            cart.value = parsedCart;
          } else {
            console.warn('Invalid cart data in cookie, resetting to default');
            cart.value = defaultCartValue();
            removeCookie(CART_COOKIE_KEY);
          }
        } catch (parseError) {
          console.error('Error parsing cart data from cookie:', parseError);
          cart.value = defaultCartValue();
          removeCookie(CART_COOKIE_KEY);
        }
      } else {
        cart.value = defaultCartValue();
      }
    } catch (err) {
      console.error('Error loading cart from cookie:', err);
      cart.value = defaultCartValue();
      removeCookie(CART_COOKIE_KEY);
    }
  };

  // Initialize cart when store is created
  initializeCartFromCookie();

  watch(() => cart.value, (newCart) => {
    if (newCart && isValidCart(newCart)) {
      try {
        setCookie(CART_COOKIE_KEY, JSON.stringify(newCart), 7);
      } catch (err) {
        console.error('Error saving cart to cookie:', err);
      }
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
      if (response && isValidCart(response)) {
        cart.value = response;
        try {
          setCookie(CART_COOKIE_KEY, JSON.stringify(response), 7);
        } catch (err) {
          console.error('Error saving cart to cookie:', err);
        }
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
      try {
        const storedCart = getCookie(CART_COOKIE_KEY);
        if (storedCart) {
          try {
            const parsedCart = JSON.parse(storedCart);
            if (isValidCart(parsedCart)) {
              cart.value = parsedCart;
            } else {
              console.warn('Invalid cart data in cookie, resetting to default');
              cart.value = defaultCartValue();
              removeCookie(CART_COOKIE_KEY);
            }
          } catch (parseError) {
            console.error('Error parsing cart data:', parseError);
            cart.value = defaultCartValue();
            removeCookie(CART_COOKIE_KEY);
          }
        } else {
          cart.value = defaultCartValue();
        }
      } catch (err) {
        console.error('Error initializing cart:', err);
        cart.value = defaultCartValue();
        removeCookie(CART_COOKIE_KEY);
      }
      return false;
    }
  };

  const clearCart = () => {
    cart.value = defaultCartValue();
    removeCookie(CART_COOKIE_KEY);
  };

  const saveCartToLocalStorage = () => {
    if (cart.value && isValidCart(cart.value)) {
      try {
        setCookie(CART_COOKIE_KEY, JSON.stringify(cart.value), 7);
      } catch (err) {
        console.error('Error saving cart to cookie:', err);
      }
    }
  };

  const syncCartWithLocalData = async () => {
    initializeCartFromCookie();

    try {
      const serverCart = await getCart();

      if (serverCart && isValidCart(serverCart)) {
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
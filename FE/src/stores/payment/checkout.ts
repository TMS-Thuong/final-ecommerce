import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import addressApi from '@/api/address';
import shippingApi from '@/api/shipping';
import orderApi from '@/api/order';
import paymentApi from '@/api/payment';
import { useCartStore } from '@/stores/cart/cart';

export const useCheckoutStore = defineStore('checkout', () => {
  const addresses = ref<any[]>([]);
  const shippingMethods = ref<any[]>([]);
  const selectedAddressId = ref<number | null>(null);
  const selectedShippingMethodId = ref<number | null>(null);
  const selectedPaymentMethod = ref<'COD' | 'VNPAY'>('COD');
  const paymentMethods = ref<any[]>([]);
  const couponCode = ref<string>('');
  const orderNotes = ref<string>('');
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const currentOrderId = ref<number | null>(null);
  const paymentUrl = ref<string | null>(null);
  const calculatedShippingFee = ref<number>(0);

  const cartStore = useCartStore();

  const defaultAddress = computed(() => {
    return addresses.value.find(address => address.isDefault || address.isDefaultShipping) || null;
  });

  const selectedAddress = computed(() => {
    if (!selectedAddressId.value) return null;
    return addresses.value.find(address => address.id === selectedAddressId.value) || null;
  });

  const selectedShippingMethod = computed(() => {
    if (!selectedShippingMethodId.value) return null;
    return shippingMethods.value.find(method => method.id === selectedShippingMethodId.value) || null;
  });

  const shippingCost = computed(() => {
    return calculatedShippingFee.value;
  });

  const subtotal = computed(() => {
    cartStore.initializeCartFromLocalStorage();

    const selectedCartItemsStr = localStorage.getItem('selectedCartItems');
    if (!selectedCartItemsStr) return cartStore.totalAmount || 0;

    try {
      const selectedCartItemIds = JSON.parse(selectedCartItemsStr);
      if (!Array.isArray(selectedCartItemIds) || selectedCartItemIds.length === 0) {
        return cartStore.totalAmount || 0;
      }

      const total = cartStore.cartItems
        .filter(item => selectedCartItemIds.includes(item.id))
        .reduce((total, item) => total + item.subtotal, 0);

      return total || 0;
    } catch (error) {
      console.error('Error calculating subtotal:', error);
      return cartStore.totalAmount || 0;
    }
  });

  const total = computed(() => {
    return subtotal.value + shippingCost.value;
  });

  const getPaymentMethodId = computed(() => {
    const method = paymentMethods.value.find(m =>
      m.code.toLowerCase() === selectedPaymentMethod.value.toLowerCase()
    );
    return method?.id || 1;
  });

  const fetchAddresses = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await addressApi.getAddresses();
      addresses.value = response.data || [];

      if (defaultAddress.value && !selectedAddressId.value) {
        selectedAddressId.value = defaultAddress.value.id;
      }
    } catch (err) {
      error.value = 'Failed to fetch addresses';
    } finally {
      isLoading.value = false;
    }
  };

  const calculateShippingFee = async () => {
    if (selectedShippingMethodId.value === null) return;

    try {
      const response = await shippingApi.calculateShippingFee(
        selectedShippingMethodId.value,
        subtotal.value
      );

      if (response.success && response.data && response.data.fee !== undefined) {
        calculatedShippingFee.value = response.data.fee;
      } else {
        const selectedMethod = shippingMethods.value.find(m => m.id === selectedShippingMethodId.value);
        calculatedShippingFee.value = selectedMethod?.price || 30000;

        if (subtotal.value > 1000000) {
          calculatedShippingFee.value = calculatedShippingFee.value * 0.5;
        }
      }
    } catch (err) {
      const selectedMethod = shippingMethods.value.find(m => m.id === selectedShippingMethodId.value);
      calculatedShippingFee.value = selectedMethod?.price || 30000;

      if (subtotal.value > 1000000) {
        calculatedShippingFee.value = calculatedShippingFee.value * 0.5;
      }
    }
  };

  const fetchShippingMethods = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await shippingApi.getShippingMethods();
      shippingMethods.value = response.data || [];

      if (shippingMethods.value.length > 0 && !selectedShippingMethodId.value) {
        selectedShippingMethodId.value = shippingMethods.value[0].id;

        await calculateShippingFee();
      }
    } catch (err) {
      error.value = 'Failed to fetch shipping methods';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await paymentApi.getPaymentMethods();
      paymentMethods.value = response.data || [];

      if (paymentMethods.value.length > 0) {
        const codMethod = paymentMethods.value.find(m => m.code.toLowerCase() === 'cod');
        if (codMethod) {
          selectedPaymentMethod.value = 'COD';
        } else {
          selectedPaymentMethod.value = paymentMethods.value[0].code.toUpperCase() as any;
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch payment methods';
    } finally {
      isLoading.value = false;
    }
  };

  const addNewAddress = async (addressData: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await addressApi.addAddress(addressData);
      if (response.data) {
        await fetchAddresses();
        selectedAddressId.value = response.data.id;
      }
      return response.data;
    } catch (err) {
      error.value = 'Failed to add new address';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const placeOrder = async () => {
    if (!selectedAddressId.value || !selectedShippingMethodId.value) {
      error.value = 'Please select address and shipping method';
      return null;
    }

    const selectedCartItemsStr = localStorage.getItem('selectedCartItems');
    if (!selectedCartItemsStr) {
      error.value = 'No items selected for checkout';
      return null;
    }

    try {
      const selectedCartItemIds = JSON.parse(selectedCartItemsStr);
      if (!Array.isArray(selectedCartItemIds) || selectedCartItemIds.length === 0) {
        error.value = 'No items selected for checkout';
        return null;
      }

      isLoading.value = true;
      error.value = null;

      cartStore.initializeCartFromLocalStorage();

      const orderData = {
        addressId: selectedAddressId.value,
        shippingMethodId: selectedShippingMethodId.value,
        paymentMethodId: getPaymentMethodId.value,
        customerNotes: orderNotes.value || undefined,
        couponCode: couponCode.value || undefined,
        cartItemIds: selectedCartItemIds
      };

      const response = await orderApi.createOrder(orderData);

      if (response.success && response.data) {
        const orderResult = response.data.order;
        currentOrderId.value = orderResult.id;

        if (selectedPaymentMethod.value === 'VNPAY' && response.data.paymentUrl) {
          paymentUrl.value = response.data.paymentUrl;
        }

        try {
          for (const itemId of selectedCartItemIds) {
            try {
              await cartStore.removeItem(itemId);
            } catch (removeError) {
              console.error(`Failed to remove cart item ${itemId}:`, removeError);
            }
          }

          await cartStore.fetchCart();
        } catch (cartError) {
          console.error('Error updating cart after order:', cartError);
        }

        localStorage.removeItem('selectedCartItems');

        return orderResult;
      }

      return null;
    } catch (err) {
      error.value = 'Failed to place order';
      console.error('Order placement error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const checkPaymentStatus = async (orderId: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await paymentApi.checkPaymentStatus(orderId);
      return response.data;
    } catch (err) {
      error.value = 'Failed to check payment status';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const reset = () => {
    selectedAddressId.value = null;
    selectedShippingMethodId.value = null;
    selectedPaymentMethod.value = 'COD';
    couponCode.value = '';
    orderNotes.value = '';
    currentOrderId.value = null;
    paymentUrl.value = null;
    error.value = null;
  };

  watch([selectedShippingMethodId, subtotal], () => {
    calculateShippingFee();
  });

  return {
    addresses,
    shippingMethods,
    paymentMethods,
    selectedAddressId,
    selectedShippingMethodId,
    selectedPaymentMethod,
    couponCode,
    orderNotes,
    isLoading,
    error,
    currentOrderId,
    paymentUrl,
    calculatedShippingFee,
    defaultAddress,
    selectedAddress,
    selectedShippingMethod,
    getPaymentMethodId,
    shippingCost,
    subtotal,
    total,
    fetchAddresses,
    fetchShippingMethods,
    fetchPaymentMethods,
    calculateShippingFee,
    addNewAddress,
    placeOrder,
    checkPaymentStatus,
    reset
  };
});

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ $t('checkout.title') }}</h1>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <AddressSelector
          :addresses="checkoutStore.addresses"
          :selected-address-id="checkoutStore.selectedAddressId"
          :is-loading="addressLoading"
          @update:selected-address-id="checkoutStore.selectedAddressId = $event"
          @add-address="toggleAddressModal(true)"
          @show-all-addresses="toggleAddressListModal(true)"
        />

        <div class="bg-white overflow-hidden border border-gray-200 rounded-md mb-6">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-xl font-medium text-gray-900">{{ $t('checkout.paymentMethod') }}</h2>
          </div>

          <div class="px-6 py-4">
            <div v-if="isLoading || paymentLoading" class="py-4">
              <p class="text-gray-500">{{ $t('checkout.loadingPaymentMethods') }}</p>
            </div>
            <div v-else-if="!checkoutStore.paymentMethods.length" class="py-4">
              <p class="text-gray-500">{{ $t('checkout.noPaymentMethods') }}</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="method in checkoutStore.paymentMethods"
                :key="method.id"
                class="border border-gray-200 rounded-md p-4 transition-colors"
                :class="{ 'border-neutral-800 bg-gray-50': checkoutStore.selectedPaymentMethod === method.code.toUpperCase() }"
              >
                <div class="flex items-start">
                  <input
                    type="radio"
                    :id="'payment-' + method.code"
                    name="paymentMethod"
                    :value="method.code.toUpperCase()"
                    v-model="checkoutStore.selectedPaymentMethod"
                    class="h-4 w-4 text-neutral-800 focus:ring-neutral-800 border-gray-300 mt-1"
                  />
                  <div class="ml-3">
                    <label :for="'payment-' + method.code" class="block text-xl font-medium text-gray-700">
                      {{ method.name }}
                    </label>
                    <p class="text-gray-500 text-xl mt-1">{{ method.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden border border-gray-200 rounded-md mb-6">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-xl font-medium text-gray-900">{{ $t('checkout.orderNotes') }}</h2>
          </div>

          <div class="px-6 py-4">
            <label for="notes" class="block text-xl font-medium text-gray-700">{{ $t('checkout.noteOptional') }}</label>
            <textarea
              id="notes"
              v-model="checkoutStore.orderNotes"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-neutral-800 focus:border-neutral-800"
              :placeholder="$t('checkout.notesPlaceholder')"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white overflow-hidden border border-gray-200 rounded-md shadow-sm divide-y divide-gray-200 sticky top-24">
          <div class="px-6 py-4">
            <h2 class="text-xl font-medium text-gray-900">{{ $t('checkout.orderSummary') }}</h2>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div class="flex justify-between">
              <span class="text-xl text-gray-500">{{ $t('checkout.subtotal') }}</span>
              <span class="text-xl font-medium text-gray-900">{{ formatPrice(checkoutStore.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xl text-gray-500">{{ $t('checkout.shippingFee') }}</span>
              <span class="text-xl font-medium text-gray-900">{{ formatPrice(checkoutStore.shippingCost) }}</span>
            </div>
          </div>
          <div class="px-6 py-4">
            <div class="flex justify-between">
              <span class="text-xl font-medium text-gray-900">{{ $t('checkout.total') }}</span>
              <span class="text-xl font-medium text-gray-900">{{ formatPrice(checkoutStore.total) }}</span>
            </div>
          </div>
          <div class="px-6 py-4">
            <div class="mb-4">
              <label for="coupon" class="block text-xl font-medium text-gray-700 mb-1">{{ $t('checkout.couponCode') }}</label>
              <div class="flex">
                <input
                  type="text"
                  id="coupon"
                  class="flex-1 min-w-0 border border-gray-300 focus:ring-neutral-800 focus:border-neutral-800 rounded-l-md sm:text-xl px-3 py-2"
                  :placeholder="$t('checkout.enterCouponCode')"
                  v-model="checkoutStore.couponCode"
                >
                <button
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-xl font-medium text-white bg-neutral-800 hover:bg-neutral-700"
                  @click="applyCoupon"
                >
                  {{ $t('checkout.apply') }}
                </button>
              </div>
            </div>

            <button
              class="w-full px-6 py-3 bg-neutral-800 text-xl text-white rounded-md hover:bg-neutral-700 transition flex items-center justify-center"
              @click="placeOrder"
              :disabled="isPlacingOrder"
            >
              <span v-if="isPlacingOrder" class="mr-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ $t('checkout.placeOrder') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <AddressModal
      :is-open="showAddressModal"
      @close="toggleAddressModal(false)"
      @saved="handleAddressSaved"
    />

    <AddressListModal
      :is-open="showAddressListModal"
      :addresses="checkoutStore.addresses"
      v-model="checkoutStore.selectedAddressId"
      @close="toggleAddressListModal(false)"
      @edit-address="handleEditAddress"
    />

    <AddressModal
      :is-open="showEditAddressModal"
      :address-to-edit="addressToEdit"
      @close="toggleEditAddressModal(false)"
      @saved="handleAddressSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import { useCheckoutStore } from '@/stores/checkout';
import { useCartStore } from '@/stores/cart';
import AddressModal from '@/components/molecules/utils/AddressModal.vue';
import AddressSelector from '@/components/molecules/checkout/AddressSelector.vue';
import AddressListModal from '@/components/molecules/checkout/AddressListModal.vue';

const { t } = useI18n();
const router = useRouter();
const { showToast } = useToast();
const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();

const isLoading = computed(() => checkoutStore.isLoading);
const addressLoading = ref(false);
const shippingLoading = ref(false);
const paymentLoading = ref(false);
const isPlacingOrder = ref(false);
const showAddressModal = ref(false);
const showAddressListModal = ref(false);
const showEditAddressModal = ref(false);
const addressToEdit = ref(null);

const toggleAddressModal = (show) => {
  showAddressModal.value = show;
};

const toggleAddressListModal = (show) => {
  showAddressListModal.value = show;
};

const toggleEditAddressModal = (show) => {
  showEditAddressModal.value = show;
};

const handleEditAddress = async (addressId) => {
  addressToEdit.value = checkoutStore.addresses.find(addr => addr.id === addressId) || null;
  toggleEditAddressModal(true);
  toggleAddressListModal(false);
};

const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0);
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const handleAddressSaved = async (newAddress) => {
  if (newAddress) {
    showToast(ToastEnum.Success, t('address.addSuccess'));
    await checkoutStore.fetchAddresses();
  }
};

const applyCoupon = () => {
  if (!checkoutStore.couponCode) {
    showToast(ToastEnum.Warning, t('checkout.enterCouponCodeFirst'));
    return;
  }
  showToast(ToastEnum.Info, t('checkout.couponNotImplemented'));
};

const placeOrder = async () => {
  if (!checkoutStore.selectedAddressId) {
    showToast(ToastEnum.Warning, t('checkout.selectAddress'));
    return;
  }

  try {
    isPlacingOrder.value = true;
    const order = await checkoutStore.placeOrder();

    if (!order) {
      showToast(ToastEnum.Error, t('checkout.orderFailed'));
      return;
    }

    if (checkoutStore.paymentUrl) {
      window.location.href = checkoutStore.paymentUrl;
    } else {
      router.push(`/order-complete/${order.id}`);
    }
  } catch (error) {
    console.error('Error placing order:', error);
    showToast(ToastEnum.Error, t('checkout.orderFailed'));
  } finally {
    isPlacingOrder.value = false;
  }
};

onMounted(async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    router.push({ name: 'Login', query: { redirect: '/checkout' } });
    return;
  }

  const selectedCartItems = localStorage.getItem('selectedCartItems');
  if (!selectedCartItems || JSON.parse(selectedCartItems).length === 0) {
    showToast(ToastEnum.Warning, t('cart.selectItemsToCheckout'));
    router.push('/cart');
    return;
  }

  try {
    cartStore.initializeCartFromLocalStorage();

    if (cartStore.isEmpty) {
      await cartStore.fetchCart();

      if (cartStore.isEmpty) {
        showToast(ToastEnum.Warning, t('cart.emptyCart'));
        router.push('/cart');
        return;
      }
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    showToast(ToastEnum.Error, t('error'));
    return;
  }

  try {
    addressLoading.value = true;
    await checkoutStore.fetchAddresses();

    if (checkoutStore.selectedAddressId === null && checkoutStore.addresses.length > 0) {
      const defaultAddress = checkoutStore.addresses.find(addr => addr.isDefaultShipping || addr.isDefault);
      checkoutStore.selectedAddressId = defaultAddress ? defaultAddress.id : checkoutStore.addresses[0].id;
    }
  } catch (error) {
    console.error('Error fetching addresses:', error);
    showToast(ToastEnum.Error, t('error'));
  } finally {
    addressLoading.value = false;
  }

  try {
    shippingLoading.value = true;
    await checkoutStore.fetchShippingMethods();
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    showToast(ToastEnum.Error, t('error'));
  } finally {
    shippingLoading.value = false;
  }

  try {
    paymentLoading.value = true;
    await checkoutStore.fetchPaymentMethods();
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    showToast(ToastEnum.Error, t('error'));
  } finally {
    paymentLoading.value = false;
  }
});
</script>



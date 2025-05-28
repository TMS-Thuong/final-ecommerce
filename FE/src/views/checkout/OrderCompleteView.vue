<template>
  <div class="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8 py-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-neutral-800 mb-2">{{ $t('checkout.orderSuccess') }}</h1>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-3xl font-bold text-black mb-4">{{ $t('checkout.orderDetails') }}</h2>

        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="error" class="py-8 text-center">
          <p class="text-red-500 text-xl">{{ error }}</p>
          <router-link to="/"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-neutral-600 hover:bg-neutral-700">
            {{ $t('common.home') }}
          </router-link>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-2xl font-semibold text-black mb-3">{{ $t('checkout.recipientInfo') }}</h3>
              <div class="space-y-2 text-xl">
                <div class="grid grid-cols-3">
                  <div class="text-black">{{ $t('checkout.recipientName') }}:</div>
                  <div class="col-span-2 text-gray-600">{{ address ? address.recipientName : 'N/A' }}</div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="text-black">{{ $t('checkout.phoneNumber') }}:</div>
                  <div class="col-span-2 text-gray-600">{{ address ? address.phoneNumber : 'N/A' }}</div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="text-black">{{ $t('checkout.address') }}:</div>
                  <div class="col-span-2 text-gray-600">
                    {{ formatAddress(address) }}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-2xl font-semibold text-black mb-3">{{ $t('checkout.orderInfo') }}</h3>
              <div class="space-y-2 text-xl">
                <div class="grid grid-cols-3 text-xl">
                  <div class="text-black">{{ $t('checkout.orderId') }}:</div>
                  <div class="col-span-2 text-gray-600">{{ order.orderCode || order.id }}</div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="text-black">{{ $t('checkout.orderDate') }}:</div>
                  <div class="col-span-2 text-gray-600">{{ formatDate(order.createdAt) }}</div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="text-black">{{ $t('checkout.orderStatus') }}:</div>
                  <div class="col-span-2">
                    <span class="px-2 py-1 rounded-full" :class="{
                      'text-yellow-500': order.status === 'Pending',
                      'text-blue-500': order.status === 'Processing',
                      'text-green-500': order.status === 'Delivered' || order.status === 'Completed',
                      'text-red-500': order.status === 'Cancelled' || order.status === 'Failed',
                      'text-indigo-500': order.status === 'Shipping'
                    }">
                      {{ $t(`orderStatus.${order.status.toLowerCase()}`) }}
                    </span>
                  </div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="text-black">{{ $t('checkout.paymentStatus') }}:</div>
                  <div class="col-span-2">
                    <span class="px-2 py-1 text-gray-600 rounded-full" :class="{
                      'text-orange-500': order.paymentStatus === 'Pending',
                      'text-green-500': order.paymentStatus === 'Paid',
                      'text-red-500': order.paymentStatus === 'Failed' || order.paymentStatus === 'Cancelled',
                      'text-blue-500': order.paymentStatus === 'Refunded'
                    }">
                      {{ $t(`paymentStatus.${order.paymentStatus.toLowerCase()}`) }}
                    </span>
                  </div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="text-black">{{ $t('checkout.totalAmount') }}:</div>
                  <div class="col-span-2 text-gray-600 text-red-600">{{ formatPrice(order.totalAmount) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6" v-if="!isLoading && !error">
        <h3 class="text-xl font-semibold text-gray-800 mb-3">{{ $t('checkout.products') }}</h3>
        <!-- Table cho desktop/tablet -->
        <div class="border border-gray-200 rounded overflow-hidden hidden md:block">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 text-xl text-gray-600">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left  font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('checkout.product') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('checkout.unitPrice') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('checkout.quantity') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
                    {{ $t('checkout.amount') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in order.items" :key="item.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded overflow-hidden">
                        <img v-if="productImages[item.productId]" :src="productImages[item.productId]"
                          :alt="item.productName" class="h-full w-full object-cover" />
                        <div v-else class="h-full w-full flex items-center justify-center text-gray-500">
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                            </path>
                          </svg>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-xl font-medium text-gray-900 break-words whitespace-normal">
                          {{ item.productName }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-xl text-gray-800">
                    {{ formatPrice(item.price) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-xl text-gray-800">
                    {{ item.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-xl font-medium">
                    {{ formatPrice(item.subtotal) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td colspan="3" class="px-6 py-3 text-right text-xl font-medium text-gray-800">
                    {{ $t('checkout.subtotal') }}:
                  </td>
                  <td class="px-6 py-3 text-right text-xl font-medium text-gray-900">
                    {{ formatPrice(order.subtotal) }}
                  </td>
                </tr>
                <tr>
                  <td colspan="3" class="px-6 py-3 text-right text-xl font-medium text-gray-800">
                    {{ $t('checkout.shippingFee') }}:
                  </td>
                  <td class="px-6 py-3 text-right text-xl font-medium text-gray-900">
                    {{ formatPrice(order.shippingFee) }}
                  </td>
                </tr>
                <tr>
                  <td colspan="3" class="px-6 py-3 text-right text-xl font-medium text-gray-900">
                    {{ $t('checkout.total') }}:
                  </td>
                  <td class="px-6 py-3 text-right text-xl font-bold text-red-600">
                    {{ formatPrice(order.totalAmount) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="flex flex-col gap-3 md:flex-row sm:justify-between items-center sm:items-stretch gap-3 mt-8">
          <router-link to="/account/orders"
            class="w-full max-w-[180px] sm:w-auto sm:max-w-none inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mb-2 sm:mb-0">
            {{ $t('checkout.viewOrders') }}
          </router-link>

          <div class="flex flex-col gap-2 w-full sm:flex-row sm:w-auto sm:gap-4 sm:items-stretch items-center">
            <button v-if="canCancel" @click="showConfirmCancelOrder = true"
              class="w-full max-w-[180px] sm:w-auto sm:max-w-none inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-lg font-medium text-red-700 bg-white hover:bg-red-50"
              :disabled="isCancelling">
              <span v-if="isCancelling">{{ $t('common.loading') }}</span>
              <span v-else>{{ $t('orders.cancelOrder') }}</span>
            </button>
            <router-link to="/products"
              class="w-full max-w-[180px] sm:w-auto sm:max-w-none inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-neutral-800 hover:bg-neutral-900">
              {{ $t('cart.continueShopping') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      :visible="showConfirmCancelOrder"
      :title="t('orders.cancelOrder')"
      :message="t('orders.cancelOrderConfirm')"
      :confirm-text="t('common.ok')"
      :cancel-text="t('common.cancel')"
      @confirm="handleCancelOrder"
      @cancel="showConfirmCancelOrder = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import orderApi from '@/api/order';
import addressApi from '@/api/address';
import { productApi } from '@/api/product';
import axios from 'axios';
import.meta.env ? import.meta.env.VITE_API_BASE_URL : process.env.VUE_APP_API_BASE_URL;
import ConfirmModal from '@/components/molecules/utils/ConfirmModal.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const orderId = ref(null);
const order = ref(null);
const address = ref(null);
const productImages = ref({});
const isLoading = ref(true);
const error = ref(null);
const isCancelling = ref(false);
const showConfirmCancelOrder = ref(false);

const canCancel = computed(() => {
  if (!order.value) return false;
  return order.value.status === 'Pending' || order.value.status === 'Processing';
});

const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0);
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const formatAddress = (addressData) => {
  if (!addressData) return 'N/A';
  const parts = [];
  if (addressData.streetAddress) parts.push(addressData.streetAddress);
  if (addressData.ward) parts.push(addressData.ward);
  if (addressData.district) parts.push(addressData.district);
  if (addressData.province) parts.push(addressData.province);

  return parts.length > 0 ? parts.join(', ') : 'N/A';
};

const handleCancelOrder = async () => {
  showConfirmCancelOrder.value = false;
  try {
    isCancelling.value = true;
    const response = await orderApi.cancelOrder(order.value.id);
    if (response.success) {
      showToast(ToastEnum.Success, t('orders.cancelSuccess'));
      order.value.status = 'Cancelled';
    } else {
      showToast(ToastEnum.Error, t('orders.cancelFailed'));
    }
  } catch (err) {
    showToast(ToastEnum.Error, t('orders.cancelFailed'));
  } finally {
    isCancelling.value = false;
  }
};

const fetchAddressDetails = async (addressId) => {
  try {
    const response = await addressApi.getAddressById(addressId);
    if (response.success && response.data) {
      address.value = response.data;
    }
  } catch (err) {
    console.error('Error fetching address details:', err);
  }
};

const fetchProductImages = async () => {
  if (!order.value || !order.value.items || order.value.items.length === 0) return;

  try {
    for (const item of order.value.items) {
      if (item.productId) {
        try {
          const baseURL = import.meta.env ? import.meta.env.VITE_API_BASE_URL : process.env.VUE_APP_API_BASE_URL;
          const response = await axios.get(`${baseURL}/api/products/${item.productId}/images`);

          if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            productImages.value[item.productId] = response.data.data[0].imageUrl;
          }
        } catch (error) {
          console.error(`Error fetching image for product ${item.productId}:`, error);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching product images:', err);
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    orderId.value = route.params.orderId;
    const status = route.query.status;

    if (!orderId.value) {
      router.push('/');
      return;
    }

    const response = await orderApi.getOrderDetail(Number(orderId.value));

    if (response.success && response.data) {
      order.value = response.data;

      if (status === 'cancelled') {
        showToast(ToastEnum.Warning, t('checkout.paymentCancelled'));
      } else if (status === 'failed') {
        showToast(ToastEnum.Error, t('checkout.paymentFailed'));
      }

      if (order.value.addressId) {
        await fetchAddressDetails(order.value.addressId);
      }

      await fetchProductImages();
    } else {
      error.value = t('checkout.orderNotFound');
    }
  } catch (err) {
    console.error('Error loading order:', err);
    error.value = t('error');
  } finally {
    isLoading.value = false;
  }
});
</script>

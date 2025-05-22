<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="isLoading" class="p-10 text-center">
        <div class="flex justify-center mb-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800"></div>
        </div>
        <p class="text-lg text-gray-600">{{ $t('checkout.processingPayment') }}</p>
      </div>

      <div v-else class="text-center p-10">
        <div v-if="isSuccess" class="p-6 sm:p-8 bg-green-50 text-green-800 mb-6">
          <div class="flex justify-center mb-4">
            <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-green-700">{{ $t('checkout.paymentSuccess') }}</h1>
          <p class="mt-2 text-lg">{{ $t('checkout.paymentCompleted') }}</p>
        </div>

        <div v-else-if="isPending" class="p-6 sm:p-8 bg-yellow-50 text-yellow-800 mb-6">
          <div class="flex justify-center mb-4">
            <svg class="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-yellow-700">{{ $t('checkout.paymentPending') }}</h1>
          <p class="mt-2 text-lg">{{ $t('checkout.paymentProcessing') }}</p>
        </div>

        <div v-else class="p-6 sm:p-8 bg-red-50 text-red-800 mb-6">
          <div class="flex justify-center mb-4">
            <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-red-700">{{ $t('checkout.paymentFailed') }}</h1>
          <p class="mt-2 text-lg">{{ errorMessage }}</p>
        </div>

        <div class="mt-8">
          <div v-if="orderId" class="mb-6">
            <p class="text-gray-700 mb-2">{{ $t('checkout.orderNumber') }}: <span class="font-medium">{{ orderId }}</span></p>
          </div>

          <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <router-link
              to="/"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {{ $t('common.home') }}
            </router-link>

            <router-link
              v-if="orderId"
              :to="`/order-complete/${orderId}`"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-neutral-800 hover:bg-neutral-700"
            >
              {{ $t('checkout.viewOrderDetails') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import paymentApi from '@/api/payment';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const isLoading = ref(true);
const paymentStatus = ref(null);
const orderId = ref(null);
const errorMessage = ref(t('checkout.paymentProcessError'));

const isSuccess = computed(() => paymentStatus.value === 'SUCCESS');
const isPending = computed(() => paymentStatus.value === 'PENDING');

onMounted(async () => {
  const queryParams = { ...route.query };

  if (!queryParams.vnp_ResponseCode) {
    isLoading.value = false;
    paymentStatus.value = 'FAILED';
    errorMessage.value = t('checkout.invalidPaymentResponse');
    return;
  }

  try {
    if (queryParams.vnp_TxnRef) {
      const txnRefParts = queryParams.vnp_TxnRef.split('-');
      if (txnRefParts && txnRefParts.length > 0) {
        orderId.value = parseInt(txnRefParts[0], 10);
      }
    }
    
    if (!orderId.value && queryParams.vnp_OrderInfo) {
      const orderIdMatch = queryParams.vnp_OrderInfo.match(/#ORD(\d+)/);
      if (orderIdMatch && orderIdMatch[1]) {
        orderId.value = orderIdMatch[1];
      }
    }
  } catch (err) {
    console.error('Error extracting order ID:', err);
  }

  try {
    const response = await paymentApi.processVnpayReturn(queryParams);

    if (response.data) {
      const { success, order } = response.data;

      if (order && order.id && !orderId.value) {
        orderId.value = order.id;
      }

      if (success) {
        paymentStatus.value = 'SUCCESS';
        showToast(ToastEnum.Success, t('checkout.paymentSuccess'));
      } else if (queryParams.vnp_ResponseCode === '24') {
        paymentStatus.value = 'FAILED';
        errorMessage.value = t('checkout.paymentCancelled');
        showToast(ToastEnum.Warning, t('checkout.paymentCancelled'));
      } else {
        paymentStatus.value = 'FAILED';
        errorMessage.value = t('checkout.paymentFailedWithCode', { code: queryParams.vnp_ResponseCode });
        showToast(ToastEnum.Error, t('checkout.paymentFailed'));
      }
    } else {
      paymentStatus.value = 'FAILED';
      errorMessage.value = t('checkout.noResponseData');
    }
  } catch (err) {
    console.error('Error processing payment callback:', err);
    paymentStatus.value = 'FAILED';
    errorMessage.value = t('checkout.paymentProcessError');
    showToast(ToastEnum.Error, t('checkout.paymentError'));
  } finally {
    isLoading.value = false;

    if (isSuccess.value && orderId.value) {
      setTimeout(() => {
        router.push(`/order-complete/${orderId.value}`);
      }, 3000);
    }
  }
});
</script>


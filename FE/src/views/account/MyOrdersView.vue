<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8  bg-gray-50">
    <h1 class="text-4xl font-bold text-gray-900 mb-6">{{ $t('account.myOrders') }}</h1>

    <div v-if="isLoading" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      <p class="text-gray-500 mt-4">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="error" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
      <p class="text-red-500 text-lg">{{ error }}</p>
      <button
        @click="fetchOrders"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        {{ $t('common.retry') }}
      </button>
    </div>

    <div v-else-if="orders.length === 0" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
      <div class="flex justify-center mb-4">
        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ $t('orders.noOrders') }}</h3>
      <p class="text-gray-500 mb-4">{{ $t('orders.startShopping') }}</p>
      <router-link to="/products" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
        {{ $t('cart.shopNow') }}
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 text-xl font-bold">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  {{ $t('orders.orderCode') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  {{ $t('orders.orderDate') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                  {{ $t('orders.status') }}
                </th>
                <th scope="col" class="px-6 py-3 text-right text-gray-500 uppercase tracking-wider">
                  {{ $t('orders.total') }}
                </th>
                <th scope="col" class="px-6 py-3 text-right text-gray-500 uppercase tracking-wider">
                  {{ $t('orders.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-lg">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-lg font-medium text-gray-900">{{ order.orderCode || order.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-lg text-gray-500">{{ formatDate(order.createdAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-lg font-medium rounded-full"
                    :class="{
                      'text-yellow-500': order.status === 'Pending',
                      'text-blue-500': order.status === 'Processing',
                      'text-green-500': order.status === 'Completed',
                      'text-red-500': order.status === 'Cancelled'
                    }">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="text-lg font-medium text-gray-900">{{ formatPrice(order.totalAmount) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                  <router-link :to="`/order-complete/${order.id}`" class="text-blue-600 hover:text-blue-900">
                    {{ $t('orders.viewDetails') }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import orderApi from '@/api/order';

const { t } = useI18n();
const router = useRouter();
const { showToast } = useToast();

const orders = ref([]);
const isLoading = ref(true);
const error = ref(null);

const currentPage = ref(1);
const pageSize = ref(10);
const totalOrders = ref(0);
const totalPages = computed(() => Math.ceil(totalOrders.value / pageSize.value));

const paginationItems = computed(() => {
  const items = [];
  const maxVisiblePages = 5;

  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      items.push(i);
    }
  } else {
    items.push(1);

    if (currentPage.value > 3) {
      items.push('...');
    }

    const start = Math.max(2, currentPage.value - 1);
    const end = Math.min(totalPages.value - 1, currentPage.value + 1);

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (currentPage.value < totalPages.value - 2) {
      items.push('...');
    }

    items.push(totalPages.value);
  }

  return items;
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

const fetchOrders = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await orderApi.getUserOrders();

    if (response.success && response.data) {
      orders.value = response.data;
      totalOrders.value = response.data.length;
    } else {
      error.value = t('orders.failedToLoad');
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
    error.value = t('error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('cart.yourCart') }}</h1>

    <div v-if="cartStore.isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800"></div>
    </div>

    <div v-else-if="cartStore.isEmpty" class="py-8 text-center">
      <div class="flex justify-center mb-4">
        <img src="@/assets/empty-cart.svg" alt="Empty Cart" class="w-24 h-24 text-gray-300" />
      </div>
      <h2 class="text-2xl font-medium text-gray-900 mb-2">{{ $t('cart.emptyCart') }}</h2>
      <p class="text-gray-600 mb-6">{{ $t('cart.noProducts') }}</p>
      <router-link to="/products" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-neutral-800 hover:bg-neutral-700">
        {{ $t('cart.continueShopping') }}
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white overflow-hidden border border-gray-200 rounded-md">
          <div class="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center">
              <div class="mr-3">
                <input
                  type="checkbox"
                  id="select-all"
                  class="h-5 w-5 text-neutral-800 focus:ring-neutral-800 border-gray-300 rounded cursor-pointer"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                />
              </div>
              <h2 class="text-xl font-medium text-gray-900">{{ $t('cart.products') }} ({{ cartStore.totalItems }})</h2>
            </div>
            <button @click="confirmRemoveAll" class="text-red-600 hover:text-red-800 text-xl font-medium">{{ $t('cart.removeAll') }}</button>
          </div>
          <ul class="divide-y divide-gray-200">
            <li v-for="item in cartStore.cartItems" :key="item.id" class="px-6 py-4">
              <div class="flex items-center">
                <div class="mr-4">
                  <input
                    type="checkbox"
                    :id="`item-${item.id}`"
                    class="h-5 w-5 text-neutral-800 focus:ring-neutral-800 border-gray-300 rounded cursor-pointer"
                    v-model="selectedItems[item.id]"
                    @change="updateSelectedState"
                  />
                </div>
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  <img v-if="item.product.image" :src="item.product.image" :alt="item.product.name" class="w-full h-full object-center object-cover">
                  <div v-else class="flex items-center justify-center w-full h-full text-gray-400">
                    <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <div class="flex justify-between">
                    <div>
                      <h3 class="text-xl font-medium text-gray-900">{{ item.product.name }}</h3>
                      <p class="mt-1 text-xl text-gray-500">
                        <span v-if="item.product.salePrice" class="line-through">{{ formatPrice(item.product.basePrice) }}</span>
                        <span class="font-medium ml-1">{{ formatPrice(item.price) }}</span>
                      </p>
                    </div>
                    <button @click="removeItem(item.id)" class="text-gray-400 hover:text-gray-500">
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-4 sm:flex sm:items-center sm:justify-between">
                    <div class="flex items-center border border-gray-300 rounded w-28">
                      <button
                        @click="updateItemQuantity(item.id, item.quantity - 1)"
                        class="w-8 px-0 py-1 text-gray-500 hover:text-gray-700 border-r border-gray-300"
                        :disabled="item.quantity <= 1"
                        :class="{'opacity-50 cursor-not-allowed': item.quantity <= 1}"
                      >
                        <span class="text-xl font-medium">-</span>
                      </button>

                      <input
                        type="number"
                        v-model.number="item.quantity"
                        min="1"
                        :max="item.product.stockQuantity"
                        class="w-10 text-center border-none py-1 text-gray-700 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        @blur="handleQuantityInput(item.id, item.quantity)"
                        @keyup.enter="handleQuantityInput(item.id, item.quantity)"
                      />

                      <button
                        @click="updateItemQuantity(item.id, item.quantity + 1)"
                        class="w-8 px-0 py-1 text-gray-500 hover:text-gray-700 border-l border-gray-300"
                        :disabled="item.quantity >= item.product.stockQuantity"
                        :class="{'opacity-50 cursor-not-allowed': item.quantity >= item.product.stockQuantity}"
                      >
                        <span class="text-xl font-medium">+</span>
                      </button>
                    </div>
                    <span class="mt-2 sm:mt-0 text-xl font-medium text-gray-900">{{ formatPrice(item.subtotal) }}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="mt-6">
          <router-link to="/products" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-xl font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <svg class="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            {{ $t('cart.continueShopping') }}
          </router-link>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white overflow-hidden border border-gray-200 rounded-md shadow-sm divide-y divide-gray-200">
          <div class="px-6 py-4">
            <h2 class="text-xl font-medium text-gray-900">{{ $t('cart.orderSummary') }}</h2>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div class="flex justify-between">
              <span class="text-xl text-gray-500">{{ $t('cart.subtotal') }}</span>
              <span class="text-xl font-medium text-gray-900">{{ formatPrice(selectedTotalAmount) }}</span>
            </div>
          </div>
          <div class="px-6 py-4">
            <div class="flex justify-between">
              <span class="text-xl font-medium text-gray-900">{{ $t('cart.total') }}</span>
              <span class="text-xl font-medium text-gray-900">{{ formatPrice(selectedTotalAmount) }}</span>
            </div>
          </div>
          <div class="px-6 py-4">
            <div class="mb-4">
              <label for="coupon" class="block text-xl font-medium text-gray-700 mb-1">{{ $t('cart.couponCode') }}</label>
              <div class="flex">
                <input
                  type="text"
                  id="coupon"
                  class="flex-1 min-w-0 border border-gray-300 focus:ring-neutral-800 focus:border-neutral-800 rounded-l-md sm:text-xl px-3 py-2"
                  :placeholder="$t('cart.enterCouponCode')"
                  v-model="couponCode"
                >
                <button
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-xl font-medium text-white bg-neutral-800 hover:bg-neutral-700"
                  @click="applyCoupon"
                >
                  {{ $t('cart.apply') }}
                </button>
              </div>
            </div>

            <button
              class="w-full px-6 py-3 bg-neutral-800 text-xl text-white rounded-md hover:bg-neutral-700 transition flex items-center justify-center"
              @click="checkout"
              :disabled="selectedItemCount === 0"
              :class="{'opacity-50 cursor-not-allowed': selectedItemCount === 0}"
            >
              {{ $t('cart.checkout') }} ({{ selectedItemCount }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import { useI18n } from 'vue-i18n';

const cartStore = useCartStore();
const router = useRouter();
const { t } = useI18n();
const { showToast } = useToast();
const couponCode = ref('');
const selectedItems = reactive({});

let updateCartTimer = null;

const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0);
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const isAllSelected = computed(() => {
  if (!cartStore.cartItems || cartStore.cartItems.length === 0) return false;
  return cartStore.cartItems.every(item => selectedItems[item.id] === true);
});

const selectedItemCount = computed(() => {
  return Object.values(selectedItems).filter(Boolean).length;
});

const selectedTotalAmount = computed(() => {
  if (!cartStore.cartItems || cartStore.cartItems.length === 0) return 0;

  return cartStore.cartItems.reduce((total, item) => {
    return total + (selectedItems[item.id] ? item.subtotal : 0);
  }, 0);
});

const toggleSelectAll = (event) => {
  const isChecked = event.target.checked;
  cartStore.cartItems.forEach(item => {
    selectedItems[item.id] = isChecked;
  });
};

onMounted(async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    router.push({ name: 'Login', query: { redirect: '/cart' } });
    return;
  }

  try {
    await cartStore.fetchCart();
    cartStore.cartItems.forEach(item => {
      selectedItems[item.id] = true;
    });
  } catch (error) {
    showToast(ToastEnum.Error, t('cart.loadError'));
  }
});

watch(() => cartStore.cartItems, (newItems) => {
  if (newItems && newItems.length > 0) {
    newItems.forEach(item => {
      if (selectedItems[item.id] === undefined) {
        selectedItems[item.id] = true;
      }
    });
  }
}, { deep: true });

const updateItemQuantity = async (itemId, newQuantity) => {
  const item = cartStore.cartItems.find(item => item.id === itemId);
  if (!item) return;

  if (newQuantity < 1) {
    showToast(ToastEnum.Warning, t('cart.quantityMinError'));
    return;
  }
  if (newQuantity > item.product.stockQuantity) {
    showToast(ToastEnum.Warning, t('cart.quantityMaxError', { max: item.product.stockQuantity }));
    return;
  }

  const oldQuantity = item.quantity;
  const oldSubtotal = item.subtotal;

  item.quantity = newQuantity;
  item.subtotal = item.price * newQuantity;

  if (cartStore.cart.value) {
    cartStore.cart.value.totalItems += (newQuantity - oldQuantity);
    cartStore.cart.value.totalAmount += (item.subtotal - oldSubtotal);
    cartStore.cart.value.updatedAt = new Date().toISOString();
  }

  cartStore.saveCartToLocalStorage();

  showToast(ToastEnum.Success, t('cart.updateSuccess'));

  if (updateCartTimer) {
    clearTimeout(updateCartTimer);
  }

  updateCartTimer = setTimeout(async () => {
    try {
      await cartStore.updateItem(itemId, newQuantity);
      console.log('Đã cập nhật lên server sau khi người dùng ngừng thay đổi');
    } catch (error) {
      console.error('Không thể cập nhật số lượng trên server:', error);
    }
  }, 1000);
};

const removeItem = async (itemId) => {
  try {
    await cartStore.removeItem(itemId);
    delete selectedItems[itemId];
    showToast(ToastEnum.Success, t('cart.removeSuccess'));
  } catch (error) {
    showToast(ToastEnum.Error, t('cart.removeError'));
  }
};

const confirmRemoveAll = () => {
  if (!cartStore.cartItems || cartStore.cartItems.length === 0) {
    showToast(ToastEnum.Warning, t('cart.emptyCart'));
    return;
  }

  if (confirm(t('cart.confirmRemoveAll'))) {
    const items = [...cartStore.cartItems];
    try {
      Promise.all(
        items.map(async (item) => {
          try {
            await cartStore.removeItem(item.id); // Gọi API nếu cần, hoặc xóa trực tiếp
            delete selectedItems[item.id];
          } catch (error) {
            showToast(ToastEnum.Error, t('cart.removeAllError'));
            throw error;
          }
        })
      ).then(() => {
        showToast(ToastEnum.Success, t('cart.removeAllSuccess'));
      }).catch((error) => {
        console.error("Failed to remove all items", error);
      });
    } catch (error) {
      console.error("Error initiating remove all operation", error);
    }
  }
};

const applyCoupon = () => {
  if (!couponCode.value) {
    showToast(ToastEnum.Warning, t('cart.enterCouponCodeWarning'));
    return;
  }

  showToast(ToastEnum.Warning, t('cart.couponFeatureInDevelopment'));
};

const checkout = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    router.push({ name: 'Login', query: { redirect: '/checkout' } });
    return;
  }

  if (selectedItemCount.value === 0) {
    showToast(ToastEnum.Warning, t('cart.selectItemsToCheckout'));
    return;
  }

  // Đảm bảo sử dụng dữ liệu mới nhất từ localStorage
  cartStore.initializeCartFromLocalStorage();

  const selectedProductIds = cartStore.cartItems
    .filter(item => selectedItems[item.id])
    .map(item => item.id);

  localStorage.setItem('selectedCartItems', JSON.stringify(selectedProductIds));

  router.push({ name: 'Checkout' });
};

const handleQuantityInput = (itemId, newQuantity) => {
  const item = cartStore.cartItems.find(item => item.id === itemId);
  if (!item) return;

  let quantity = parseInt(newQuantity);

  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
    item.quantity = quantity;
  } else if (quantity > item.product.stockQuantity) {
    quantity = item.product.stockQuantity;
    item.quantity = quantity;
    showToast(ToastEnum.Warning, t('cart.quantityMaxError', { max: item.product.stockQuantity }));
  }

  if (quantity !== newQuantity) {
    updateItemQuantity(itemId, quantity);
  } else {
    updateItemQuantity(itemId, quantity);
  }
};
</script>

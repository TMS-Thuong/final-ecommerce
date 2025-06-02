<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="cartStore.isEmpty" class="py-8 text-center">
      <div class="flex justify-center mb-4">
        <img src="@/assets/empty-cart.svg" alt="Empty Cart" class="w-34 h-34 text-gray-300" />
      </div>
      <h2 class="text-3xl font-medium text-gray-900 mb-2">{{ $t('cart.emptyCart') }}</h2>
      <p class="text-gray-600 text-xl mb-6">{{ $t('cart.noProducts') }}</p>
      <router-link to="/products"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-neutral-800 hover:bg-neutral-700">
        {{ $t('cart.continueShopping') }}
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white overflow-hidden border border-gray-200 rounded-md">
          <div class="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center">
              <div class="mr-3">
                <input type="checkbox" id="select-all"
                  class="h-5 w-5 text-neutral-800 focus:ring-neutral-800 border-gray-300 rounded cursor-pointer"
                  :checked="isAllSelected" @change="toggleSelectAll" />
              </div>
              <h2 class="text-xl font-medium text-gray-900">{{ $t('cart.products') }} ({{ cartStore.totalItems }})</h2>
            </div>
            <button @click="confirmRemoveAll" class="text-red-600 hover:text-red-800 text-xl font-medium">{{
              $t('cart.removeAll') }}</button>
          </div>
          <ul class="divide-y divide-gray-200">
            <transition-group name="fade" tag="div">
              <CartItem v-for="item in cartStore.cartItems" :key="item.id" :item="item"
                :localQuantities="localQuantities" :selectedItems="selectedItems" @update-quantity="updateItemQuantity"
                @handle-quantity-input="handleQuantityInput" @remove="removeItem"
                @update-selected="updateSelectedState" />
            </transition-group>
          </ul>
        </div>

        <div class="mt-6">
          <router-link to="/products"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-xl font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <svg class="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clip-rule="evenodd" />
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
              <label for="coupon" class="block text-xl font-medium text-gray-700 mb-1">{{ $t('cart.couponCode')
                }}</label>
              <div class="flex">
                <input type="text" id="coupon"
                  class="flex-1 min-w-0 border border-gray-300 focus:ring-neutral-800 focus:border-neutral-800 rounded-l-md sm:text-xl px-3 py-2"
                  :placeholder="$t('cart.enterCouponCode')" v-model="couponCode">
                <button
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-xl font-medium text-white bg-neutral-800 hover:bg-neutral-700"
                  @click="applyCoupon">
                  {{ $t('cart.apply') }}
                </button>
              </div>
            </div>

            <button
              class="w-full px-6 py-3 bg-neutral-800 text-xl text-white rounded-md hover:bg-neutral-700 transition flex items-center justify-center"
              @click="checkout" :disabled="selectedItemCount === 0"
              :class="{ 'opacity-50 cursor-not-allowed': selectedItemCount === 0 }">
              {{ $t('cart.checkout') }} ({{ selectedItemCount }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal :visible="showConfirmRemoveAll" :title="t('cart.confirmRemoveAllTitle')"
      :message="t('cart.confirmRemoveAll')" :confirm-text="t('common.ok')" :cancel-text="t('common.cancel')"
      @confirm="handleRemoveAll" @cancel="showConfirmRemoveAll = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useCartStore } from '@/stores/cart/cart';
import { useRouter } from 'vue-router';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import { useI18n } from 'vue-i18n';
import CartItem from '@/components/products/CartItem.vue';
import ConfirmModal from '@/components/molecules/utils/ConfirmModal.vue';

const cartStore = useCartStore();
const router = useRouter();
const { t } = useI18n();
const { showToast } = useToast();
const couponCode = ref('');
const selectedItems = reactive({});
const localQuantities = reactive({});
const itemLoading = reactive({});
const showConfirmRemoveAll = ref(false);

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
      localQuantities[item.id] = item.quantity;
    });
  }
}, { deep: true, immediate: true });

const updateItemQuantity = async (itemId, newQuantity) => {
  const item = cartStore.cartItems.find(item => item.id === itemId);
  if (!item) return;

  if (newQuantity < 1) {
    showToast(ToastEnum.Warning, t('cart.quantityMinError'));
    localQuantities[itemId] = 1;
    return;
  }
  if (newQuantity > item.product.stockQuantity) {
    showToast(ToastEnum.Warning, t('cart.quantityMaxError', { max: item.product.stockQuantity }));
    localQuantities[itemId] = item.product.stockQuantity;
    return;
  }

  itemLoading[itemId] = true;
  showToast(ToastEnum.Success, t('cart.updateSuccess'));

  if (updateCartTimer) clearTimeout(updateCartTimer);

  updateCartTimer = setTimeout(async () => {
    try {
      await cartStore.updateItem(itemId, newQuantity);
      const updatedItem = cartStore.cartItems.find(item => item.id === itemId);
      if (updatedItem) localQuantities[itemId] = updatedItem.quantity;
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data?.code || t('cart.updateError');
      showToast(ToastEnum.Error, msg);
    } finally {
      itemLoading[itemId] = false;
    }
  }, 1000);
};

const removeItem = async (itemId) => {
  try {
    await cartStore.removeItem(itemId);
    delete selectedItems[itemId];
    showToast(ToastEnum.Success, t('cart.removeSuccess'));
  } catch (error) {
    const msg = error?.response?.data?.message || error?.response?.data?.code || t('cart.removeError');
    showToast(ToastEnum.Error, msg);
  }
};

const confirmRemoveAll = () => {
  if (!cartStore.cartItems || cartStore.cartItems.length === 0) {
    showToast(ToastEnum.Warning, t('cart.emptyCart'));
    return;
  }
  showConfirmRemoveAll.value = true;
};

const handleRemoveAll = async () => {
  showConfirmRemoveAll.value = false;
  const items = [...cartStore.cartItems];
  try {
    await Promise.all(
      items.map(async (item) => {
        await cartStore.removeItem(item.id);
        delete selectedItems[item.id];
      })
    );
    showToast(ToastEnum.Success, t('cart.removeAllSuccess'));
  } catch (error) {
    const msg = error?.response?.data?.message || error?.response?.data?.code || t('cart.removeAllError');
    showToast(ToastEnum.Error, msg);
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

  const selectedItemsList = cartStore.cartItems.filter(item => selectedItems[item.id]);
  if (selectedItemsList.length === 0) {
    showToast(ToastEnum.Warning, t('cart.selectItems'));
    return;
  }

  try {
    const selectedProductIds = selectedItemsList.map(item => item.id);
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedProductIds));
    router.push({ name: 'Checkout' });
  } catch (error) {
    showToast(ToastEnum.Error, t('cart.checkoutError'));
  }
};

const handleQuantityInput = (itemId, newQuantity) => {
  let quantity = parseInt(newQuantity);
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
  } else {
    const item = cartStore.cartItems.find(item => item.id === itemId);
    if (item && quantity > item.product.stockQuantity) {
      quantity = item.product.stockQuantity;
      showToast(ToastEnum.Warning, t('cart.quantityMaxError', { max: item.product.stockQuantity }));
    }
  }
  localQuantities[itemId] = quantity;
  updateItemQuantity(itemId, quantity);
};

const updateSelectedState = (itemId, isSelected) => {
  selectedItems[itemId] = isSelected;
};

const blockNonNumberInput = (e) => {
  if (
    !(
      (e.key >= '0' && e.key <= '9') ||
      ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)
    )
  ) {
    e.preventDefault();
  }
};

const blockPasteNonNumber = (e) => {
  const paste = (e.clipboardData || window.clipboardData).getData('text');
  if (!/^[0-9]+$/.test(paste)) {
    e.preventDefault();
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <button @click="goBack" class="flex items-center text-neutral-600 hover:text-neutral-800 mr-4">
          <BackIcon size="8" />
        </button>
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('address.title') }}</h1>
      </div>
      <RouterLink :to="{ name: RouterEnum.AddAddress }"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-neutral-800 hover:bg-neutral-700">
        <PlusIcon />
        {{ $t('address.addNew') }}
      </RouterLink>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800"></div>
    </div>

    <div v-else-if="!addresses.length" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <MapPinIcon class="mx-auto text-gray-400" />
      <p class="mt-2 text-xl text-gray-500">{{ $t('checkout.noAddresses') }}</p>
      <RouterLink :to="{ name: RouterEnum.AddAddress }"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700">
        <PlusIcon />
        {{ $t('address.addNew') }}
      </RouterLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="address in addresses" :key="address.id"
        class="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        :class="{ 'border-neutral-500': selectedAddressId === address.id }">
        <div class="flex">
          <div class="mr-4 flex items-center">
            <div class="relative flex items-center justify-center w-6 h-6">
              <input type="radio" :id="`address-${address.id}`" :value="address.id" v-model="selectedAddressId"
                class="w-5 h-5 text-neutral-800 border-gray-300 focus:ring-neutral-800"
                @change="handleAddressSelection(address.id)" />
            </div>
          </div>
          <div class="flex-1">
            <div class="flex justify-between text-lg">
              <div>
                <div class="flex items-center">
                  <h3 class="text-xl font-medium text-gray-900">
                    {{ address.recipientName || address.fullName }}
                  </h3>
                  <span v-if="address.isDefaultShipping || address.isDefault"
                    class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-green-100 text-green-800">
                    {{ $t('address.default') }}
                  </span>
                </div>
                <p class="text-gray-500 mt-1">{{ address.phoneNumber || address.phone }}</p>
                <p class="text-gray-500">
                  {{ address.streetAddress }}, {{ address.ward }}, {{ address.district }}, {{ address.province }}
                </p>
              </div>
              <div class="flex space-x-3">
                <button @click="handleEditAddress(address.id)" class="text-neutral-600 hover:text-neutral-800"
                  title="Edit">
                  <EditIcon size="6" />
                </button>
                <button v-if="!address.isDefaultShipping && !address.isDefault" @click="deleteAddress(address.id)"
                  class="text-red-600 hover:text-red-800" title="Delete">
                  <TrashIcon size="6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddressModal :is-open="showAddressModal" :address-to-edit="addressToEdit" @close="toggleAddressModal(false)"
      @saved="handleAddressSaved" />

    <div v-if="showDeleteConfirmation" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
      role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <WarningIcon class="text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-xl leading-6 font-medium text-gray-900" id="modal-title">
                  {{ $t('address.delete') }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ $t('address.confirmDelete') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              @click="() => deleteAddress(addressToDeleteId.value)" :disabled="isDeleting">
              <span v-if="isDeleting" class="mr-2">
                <LoadingSpinnerIcon class="text-white" />
              </span>
              {{ $t('address.delete') }}
            </button>
            <button type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="cancelDelete">
              {{ $t('address.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import addressApi from '@/api/address';
import AddressModal from '@/components/molecules/utils/AddressModal.vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { RouterEnum } from '@/enums/router';
import { useCheckoutStore } from '@/stores/checkout';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import StarIcon from '@/components/icons/StarIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import MapPinIcon from '@/components/icons/MapPinIcon.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';
import LoadingSpinnerIcon from '@/components/icons/LoadingSpinnerIcon.vue';
import BackIcon from '@/components/icons/BackIcon.vue';

const { t } = useI18n();
const { showToast } = useToast();
const router = useRouter();
const route = useRoute();
const checkoutStore = useCheckoutStore();

const addresses = ref([]);
const isLoading = ref(true);
const showAddressModal = ref(false);
const addressToEdit = ref(null);
const showDeleteConfirmation = ref(false);
const addressToDeleteId = ref(null);
const isDeleting = ref(false);
const selectedAddressId = ref(null);
const fromCheckout = ref(false);

const showSaveButton = computed(() => {
  return route.query.from === 'checkout' || fromCheckout.value;
});

const fetchAddresses = async () => {
  isLoading.value = true;
  try {
    const response = await addressApi.getAddresses();
    addresses.value = response.data || [];
    if (addresses.value.length > 0) {
      const defaultAddress = addresses.value.find(a => a.isDefaultShipping || a.isDefault);
      selectedAddressId.value = defaultAddress ? defaultAddress.id : addresses.value[0].id;

      if (route.query.from === 'checkout' && checkoutStore.selectedAddressId) {
        selectedAddressId.value = checkoutStore.selectedAddressId;
        fromCheckout.value = true;
      }
    }
  } catch (error) {
    showToast(ToastEnum.Error, t('error'));
  } finally {
    isLoading.value = false;
  }
};

const toggleAddressModal = (show) => {
  showAddressModal.value = show;
  if (!show) {
    addressToEdit.value = null;
  }
};

const handleEditAddress = (addressId) => {
  if (!addressId) {
    showToast(ToastEnum.Error, t('address.idMissing'));
    return;
  }
  router.push({ name: RouterEnum.EditAddress, params: { id: addressId } });
};

const handleAddressSaved = async (savedAddress) => {
  if (savedAddress) {
    await fetchAddresses();
  }
};

const handleAddressSelection = (addressId) => {
  selectedAddressId.value = addressId;
  if (route.query.from === 'checkout') {
    checkoutStore.selectedAddressId = addressId;
    router.push({ name: RouterEnum.Checkout });
  }
};

const confirmDeleteAddress = (addressId) => {
  addressToDeleteId.value = addressId;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  addressToDeleteId.value = null;
};

const deleteAddress = async (addressId) => {
  if (!addressId) return;

  isDeleting.value = true;
  try {
    await addressApi.deleteAddress(addressId);
    showToast(ToastEnum.Success, t('address.deleteSuccess'));
    await fetchAddresses();
  } catch (error) {
    showToast(ToastEnum.Error, t('address.deleteError'));
  } finally {
    isDeleting.value = false;
  }
};

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    router.push({ name: RouterEnum.Account });
  }
};

onMounted(async () => {
  await fetchAddresses();
});
</script>

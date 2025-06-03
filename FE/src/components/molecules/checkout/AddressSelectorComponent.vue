<template>
  <div class="bg-white overflow-hidden border border-gray-200 rounded-md mb-6">
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h2 class="text-2xl font-medium text-gray-900">{{ $t('checkout.deliveryAddress') }}</h2>
    </div>

    <div class="px-6 py-4">
      <div v-if="isLoading" class="py-4">
        <p class="text-gray-500">{{ $t('checkout.loadingAddresses') }}</p>
      </div>
      <div v-else-if="!addresses.length" class="py-4">
        <p class="text-gray-500 mb-4">{{ $t('checkout.noAddresses') }}</p>
        <RouterLink :to="{ name: RouterEnum.AddAddress }"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-neutral-800 hover:bg-neutral-700">
          <PlusIcon />
          {{ $t('address.addNew') }}
        </RouterLink>
      </div>
      <div v-else>
        <div class="flex justify-between items-center border border-gray-200 rounded-md p-4">
          <div class="flex-1">
            <div class="flex items-start">
              <div class="ml-3 text-lg">
                <label :for="'address-' + selectedAddress.id" class="block text-xl font-medium text-gray-700">
                  {{ selectedAddress.recipientName || selectedAddress.fullName }}
                  <span v-if="selectedAddress.isDefaultShipping || selectedAddress.isDefault"
                    class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-green-100 text-green-800">
                    {{ $t('address.default') }}
                  </span>
                </label>
                <p class="text-gray-500 mt-1">{{ selectedAddress.phoneNumber || selectedAddress.phone }}</p>
                <p class="text-gray-500">
                  {{ selectedAddress.streetAddress }}, {{ selectedAddress.ward }}, {{ selectedAddress.district }}, {{
                  selectedAddress.province }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-between">
          <RouterLink :to="{ name: RouterEnum.AddressList, query: { from: 'checkout' } }"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
            <GearIcon class="w-5 h-5 mr-2 -ml-1 text-gray-500" />
            {{ $t('address.manage') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import GearIcon from '@/components/icons/GearIcon.vue';
import { RouterEnum } from '@/enums/router';

const props = defineProps({
  addresses: {
    type: Array,
    required: true
  },
  selectedAddressId: {
    type: Number,
    required: true,
    default: 0
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:selectedAddressId', 'add-address', 'show-all-addresses']);

const selectedAddress = computed(() => {
  if (!props.addresses || props.addresses.length === 0) {
    return {
      id: 0,
      recipientName: '',
      fullName: '',
      phoneNumber: '',
      phone: '',
      streetAddress: '',
      ward: '',
      district: '',
      province: ''
    };
  }

  const selected = props.addresses.find(address => address.id === props.selectedAddressId);
  if (selected) return selected;

  return props.addresses.find(address => address.isDefaultShipping || address.isDefault) ||
    props.addresses[0];
});
</script>

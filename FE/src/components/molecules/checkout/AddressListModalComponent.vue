<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal">
      </div>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-neutral-800 px-4 py-4 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-white" id="modal-title">
            {{ $t('address.selectAddress') }}
          </h3>
          <button type="button" class="text-white hover:text-gray-200" @click="closeModal">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="space-y-4">
            <div v-for="address in addresses" :key="address.id"
              class="border border-gray-200 rounded-md p-4 transition-colors"
              :class="{ 'border-neutral-800 bg-gray-50': address.id === safeModelValue }">
              <div class="flex">
                <input type="radio" :id="'modal-address-' + address.id" name="modalDeliveryAddress" :value="address.id"
                  v-model="selectedAddress"
                  class="h-4 w-4 text-neutral-800 focus:ring-neutral-800 border-gray-300 mt-1" />
                <div class="ml-3 flex-1">
                  <label :for="'modal-address-' + address.id" class="block text-lg font-medium text-gray-700">
                    {{ address.recipientName || address.fullName }}
                    <span v-if="address.isDefaultShipping || address.isDefault"
                      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xl font-medium bg-green-100 text-green-800">
                      {{ $t('address.default') }}
                    </span>
                  </label>
                  <p class="text-gray-500 mt-1">{{ address.phoneNumber || address.phone }}</p>
                  <p class="text-gray-500">
                    {{ address.streetAddress }}, {{ address.ward }}, {{ address.district }}, {{ address.province }}
                  </p>
                </div>
                <button @click.stop="$emit('edit-address', address.id)"
                  class="text-neutral-600 hover:text-neutral-800 ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-neutral-800 text-base font-medium text-white hover:bg-neutral-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            @click="confirmSelection">
            {{ $t('address.confirm') }}
          </button>
          <button type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="closeModal">
            {{ $t('address.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  addresses: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Number,
    required: true,
    default: 0
  }
});

const emit = defineEmits(['close', 'update:modelValue', 'edit-address']);

const safeModelValue = computed(() => {
  return props.modelValue == null ? 0 : props.modelValue;
});

const selectedAddress = ref(safeModelValue.value);

watch(() => props.modelValue, (newValue) => {
  selectedAddress.value = newValue == null ? 0 : newValue;
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedAddress.value = props.modelValue == null ? 0 : props.modelValue;
  }
});

const closeModal = () => {
  emit('close');
};

const confirmSelection = () => {
  emit('update:modelValue', selectedAddress.value);
  closeModal();
};
</script>
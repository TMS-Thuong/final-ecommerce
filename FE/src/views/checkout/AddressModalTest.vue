<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Test Address Modal</h1>

    <button
      @click="showModal = true"
      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700"
    >
      Open Address Modal
    </button>

    <AddressModal
      :is-open="showModal"
      @close="closeModal"
      @saved="handleAddressSaved"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import AddressModal from '@/components/molecules/utils/AddressModal.vue';

const { showToast } = useToast();
const showModal = ref(false);

const closeModal = () => {
  
  showModal.value = false;
};

const handleAddressSaved = (address) => {
  
  showToast(ToastEnum.Success, 'Address saved successfully!');
};
</script>

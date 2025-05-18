<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from '@/components/molecules/utils/ToastComponent.vue'
import { useToastMessageStore } from '@/stores/useToastMessageStore'
import HeaderComponent from '@/components/molecules/utils/HeaderComponent.vue'
const toastStore = useToastMessageStore()
</script>

<template>
  <HeaderComponent class="sticky top-0 left-0 right-0 z-50 bg-neutral-50 px-8 shadow-sm" />
  <RouterView class="bg-neutral-100" />
  <div class="fixed top-4 right-4 z-50">
    <Toast v-if="toastStore.isShowToast" :type="toastStore.toastType" :message="toastStore.toastMessage"
      @close="toastStore.isShowToast = false" />
  </div>
</template>

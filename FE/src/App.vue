<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from '@/components/molecules/utils/ToastComponent.vue'
import { useToastMessageStore } from '@/stores/useToastMessageStore'

const toastStore = useToastMessageStore()
</script>

<template>
  <RouterView class="bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500" />
  <div class="fixed top-4 right-4 z-50">
    <Toast v-if="toastStore.isShowToast" :type="toastStore.toastType" :message="toastStore.toastMessage"
      @close="toastStore.isShowToast = false" />
  </div>
</template>

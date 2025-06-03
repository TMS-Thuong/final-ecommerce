<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref, provide } from 'vue'
import Toast from '@/components/molecules/utils/ToastComponent.vue'
import { useToastMessageStore } from '@/stores/untils/useToastMessageStore'
import HeaderComponent from '@/components/header/HeaderComponent.vue'
import { useCartStore } from '@/stores/cart/cart'
import { ToastEnum } from '@/enums/toast'
import FooterOrganism from '@/components/footer/FooterOrganismComponent.vue'

const toastStore = useToastMessageStore()
const cartStore = useCartStore()

const headerKey = ref(0)
function forceHeaderUpdate() {
  headerKey.value++
}
provide('forceHeaderUpdate', forceHeaderUpdate)

onMounted(() => {
  if (localStorage.getItem('accessToken')) {
    cartStore.initCart().catch(err => {
      toastStore.$patch({
        isShowToast: true,
        toastType: ToastEnum.Error,
        toastMessage: 'Failed to load your cart. Please try again.'
      });
    })
  }
})
</script>

<template>
  <HeaderComponent :key="headerKey" class="sticky top-0 left-0 right-0 z-50 bg-neutral-50 px-8 shadow-sm" />
  <RouterView />
  <div class="fixed top-20 right-5 z-60">
    <Toast v-if="toastStore.isShowToast" :type="toastStore.toastType" :message="toastStore.toastMessage"
      @close="toastStore.isShowToast = false" />
  </div>
</template>

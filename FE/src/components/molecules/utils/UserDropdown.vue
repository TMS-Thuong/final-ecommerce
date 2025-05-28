<template>
  <div ref="dropdownRef" class="relative">
    <ChevronDownIcon size="8" class="text-gray-700 hover:text-black transition cursor-pointer"
      @click="toggleDropdown" />
    <div v-if="dropdownVisible"
      class="absolute right-0 mt-2 w-48 text-xl font-semibold bg-white border border-gray-300 shadow-lg rounded-md z-50">
      <ul class="py-1">
        <template v-if="isAuthenticated">
          <li @click="inMyOrders" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ $t('orders.myOrders') }}</li>
          <li @click="inMyAddresses" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ $t('address.title') }}</li>
          <li @click="inProfile" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ $t('account.profile') }}</li>
          <li @click="inLogout" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ $t('account.logout') }}</li>
        </template>
        <template v-else>
          <li @click="inSignIn" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ $t('account.signIn') }}</li>
          <li @click="inSignUp" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ $t('account.signUp') }}</li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { AuthRouterEnum, RouterEnum } from '@/enums/router'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import { ToastEnum } from '@/enums/toast'
import { useToast } from '@/hooks/useToast'
import { useAuthStore } from '@/stores/auth/login/token.store'
import { useI18n } from 'vue-i18n'
import router from '@/router'

const { t } = useI18n()
const { showToast } = useToast()
const authStore = useAuthStore()

const dropdownVisible = ref(false)
const dropdownRef = ref(null)

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('accessToken')
})

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const inClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', inClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', inClickOutside)
})

const inMyOrders = () => {
  router.push({ name: RouterEnum.MyOrders })
  dropdownVisible.value = false
}

const inMyAddresses = () => {
  router.push({ name: RouterEnum.AddressList })
  dropdownVisible.value = false
}

const inSignIn = () => {
  router.push({ name: AuthRouterEnum.Login })
  dropdownVisible.value = false
}

const inSignUp = () => {
  router.push({ name: AuthRouterEnum.Register })
  dropdownVisible.value = false
}

const inLogout = () => {
  dropdownVisible.value = false
  authStore.logout(router)
  showToast(ToastEnum.Success, t('account.logoutSuccess'))
}

const inProfile = () => {
  router.push({ name: RouterEnum.Profile })
  dropdownVisible.value = false
}
</script>

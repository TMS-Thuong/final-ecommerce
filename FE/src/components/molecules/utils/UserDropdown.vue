<template>
  <div ref="dropdownRef" class="relative">
    <ChevronDownIcon size="8" class="text-gray-700 hover:text-black transition cursor-pointer"
      @click="toggleDropdown" />
    <div v-if="dropdownVisible"
      class="absolute right-0 mt-2 w-48 text-xl font-semibold bg-white border border-gray-300 shadow-lg rounded-md">
      <ul class="py-1">
        <li @click="inSignIn" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In</li>
        <li @click="inSignUp" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign Up</li>
        <li @click="inLogout" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
        <li @click="inProfile" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { AuthRouterEnum } from '@/enums/router'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import { ToastEnum } from '@/enums/toast'
import { useToast } from '@/hooks/useToast'
import { useAuthStore } from '@/stores/auth/login/token.store'
import router from '@/router'


const { showToast } = useToast()


const dropdownVisible = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const inSignIn = () => { router.push({ name: AuthRouterEnum.Login }) }
const inSignUp = () => { router.push({ name: AuthRouterEnum.Register }) }
const inLogout = () => {
  useAuthStore.logout(router)
  showToast('Logout successfully', ToastEnum.SUCCESS)
}
const inProfile = () => { router.push({ name: AuthRouterEnum.Profile }) }
</script>

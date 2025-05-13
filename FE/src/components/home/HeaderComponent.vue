<template>
  <header class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-zinc-100 to-zinc-400 shadow-md">
    <div class="flex items-center min-w-[200px] ml-6">
      <Logo :src="imageSrc" alt="Logo" class="h-10 w-auto object-contain" />
    </div>

    <div class="flex-1 flex justify-center px-1">
      <SearchInput class="w-full max-w-5xl" />
    </div>

    <div class="flex items-center space-x-8">
      <CartIcon size="8" class="text-gray-700 hover:text-black transition " />
      <HeartIcon size="8" class="text-gray-700 hover:text-black transition" />
      <PersonIcon size="8" class="text-gray-700 hover:text-black transition" />
      <SubmitButton :text="$t('auth.login.submitButton')" :disabled="isLoading"
        class="!bg-gray-800 !text-white hover:!bg-gray-700 transition" />
      <SubmitButton :text="$t('auth.register.submitButton')" :disabled="isLoading"
        class="!bg-white !text-gray-800 border border-gray-400 hover:!bg-gray-100 transition" />
    </div>
  </header>
</template>

<script setup>
import Logo from '@/components/icons/Logo.vue'
import CartIcon from '@/components/icons/CartIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import PersonIcon from '@/components/icons/PersonIcon.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import SearchInput from '@/components/molecules/utils/SearchInputComponent.vue'

const imageSrc = new URL('@/assets/logo.png', import.meta.url).href
const isLoading = false
</script>

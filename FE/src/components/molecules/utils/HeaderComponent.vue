<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white shadow-md relative">
    <div class="flex items-center min-w-[200px] ml-6 pl-6">
      <Logo :src="imageSrc" alt="Logo" class="h-10 w-auto object-contain" />
    </div>
    <div class="flex items-center space-x-12">
      <HeaderSection />
    </div>
    <div class="flex items-center space-x-8 relative ml-6 pl-6 mr-6 pr-6">
      <SearchIcon size="8" class="text-gray-700 hover:text-black transition cursor-pointer" @click="toggleSearch" />
      <CartIcon size="8" class="text-gray-700 hover:text-black transition" />
      <HeartIcon size="8" class="text-gray-700 hover:text-black transition" />
      <div class="flex items-center">
        <PersonIcon size="8" class="text-gray-700 hover:text-black transition" />
        <UserDropdown />
      </div>
      <SearchBox v-if="isSearchVisible" @search="handleSearch" placeholder="Search Name, Sku,.." popup />
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import Logo from '@/components/icons/Logo.vue'
import CartIcon from '@/components/icons/CartIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import PersonIcon from '@/components/icons/PersonIcon.vue'
import UserDropdown from '@/components/molecules/utils/UserDropdown.vue'
import SearchBox from '@/components/molecules/utils/SearchInputComponent.vue'
import HeaderSection from '@/components/molecules/utils/HeaderSelectionComponent.vue'

const imageSrc = new URL('@/assets/logo.png', import.meta.url).href
const isSearchVisible = ref(false)

function toggleSearch() {
  isSearchVisible.value = !isSearchVisible.value
}

function handleSearch(query) {
  console.log('Search query:', query)
  isSearchVisible.value = false
}
</script>

<template>
  <header class="w-full bg-white shadow-md">
    <div class="md:hidden">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="isMenuOpen = !isMenuOpen" class="text-gray-700 focus:outline-none">
          <MenuIcon v-if="!isMenuOpen" size="8" class="text-gray-700" />
          <XIcon v-else size="8" class="text-gray-700" />
        </button>

        <div class="flex-1 flex justify-center">
          <Logo :src="imageSrc" alt="Logo" class="h-8 w-auto object-contain" @click="inHome" />
        </div>

        <div class="flex items-center space-x-4">
          <SearchIcon size="8" class="text-gray-700" @click.stop="inToggleSearch" />
          <CartIcon size="8" class="text-gray-700" @click="inCart" />
        </div>
      </div>

      <div v-if="isMenuOpen" class="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <nav class="space-y-4">
          <div class="flex flex-col space-y-4">
            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black" @click="inAbout">
              <GroupUserIcon size="6" class="text-gray-700 " />
              <span class="text-sm font-medium">About</span>
            </div>

            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black" @click="inProducts">
              <ProductIcon size="6" class="text-gray-700 " />
              <span class="text-sm font-medium">Products</span>
            </div>

            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black" @click="inContact">
              <TelephoneIcon size="6" class="text-gray-700 " />
              <span class="text-sm font-medium">Contact</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-3 mt-1">
            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black" @click="inAccount">
              <PersonIcon size="5" class="text-gray-700" />
              <span class="text-sm font-medium">My Account</span>
            </div>

            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black" @click="inWishlist">
              <HeartIcon size="5" class="text-gray-700" />
              <span class="text-sm font-medium">Wishlist</span>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <div class="hidden md:flex items-center justify-between px-6 py-4 relative">
      <div class="flex items-center min-w-[200px]">
        <Logo :src="imageSrc" alt="Logo" class="h-10 w-auto object-contain" @click="inHome" />
      </div>

      <div class="flex items-center space-x-8 lg:space-x-12">
        <HeaderSection />
      </div>

      <div class="flex items-center space-x-4 lg:space-x-8 relative">
        <SearchIcon size="8" class="text-gray-700 hover:text-black transition cursor-pointer"
          @click.stop="inToggleSearch" />
        <CartIcon size="8" class="text-gray-700 hover:text-black transition" @click="inCart"/>
        <HeartIcon size="8" class="text-gray-700 hover:text-black transition" @click="inWishlist"/>
        <div class="flex items-center">
          <PersonIcon size="8" class="text-gray-700 hover:text-black transition" @click="inAccount"/>
          <UserDropdown />
        </div>
      </div>
    </div>

    <div ref="searchBoxRef" class="w-full relative flex justify-end">
      <SearchInputComponent v-if="isSearchVisible" v-model="searchQuery" 
        @search="handleSearch" 
        :placeholder="$t('product.search.placeholder')"
        :width="'max-w-2xl'"
        class="absolute top-0 w-full md:w-[40rem] bg-white z-50 shadow-md" />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '@/components/icons/Logo.vue'
import CartIcon from '@/components/icons/CartIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import GroupUserIcon from '@/components/icons/GroupUserIcon.vue'
import ProductIcon from '@/components/icons/ProductIcon.vue'
import TelephoneIcon from '@/components/icons/TelephoneIcon.vue'
import XIcon from '@/components/icons/XIcon.vue'
import PersonIcon from '@/components/icons/PersonIcon.vue'
import UserDropdown from '@/components/molecules/utils/UserDropdown.vue'
import SearchInputComponent from '@/components/molecules/utils/SearchInputComponent.vue'
import HeaderSection from '@/components/molecules/utils/HeaderSelectionComponent.vue'
import { useI18n } from 'vue-i18n'
import { RouterEnum } from '@/enums/router'

const { t } = useI18n()
const router = useRouter()
const imageSrc = new URL('@/assets/logo.png', import.meta.url).href
const searchBoxRef = ref(null)
const isSearchVisible = ref(false)
const isMenuOpen = ref(false)
const searchQuery = ref('')

const inToggleSearch = (event) => {
  event?.stopPropagation()
  isSearchVisible.value = !isSearchVisible.value
  if (isMenuOpen.value) {
    isMenuOpen.value = false
  }
}

const handleClickOutside = (event) => {
  if (searchBoxRef.value && !searchBoxRef.value.contains(event.target)) {
    isSearchVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isMenuOpen.value) {
      isMenuOpen.value = false
    }
  })
})

const inHome = () => {
  router.push({ name: RouterEnum.Home })
  isMenuOpen.value = false
}

const inAbout = () => {
  router.push({ name: RouterEnum.About })
  isMenuOpen.value = false
}

const inProducts = () => {
  router.push({ name: RouterEnum.Products })
  isMenuOpen.value = false
}

const inContact = () => {
  router.push({ name: RouterEnum.Contact })
  isMenuOpen.value = false
}

const inCart = () => {
  isMenuOpen.value = false
}

const inWishlist = () => {
  isMenuOpen.value = false
}

const inAccount = () => {
  isMenuOpen.value = false
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', () => { })
})

const handleSearch = (query) => {
  isSearchVisible.value = false
  isMenuOpen.value = false
  
  if (query) {
    router.push({ 
      name: RouterEnum.Products, 
      query: { searchQuery: query }
    })
  }
}
</script>
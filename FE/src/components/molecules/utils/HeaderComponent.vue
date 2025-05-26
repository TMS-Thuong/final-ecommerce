<template>
  <header class="w-full bg-white shadow-md">
    <div class="md:hidden">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="isMenuOpen = !isMenuOpen" class="text-gray-700 focus:outline-none">
          <MenuIcon v-if="!isMenuOpen" size="9" class="text-gray-700" />
          <XIcon v-else size="9" class="text-gray-700" />
        </button>

        <div class="flex-1 flex justify-center">
          <Logo :src="imageSrc" alt="Logo" class="h-8 w-auto object-contain cursor-pointer" @click="inHome" />
        </div>

        <div class="flex items-center space-x-4">
          <SearchIcon size="9" class="text-gray-700" @click.stop="inToggleSearch" />
          <CartIcon size="9" class="text-gray-700" @click="inCart" :item-count="cartItemsCount" />
        </div>
      </div>

      <div v-if="isMenuOpen" class="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <nav class="space-y-4">
          <div class="flex flex-col space-y-4">
            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black cursor-pointer"
              @click="inAbout">
              <GroupUserIcon size="6" class="text-gray-700" />
              <span class="text-lg font-medium">About</span>
            </div>

            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black cursor-pointer"
              @click="inProducts">
              <ProductIcon size="6" class="text-gray-700" />
              <span class="text-lg font-medium">Products</span>
            </div>

            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black cursor-pointer"
              @click="inContact">
              <TelephoneIcon size="6" class="text-gray-700" />
              <span class="text-lg font-medium">Contact</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-3 mt-1 space-y-1">
            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black cursor-pointer"
              @click="inAccount">
              <PersonIcon size="6" class="text-gray-700" />
              <span class="text-lg font-medium">My Account</span>
            </div>
            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black cursor-pointer"
              @click="inWishlist">
              <HeartIcon size="6" class="text-gray-700" />
              <span class="text-lg font-medium">Wishlist</span>
            </div>
            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black cursor-pointer"
              @click="inMyOrders">
              <ShoppingCartIcon customClass="text-gray-700 w-5 h-5" />
              <span class="text-lg font-medium">My Orders</span>
            </div>
            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black cursor-pointer"
              @click="inAddresses">
              <LocationIcon size="6" class="text-gray-700" />
              <span class="text-lg font-medium">Addresses</span>
            </div>
            <div class="flex items-center space-x-3 px-1 py-2 text-gray-700 hover:text-black cursor-pointer"
              @click="inLogout">
              <LogoutIcon size="6" class="text-gray-700" />
              <span class="text-lg font-medium">Logout</span>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <div class="hidden md:flex items-center justify-between px-6 py-4 relative">
      <div class="flex items-center min-w-[200px] ">
        <Logo :src="imageSrc" alt="Logo" class="h-10 w-auto object-contain cursor-pointer" @click="inHome" />
      </div>

      <div class="flex items-center space-x-8 lg:space-x-12">
        <HeaderSection />
      </div>

      <div class="flex items-center space-x-4 lg:space-x-8 relative">
        <SearchIcon size="9" class="text-gray-700 hover:text-black transition cursor-pointer"
          @click.stop="inToggleSearch" />
        <CartIcon size="9" class="text-gray-700 hover:text-black transition cursor-pointer" @click="inCart"
          :item-count="cartItemsCount" />
        <HeartIcon size="9" class="text-gray-700 hover:text-black transition cursor-pointer" @click="inWishlist"
          :item-count="wishlistItemsCount" />
        <div class="flex items-center">
          <PersonIcon size="9" class="text-gray-700 hover:text-black transition" @click="inAccount" />
          <UserDropdown />
        </div>
      </div>
    </div>

    <div ref="searchBoxRef" class="w-full relative flex justify-end">
      <SearchInputComponent v-if="isSearchVisible" v-model="searchQuery" @search="handleSearch"
        :placeholder="$t('product.search.placeholder')" :width="'max-w-2xl'"
        class="absolute top-0 w-full md:w-[40rem] bg-white z-50 shadow-md" />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
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
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import LocationIcon from '@/components/icons/LocationIcon.vue'
import ShoppingCartIcon from '@/components/icons/ShoppingCartIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'

const { t } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const imageSrc = new URL('@/assets/logo.png', import.meta.url).href
const searchBoxRef = ref(null)
const isSearchVisible = ref(false)
const isMenuOpen = ref(false)
const searchQuery = ref('')

const cartItemsCount = computed(() => {
  return cartStore.totalItems;
})

const wishlistItemsCount = computed(() => wishlistStore.totalItems.value)

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

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isMenuOpen.value) {
      isMenuOpen.value = false
    }
  })

  cartStore.initializeCartFromLocalStorage()
  await wishlistStore.fetchWishlist()
})

const inHome = () => {
  router.push({ name: RouterEnum.Home })
  isMenuOpen.value = false
}

const inAbout = () => {
  router.push({ name: RouterEnum.Home })
  isMenuOpen.value = false
}

const inProducts = () => {
  router.push({ name: RouterEnum.ProductList })
  isMenuOpen.value = false
}

const inContact = () => {
  router.push({ name: RouterEnum.Home })
  isMenuOpen.value = false
}

const inCart = () => {
  if (localStorage.getItem('accessToken')) {
    router.push('/cart');
  } else {
    router.push({ name: RouterEnum.Login, query: { redirect: '/cart' } });
  }
  isMenuOpen.value = false;
}

const inWishlist = () => {
  if (localStorage.getItem('accessToken')) {
    router.push('/wishlist');
  } else {
    router.push({ name: RouterEnum.Login, query: { redirect: '/wishlist' } });
  }
  isMenuOpen.value = false;
}

const inAccount = () => {
  isMenuOpen.value = false
}

const inMyOrders = () => {
  router.push({ name: 'MyOrders' })
  isMenuOpen.value = false
}

const inAddresses = () => {
  router.push({ name: 'AddressList' })
  isMenuOpen.value = false
}

const inLogout = () => {
  localStorage.removeItem('accessToken')
  router.push({ name: 'Login' })
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
      name: RouterEnum.ProductList,
      query: { searchQuery: query }
    })
  }
}
</script>

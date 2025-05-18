<template>
  <div class="icon-section flex justify-center space-x-20">
    <div class="icon-item flex items-center space-x-2 cursor-pointer" @click="inHome">
      <GroupUserIcon size="8" class="text-gray-700 hover:text-black transition" />
      <p class="text-xl font-bold text-gray-700">About</p>
    </div>

    <!-- <router-link :to="{ name: RouterEnum.ProductList }" class="icon-item flex items-center space-x-2 cursor-pointer">
      <ProductIcon size="8" class="text-gray-700 hover:text-black transition" />
      <p class="text-xl font-bold text-gray-700">Products</p>
    </router-link> -->
    <div class="icon-item flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-black transition"
      @click="inProducts" >
      <ProductIcon size="8" />
      <p class="text-xl font-bold">Products</p>
    </div>

    <div class="icon-item flex items-center space-x-2 cursor-pointer">
      <TelephoneIcon size="8" class="text-gray-700 hover:text-black transition" />
      <p class="text-xl font-bold text-gray-700">Contact</p>
    </div>
  </div>
</template>

<script setup>
import { RouterEnum } from '@/enums/router'
import GroupUserIcon from '@/components/icons/GroupUserIcon.vue'
import ProductIcon from '@/components/icons/ProductIcon.vue'
import TelephoneIcon from '@/components/icons/TelephoneIcon.vue'
import router from '@/router'
const inHome = () => {
  router.push({ name: RouterEnum.Home })
}

const inProducts = () => {
  router.push({ name: RouterEnum.ProductList })
}

</script>

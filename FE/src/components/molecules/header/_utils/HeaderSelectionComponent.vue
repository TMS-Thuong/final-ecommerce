<template>
  <div class="icon-section flex justify-center space-x-20">
    <div class="icon-item flex items-center space-x-2 cursor-pointer" @click="inHome">
      <GroupUserIcon size="8" class="text-gray-700 hover:text-black transition" />
      <p class="text-2xl font-bold text-gray-700">About</p>
    </div>
    <div class="icon-item flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-black transition"
      @click="inProducts">
      <ProductIcon size="8" />
      <p class="text-2xl font-bold">Products</p>
    </div>

    <div class="icon-item flex items-center space-x-2 cursor-pointer" @click="inContact">
      <MailIcon size="8" :stroke-width="2.5" class="text-gray-700 hover:text-black transition " />
      <p class="text-2xl font-bold text-gray-700">Contact</p>
    </div>
  </div>
</template>

<script setup>
import { RouterEnum } from '@/enums/router'
import GroupUserIcon from '@/components/icons/GroupUserIcon.vue'
import ProductIcon from '@/components/icons/ProductIcon.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
import router from '@/router'

const inHome = () => {
  router.push({ name: RouterEnum.About })
}

const inProducts = () => {
  router.push({ name: RouterEnum.ProductList })
}

const inContact = () => {
  router.push({ name: RouterEnum.Contact })
}
</script>
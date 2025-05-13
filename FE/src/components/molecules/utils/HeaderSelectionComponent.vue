<template>
  <div class="icon-section flex justify-center space-x-20">
    <div class="icon-item flex items-center space-x-2">
      <GroupUserIcon size="8" class="text-gray-700 hover:text-black transition" />
      <p class="text-xl font-bold text-gray-700">About</p>
    </div>

    <div class="icon-item flex items-center space-x-2">
      <ProductIcon size="8" class="text-gray-700 hover:text-black transition" />
      <p class="text-xl font-bold text-gray-700">Products</p>
    </div>

    <div class="icon-item flex items-center space-x-2">
      <TelephoneIcon size="8" class="text-gray-700 hover:text-black transition" />
      <p class="text-xl font-bold text-gray-700">Contact</p>
    </div>
  </div>
</template>

<script setup>
import GroupUserIcon from '@/components/icons/GroupUserIcon.vue'
import ProductIcon from '@/components/icons/ProductIcon.vue'
import TelephoneIcon from '@/components/icons/TelephoneIcon.vue'
</script>

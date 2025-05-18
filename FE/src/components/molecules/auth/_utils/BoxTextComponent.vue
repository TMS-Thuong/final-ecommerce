<template>
  <div class="flex-1 text-while p-8 font-sans">
    <h1 class="text-4xl font-bold mb-6">{{ $t('benefits.title') }}</h1>

    <ul class="space-y-4 text-xl text-white font-medium mb-8">
      <li class="flex items-center gap-2">
        <div class="bg-white/20 p-2 rounded-lg">
          <ShippingIcon size="8" />
        </div>
        {{ $t('benefits.shipping') }}
      </li>
      <li class="flex items-center gap-2">
        <div class="bg-white/20 p-2 rounded-lg">
          <ProductVarietyIcon size="8" />
        </div>
        {{ $t('benefits.productVariety') }}
      </li>
      <li class="flex items-center gap-2">
        <div class="bg-white/20 p-2 rounded-lg">
          <EasyReturnsIcon size="8" />
        </div>
        {{ $t('benefits.easyReturns') }}
      </li>
      <li class="flex items-center gap-2">
        <div class="bg-white/20 p-2 rounded-lg">
          <GiftIcon size="8" />
        </div>
        {{ $t('benefits.rewardPoints') }}
      </li>
      <li class="flex items-center gap-2">
        <div class="bg-white/20 p-2 rounded-lg">
          <CouponIcon size="8" />
        </div>
        {{ $t('benefits.coupons') }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import ShippingIcon from '@/components/icons/ShippingIcon.vue'
import ProductVarietyIcon from '@/components/icons/ProductVarietyIcon.vue'
import EasyReturnsIcon from '@/components/icons/EasyReturnsIcon.vue'
import GiftIcon from '@/components/icons/GiftIcon.vue'
import CouponIcon from '@/components/icons/CouponIcon.vue'

defineProps({
  text: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
})
defineEmits(['click'])
</script>

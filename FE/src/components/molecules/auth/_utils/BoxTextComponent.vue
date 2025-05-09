<template>
  <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">
    <h1 class="text-2xl font-bold mb-6">{{ $t('benefits.title') }}</h1>

    <ul class="space-y-4 text-base font-semibold mb-8">
      <li>{{ $t('benefits.shipping') }}</li>
      <li>{{ $t('benefits.productVariety') }}</li>
      <li>{{ $t('benefits.easyReturns') }}</li>
      <li>{{ $t('benefits.rewardPoints') }}</li>
      <li>{{ $t('benefits.coupons') }}</li>
    </ul>

    <button :disabled="disabled"
      class="w-full border border-white text-white hover:bg-[#674833] py-2 rounded-md transition-colors"
      @click="$emit('click')">
      {{ text }}
    </button>
  </div>
</template>

<script setup lang="ts">
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
defineEmits (['click'])
</script>

<template>
  <div class="bg-white py-4">
    <div class="max-w-screen-2xl mx-auto px-4 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-neutral-100 p-3 rounded-full">
            <TruckIcon size="8" class="text-neutral-800" />
          </div>
          <div>
            <h3 class="font-medium text-xl">{{ $t('features.freeShipping.title') }}</h3>
            <p class="text-lg text-gray-500">{{ $t('features.freeShipping.desc') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-neutral-100 p-3 rounded-full">
            <ShieldCheckIcon size="8" class="text-neutral-800" />
          </div>
          <div>
            <h3 class="font-medium text-xl">{{ $t('features.warranty.title') }}</h3>
            <p class="text-lg text-gray-500">{{ $t('features.warranty.desc') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-neutral-100 p-3 rounded-full">
            <CardIcon size="8" class="text-neutral-800" />
          </div>
          <div>
            <h3 class="font-medium text-xl">{{ $t('features.securePayment.title') }}</h3>
            <p class="text-lg text-gray-500">{{ $t('features.securePayment.desc') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-neutral-100 p-3 rounded-full">
            <ClockIcon size="8" class="text-neutral-800" />
          </div>
          <div>
            <h3 class="font-medium text-xl">{{ $t('features.support.title') }}</h3>
            <p class="text-lg text-gray-500">{{ $t('features.support.desc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import TruckIcon from '@/components/icons/TruckIcon.vue'
import ShieldCheckIcon from '@/components/icons/ShieldCheckIcon.vue'
import CardIcon from '@/components/icons/CartIcon.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'

const { t } = useI18n()
</script>

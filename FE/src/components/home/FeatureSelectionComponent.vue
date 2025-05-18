<template>
  <div class="bg-white py-6">
    <hr class="border-gray-300 mb-6" />
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
        <div v-for="(feature, index) in features" :key="index" class="flex items-start gap-4">
          <div class="bg-neutral-100 p-4 rounded-full flex-shrink-0">
            <component :is="feature.icon" size="8" class="text-neutral-800" />
          </div>
          <div>
            <h3 class="font-semibold text-xl sm:text-2xl">
              {{ $t(feature.title) }}
            </h3>
            <p class="text-base sm:text-lg text-gray-500">
              {{ $t(feature.desc) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-gray-300 mt-6" />
  </div>
</template>

<script setup>
import TruckIcon from '@/components/icons/TruckIcon.vue'
import ShieldCheckIcon from '@/components/icons/ShieldCheckIcon.vue'
import CardIcon from '@/components/icons/CartIcon.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const features = [
  { icon: TruckIcon, title: 'features.freeShipping.title', desc: 'features.freeShipping.desc' },
  { icon: ShieldCheckIcon, title: 'features.warranty.title', desc: 'features.warranty.desc' },
  { icon: CardIcon, title: 'features.securePayment.title', desc: 'features.securePayment.desc' },
  { icon: ClockIcon, title: 'features.support.title', desc: 'features.support.desc' }
]
</script>

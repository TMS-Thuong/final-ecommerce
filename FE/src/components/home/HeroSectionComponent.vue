<template>
  <section class="flex flex-col lg:flex-row items-center justify-between py-10 lg:py-20 bg-gray-100 px-4 lg:px-8">
    <div class="flex-1 flex items-center justify-center">
      <div class="max-w-3xl space-y-4 text-left">
        <span class="inline-block bg-neutral-100 text-neutral-600 text-lg font-semibold px-4 py-1 rounded-full shadow">
          {{ $t('common.hero.summerSale') }}
        </span>
        <h1 class="text-3xl lg:text-5xl font-extrabold text-neutral-900 leading-tight">
          {{ $t('common.hero.saveUpTo') }}
        </h1>
        <p class="text-neutral-600 text-xl lg:text-2xl">
          {{ $t('common.hero.discoverLatest') }}
        </p>
        <div class="flex flex-col sm:flex-row text-2xl font-bold space-y-4 sm:space-x-4 sm:space-y-0 pt-4">
          <SubmitButton :text="$t('common.hero.shopNow')"
            class="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg"
            @click="goToProductList" />
          <SubmitButton :text="$t('common.hero.learnMore')"
            class="text-neutral-800 bg-white font-semibold border border-neutral-300 px-6 py-3 rounded-lg hover:bg-neutral-300 transition" />
        </div>
      </div>
    </div>
    <ImageDisplay :src="'src/assets/banner.png'" :minWidth="'100rem'" :height="'40rem'" class="mt-8" />
  </section>
</template>

<script setup lang="ts">
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import ImageDisplay from '@/components/atoms/ImageDisplayComponent.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

function goToProductList() {
  router.push('/products')
}
</script>

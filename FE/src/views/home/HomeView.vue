<template>
  <div class="w-full bg-gray-50">
    <HeroSection />
    <div class="bg-white py-16 text-center my-0">
      <h2 class="text-5xl md:text-4xl font-extrabold mb-4">{{ $t('common.homePage.aboutStore.title') }}</h2>
      <p class="text-gray-600 max-w-4xl mx-auto text-2xl md:text-2xl mb-4">
        {{ $t('common.homePage.aboutStore.description') }}
      </p>
      <FeatureSection />
    </div>

    <div class="bg-white py-16">
      <div class="w-full">
        <h2 class="text-3xl font-bold text-center mb-10">{{ $t('common.homePage.featuredProducts.title') }}</h2>
        <FeaturedProducts :limit="10" :show-featured-only="true" :page="5" />
      </div>
    </div>
    <FooterOrganism />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import FeatureSection from '@/components/home/FeatureSelectionComponent.vue'
import HeroSection from '@/components/home/HeroSectionComponent.vue'
import FooterOrganism from '@/components/footer/FooterOrganismComponent.vue'
import FeaturedProducts from '@/components/home/FeaturedProductsComponent.vue'

const { t } = useI18n();
</script>

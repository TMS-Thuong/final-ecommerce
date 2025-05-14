<template>
  <div class="bg-white w-full">
    <HeroSection />
    <div class="bg-white py-16 text-center my-0">
      <h2 class="text-5xl md:text-4xl font-extrabold mb-4">About Our Store</h2>
      <p class="text-gray-600 max-w-4xl mx-auto text-2xl md:text-2xl mb-4">
        Welcome to H!TMDT – Your Destination for Quality Shopping and Great Deals Every Day! We offer high-quality
        products at affordable prices. Shop with us and enjoy amazing offers every single day!
      </p>
      <FeatureSection />
    </div>

    <div class="bg-white py-16">
      <div class="w-full">
        <h2 class="text-3xl font-bold text-center mb-10">Featured Products</h2>
        <FeaturedProducts :limit="10" :show-featured-only="true" />
      </div>
    </div>
    <FooterOrganism />
  </div>
</template>

<script setup>
import FeatureSection from '@/components/home/FeatureSelectionComponent.vue'
import HeroSection from '@/components/home/HeroSectionComponent.vue'
import FooterOrganism from '@/components/footer/FooterOrganism.vue'
import FeaturedProducts from '@/components/home/FeaturedProductsComponent.vue'
</script>

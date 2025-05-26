<template>
  <router-link :to="`/products/${product.id}`" class="block">
    <div
      class="product-card bg-white rounded-[10px] shadow-2xl hover:shadow-xl overflow-hidden transition-shadow duration-300 hover:scale-105 transition-transform">
      <div class="relative w-full aspect-[4/3] md:aspect-[1/1] bg-white p-2">
        <div v-if="discountPercent > 0"
          class="absolute top-1 left-2 bg-red-500 text-white text-base font-bold rounded-full z-10 w-[25%] h-8 flex items-center justify-center leading-8">
          -{{ discountPercent }}%
        </div>

        <div v-if="isNewProduct" :class="[
          'absolute left-2 bg-blue-500 text-white text-base font-bold rounded-full z-10 w-[25%] h-8 flex items-center justify-center leading-8',
          discountPercent > 0 ? 'top-10' : 'top-1'
        ]">
          {{ $t('product.new') }}
        </div>
        <div :class="{ 'filter blur-[1px]': product.stockQuantity === 0 }" class="w-full h-full relative">
          <div class="w-full h-full relative">
            <div class="h-full w-full flex items-center justify-center">
              <img v-if="thumbnailUrl" :src="thumbnailUrl" :alt="product.name" class="w-full h-full object-contain"
                loading="lazy" />
              <ProductIcon v-else size="10" class="text-gray-400" />
            </div>

            <div v-if="isBestSeller" :class="[
              'absolute left-2 bg-yellow-500 text-white text-base font-bold rounded-full z-10 w-[20%] h-7 flex items-center justify-center',
              discountPercent > 0 && isNewProduct ? 'top-14' :
                discountPercent > 0 ? 'top-10' :
                  isNewProduct ? 'top-10' : 'top-1'
            ]">
              {{ $t('product.bestSeller') }}
            </div>
          </div>
        </div>
        <div v-if="product.stockQuantity === 0"
          class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <span
            class="bg-gray-50 text-red-600 text-base font-bold px-4 py-2 rounded-full border-2 border-red-500 shadow-md">
            {{ $t('product.soldOut') }}
          </span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-2xl font-medium text-gray-900 truncate">{{ product.name }}</h3>
        <div class="mt-1 flex items-center">
          <span class="text-2xl font-bold text-red-500">{{
            formatPrice(product.salePrice || product.basePrice)
            }}</span>
          <span v-if="product.salePrice" class="ml-2 text-xl text-gray-500 line-through">{{
            formatPrice(product.basePrice) }}</span>
        </div>

        <div class="mt-2 flex items-center">
          <StarRating :size="'6'" :rating="product.averageRating || 0" :count="product.ratingCount || 0"
            :readonly="true" />
          <span class="ml-2 text-neutral-600 text-xl">
            {{ (product.averageRating || 0).toFixed(1) }}
          </span>
        </div>

        <div class="mt-2 min-h-[40px] flex items-center">
          <span class="inline-block text-lg px-3 py-1 rounded-full border-1 transition-all duration-200" :class="product.salePrice
            ? 'bg-white text-red-500 border-red-500 visible'
            : 'bg-transparent text-transparent border-transparent invisible'">
            {{ $t('product.discount') }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import StarRating from '@/components/atoms/StarRatingComponent.vue'
import ProductIcon from '@/components/icons/ProductIcon.vue'
import { ProductSchema } from '@/validations/product'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (value) => {
      try {
        ProductSchema.parse(value)
        return true
      } catch (error) {
        console.error('Product validation error:', error.errors)
        return false
      }
    }
  }
})

const thumbnailUrl = ref('')

const discountPercent = computed(() => {
  if (!props.product.salePrice) return 0
  const discount = props.product.basePrice - props.product.salePrice
  return Math.round((discount / props.product.basePrice) * 100)
})

const isNewProduct = computed(() => {
  if (!props.product.createdAt) {
    return props.product.viewCount < 10
  }

  const createdDate = new Date(props.product.createdAt)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return createdDate >= thirtyDaysAgo
})

const isBestSeller = computed(() => {
  return props.product.isBestSeller === true
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

onMounted(() => {
  if (props.product.images && props.product.images.length > 0) {
    const thumbnail = props.product.images.find(img => img.isThumbnail) || props.product.images[0]
    if (thumbnail && thumbnail.imageUrl) {
      thumbnailUrl.value = thumbnail.imageUrl
    }
  }
})
</script>

<style scoped lang="scss">
@use '../../css/_product-card.scss' as *;
</style>

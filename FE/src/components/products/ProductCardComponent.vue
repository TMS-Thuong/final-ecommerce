<template>
  <router-link :to="`/products/${product.id}`" class="block">
    <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div class="relative h-[25rem] overflow-hidden">
        <div class="h-full w-full flex items-center justify-center">
          <img
            v-if="thumbnailUrl"
            :src="thumbnailUrl"
            :alt="product.name"
            class="w-[80%] h-[80%] object-cover"
          />
          <ProductIcon v-else size="15" class="text-gray-400" />
        </div>
        
        <div 
          v-if="product.stockQuantity === 0" 
          class="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center"
        >
          <span class="bg-white text-red-600 text-xl font-bold px-4 py-2 rounded-full border-2 border-red-500 z-20">
            Sold out
          </span>
        </div>
        
        <div v-if="discountPercent > 0" class="absolute top-2 left-2 bg-red-500 text-white text-lg font-bold px-2 py-1 rounded z-10">
          -{{ discountPercent }}%
        </div>
        
        <div v-if="isNewProduct" 
          :class="[
            'absolute bg-green-500 text-white text-lg font-bold px-2 py-1 rounded z-10',
            discountPercent > 0 ? 'top-14 left-2' : 'top-2 left-2'
          ]">
          New
        </div>

        <div v-if="product.soldCount > 50" class="absolute top-2 right-2 bg-blue-500 text-white text-lg font-bold px-2 py-1 rounded z-10">
          Best Seller
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-xl font-medium text-gray-900 truncate">{{ product.name }}</h3>

        <div class="mt-1 flex items-center">
          <span class="text-xl font-bold text-red-500">{{ formatPrice(product.salePrice || product.basePrice) }}</span>
          <span v-if="product.salePrice" class="ml-2 text-base text-gray-500 line-through">{{ formatPrice(product.basePrice) }}</span>
        </div>

        <div class="mt-2">
          <StarRating
            :rating="product.averageRating"
            :count="product.ratingCount"
          />
        </div>

        <div v-if="product.salePrice" class="mt-2">
          <span class="inline-block bg-yellow-100 text-yellow-800 text-xl px-2 py-1 rounded">Discount</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { productApi } from '@/api/product'
import StarRating from '@/components/atoms/StarRatingComponent.vue'
import ProductIcon from '@/components/icons/ProductIcon.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (value) => {
      return value &&
        typeof value.id === 'number' &&
        typeof value.name === 'string' &&
        typeof value.basePrice === 'number' &&
        typeof value.averageRating === 'number' &&
        typeof value.ratingCount === 'number'
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
  return props.product.viewCount < 10
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

onMounted(async () => {
  try {
    const response = await productApi.getProductImages(props.product.id)
    const images = response?.data || []
    const thumbnail = images.find(img => img.isThumbnail) || images[0]
    if (thumbnail) {
      thumbnailUrl.value = thumbnail.imageUrl
    }
  } catch (error) {
    console.error('Failed to load product image:', error)
  }
})
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>
    <div v-else-if="products.length === 0" class="text-center py-8 text-gray-500">
      {{ $t('product.noProducts') }}
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 px-4 sm:px-0">

      <ProductCard v-for="product in products" :key="product.id" :product="product"
        class="h-full shadow-2xl hover:shadow-xl transition-shadow duration-300 rounded-[10px] overflow-hidden hover:scale-105 transition-transform" />
    </div>
    <div v-if="!loading && products.length > 0" class="mt-8 flex justify-center">
      <button v-if="hasMorePages" @click="loadMore"
        class="px-6 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors">
        {{ $t('product.loadMore') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productApi } from '@/api/product'
import ProductCard from '@/components/products/ProductCardComponent.vue'
import { preloadImages } from '@/utils/imageCache'
import { useI18n } from 'vue-i18n'
import type { Product } from '@/types/product'

const { t } = useI18n()

interface ProductResponse {
  data: Product[]
}

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const hasMorePages = ref(false)
const pageSize = 10

const loadProducts = async (page = 1) => {
  loading.value = true
  error.value = ''

  try {
    const response = await productApi.getProducts({
      page,
      pageSize
    }) as ProductResponse

    const newProducts = response?.data || []

    if (page === 1) {
      products.value = newProducts
    } else {
      products.value = [...products.value, ...newProducts]
    }

    hasMorePages.value = newProducts.length === pageSize

    const imageUrls = newProducts
      .filter(product => Array.isArray(product?.images) && product.images.length > 0)
      .map(product => {
        const thumbnail = product.images?.find(img => img.isThumbnail) || product.images?.[0]
        return thumbnail?.imageUrl
      })
      .filter(Boolean)

    preloadImages(imageUrls)
  } catch (err) {
    error.value = t('product.loadError')
    console.error('Error loading products:', err)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  currentPage.value++
  loadProducts(currentPage.value)
}

onMounted(() => {
  loadProducts()
})
</script>

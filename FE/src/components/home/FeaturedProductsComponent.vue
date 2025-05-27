<template>
  <div class="px-8">
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>
    <div v-else-if="products.length === 0" class="text-center py-8 text-gray-500">
      No products found
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 px-4 sm:px-0">
      <ProductCard v-for="product in products" :key="product.id" :product="product"
        class="h-full shadow-2xl hover:shadow-xl transition-shadow duration-300 rounded-[10px] overflow-hidden hover:scale-105 transition-transform" />
    </div>
    <div v-if="!loading && products.length > 0" class="mt-8 flex justify-center">
      <router-link :to="{ name: RouterEnum.ProductList }"
        class="px-6 py-2 text-xl bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors">
        View All Products
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterEnum } from '@/enums/router'
import { productApi } from '@/api/product'
import ProductCard from '@/components/products/ProductCardComponent.vue'

const props = defineProps({
  limit: {
    type: Number,
    default: 8
  },
  showFeaturedOnly: {
    type: Boolean,
    default: false
  },
  page: {
    type: Number,
    default: 1
  }
})


const products = ref([])
const loading = ref(false)
const error = ref('')

const loadFeaturedProducts = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = {
      page: props.page,
      pageSize: props.limit
    }

    if (props.showFeaturedOnly) {
      params.isFeatured = true
    }


    const response = await productApi.getProducts(params)

    products.value = response ? response.data || [] : [];
  } catch (err) {
    error.value = 'Failed to load products. Please try again.'
    console.error('Error loading products:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFeaturedProducts()
})
</script>

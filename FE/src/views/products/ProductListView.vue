<template>
  <div class="py-8 bg-neutral-50 w-full">
    <h1 class="text-4xl font-bold mb-4 text-neutral-800">{{ $t('product.pageTitle') }}</h1>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="w-full md:w-1/4">
        <div class="bg-neutral-50 p-6 rounded-lg shadow mb-6">
          <h2 class="text-2xl font-bold mb-6 text-neutral-800">{{ $t('product.filters.title') }}</h2>
          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.categories.title') }}</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <input type="checkbox" id="cat1" class="mr-3 w-4 h-4 accent-neutral-800" v-model="filters.categories"
                  value="1">
                <label for="cat1" class="text-neutral-700 text-xl">{{ $t('product.filters.categories.phoneAccessories')
                }}</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="cat2" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.categories"
                  value="2">
                <label for="cat2" class="text-neutral-700 text-xl">{{             $t('product.filters.categories.computerAccessories') }}</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="cat3" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.categories"
                  value="3">
                <label for="cat3" class="text-neutral-700 text-xl">{{ $t('product.filters.categories.audio') }}</label>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.priceRange.title') }}</h3>
            <div class="mb-4">
              <input type="range" min="0" max="5000000" v-model="filters.maxPrice"
                class="w-full h-1 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-neutral-600" />
              <div class="flex justify-between text-neutral-600 text-xl mt-2">
                <span>0 đ</span>
                <span>{{ formatPrice(filters.maxPrice) }}</span>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center">
                <input type="radio" id="price1" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.priceRange" value="0-500000">
                <label for="price1" class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.under') }}
                  500.000đ</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="price2" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.priceRange" value="500000-1000000">
                <label for="price2" class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.between') }}
                  500.000đ - 1.000.000đ</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="price3" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.priceRange" value="1000000-2000000">
                <label for="price3" class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.between') }}
                  1.000.000đ - 2.000.000đ</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="price4" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.priceRange" value="2000000-5000000">
                <label for="price4" class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.between') }}
                  2.000.000đ - 5.000.000đ</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="price5" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.priceRange" value="5000000-">
                <label for="price5" class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.above') }}
                  5.000.000đ</label>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.brands.title') }}</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <input type="checkbox" id="brand1" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.brands"
                  value="1">
                <label for="brand1" class="text-neutral-700 text-xl">Apple (2)</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="brand2" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.brands"
                  value="2">
                <label for="brand2" class="text-neutral-700 text-xl">Sony (2)</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="brand3" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.brands"
                  value="3">
                <label for="brand3" class="text-neutral-700 text-xl">Samsung (1)</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="brand4" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.brands"
                  value="4">
                <label for="brand4" class="text-neutral-700 text-xl">JBL (1)</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="brand5" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.brands"
                  value="5">
                <label for="brand5" class="text-neutral-700 text-xl">Anker (2)</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="brand6" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.brands"
                  value="6">
                <label for="brand6" class="text-neutral-700 text-xl">Logitech (3)</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="brand7" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.brands"
                  value="7">
                <label for="brand7" class="text-neutral-700 text-xl">Razer (1)</label>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.rating.title') }}</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <input type="radio" id="rating5" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.rating" value="5">
                <label for="rating5" class="flex items-center">
                  <StarRating :rating="5" :showCount="false" /> <span class="ml-2 text-neutral-700 text-xl">{{
                    $t('product.filters.rating.andAbove') }}</span>
                </label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="rating4" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.rating" value="4">
                <label for="rating4" class="flex items-center">
                  <StarRating :rating="4" :showCount="false" /> <span class="ml-2 text-neutral-700 text-xl">{{
                    $t('product.filters.rating.andAbove') }}</span>
                </label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="rating3" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.rating" value="3">
                <label for="rating3" class="flex items-center">
                  <StarRating :rating="3" :showCount="false" /> <span class="ml-2 text-neutral-700 text-xl">{{
                    $t('product.filters.rating.andAbove') }}</span>
                </label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="rating2" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.rating" value="2">
                <label for="rating2" class="flex items-center">
                  <StarRating :rating="2" :showCount="false" /> <span class="ml-2 text-neutral-700 text-xl">{{
                    $t('product.filters.rating.andAbove') }}</span>
                </label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="rating1" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="filters.rating" value="1">
                <label for="rating1" class="flex items-center">
                  <StarRating :rating="1" :showCount="false" /> <span class="ml-2 text-neutral-700 text-xl">{{
                    $t('product.filters.rating.andAbove') }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.stock.title') }}</h3>
            <div class="flex items-center">
              <input type="checkbox" id="inStock" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.inStock">
              <label for="inStock" class="text-neutral-700 text-xl">{{ $t('product.filters.stock.inStockOnly')
              }}</label>
            </div>
          </div>

          <div>
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.promotion.title') }}</h3>
            <div class="flex items-center">
              <input type="checkbox" id="onSale" class="mr-3 w-4 h-4 accent-neutral-600" v-model="filters.onSale">
              <label for="onSale" class="text-neutral-700 text-xl">{{ $t('product.filters.promotion.onSaleOnly')
              }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full md:w-3/4">
        <div class="bg-neutral-50 p-4 rounded-lg shadow mb-6 flex justify-between items-center flex-wrap gap-4">
          <div class="flex items-center">
            <span class="mr-2 text-xl text-neutral-700">{{ $t('product.sort.title') }}:</span>
            <select v-model="sortOption" ref="selectRef" @change="adjustWidth"
              class="border border-neutral-300 rounded-lg p-2 pr-10 text-xl text-neutral-700 appearance-none focus:ring-neutral-500 focus:border-neutral-500">
              <option value="newest">{{ $t('product.sort.newest') }}</option>
              <option value="priceAsc">{{ $t('product.sort.priceLowToHigh') }}</option>
              <option value="priceDesc">{{ $t('product.sort.priceHighToLow') }}</option>
              <option value="rating">{{ $t('product.sort.topRated') }}</option>
            </select>
          </div>
          <div>
            <SearchInputComponent v-model="searchQuery" :placeholder="$t('product.search.placeholder')" width="w-full"
              @search="handleSearch" inputClass="border-neutral-300 focus:ring-neutral-500 focus:border-neutral-500" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" class="h-full" />
        </div>

        <div v-if="!loading && filteredProducts.length > 0" class="mt-8 flex justify-center">
          <button v-if="hasMorePages" @click="loadMore"
            class="px-6 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors text-xl">
            {{ $t('product.loadMore') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { productApi } from '@/api/product'
import ProductCard from '@/components/products/ProductCardComponent.vue'
import StarRating from '@/components/atoms/StarRatingComponent.vue'
import SearchInputComponent from '@/components/molecules/utils/SearchInputComponent.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const products = ref([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const hasMorePages = ref(false)
const pageSize = 8
const totalProducts = ref(0)

const filters = ref({
  categories: [],
  brands: [],
  priceRange: '',
  maxPrice: 5000000,
  rating: '',
  inStock: false,
  onSale: false
})

const searchQuery = ref('')
const sortOption = ref('newest')

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product => product.name.toLowerCase().includes(query))
  }

  if (filters.value.categories.length > 0) {
    result = result.filter(product => filters.value.categories.includes(String(product.categoryId)))
  }

  if (filters.value.brands.length > 0) {
    result = result.filter(product => filters.value.brands.includes(String(product.brandId)))
  }

  if (filters.value.priceRange) {
    const [min, max] = filters.value.priceRange.split('-').map(Number)
    if (max) {
      result = result.filter(product => product.basePrice >= min && product.basePrice <= max)
    } else {
      result = result.filter(product => product.basePrice >= min)
    }
  }

  if (filters.value.rating) {
    const minRating = Number(filters.value.rating)
    result = result.filter(product => product.averageRating >= minRating)
  }

  if (filters.value.inStock) {
    result = result.filter(product => product.stockQuantity > 0)
  }

  if (filters.value.onSale) {
    result = result.filter(product => product.salePrice !== null && product.salePrice > 0)
  }

  switch (sortOption.value) {
    case 'priceAsc':
      result.sort((a, b) => a.basePrice - b.basePrice)
      break
    case 'priceDesc':
      result.sort((a, b) => b.basePrice - a.basePrice)
      break
    case 'rating':
      result.sort((a, b) => b.averageRating - a.averageRating)
      break
    case 'newest':
    default:
      break
  }

  return result
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1

  if (!query || query.trim() === '') {
    loadProducts()
  } else {
    loadProducts()
  }
}

const loadProducts = async (page = 1) => {
  loading.value = true
  error.value = ''

  try {
    const response = await productApi.getProducts({
      page,
      pageSize
    })

    const newProducts = response?.data || []
    totalProducts.value = newProducts.length + products.value.length

    if (page === 1) {
      products.value = newProducts
    } else {
      products.value = [...products.value, ...newProducts]
    }

    hasMorePages.value = newProducts.length === pageSize
  } catch (err) {
    error.value = 'Failed to load products. Please try again.'
    console.error('Error loading products:', err)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  currentPage.value++
  loadProducts(currentPage.value)
}

watch([filters, sortOption], () => {
  currentPage.value = 1
  loadProducts()
}, { deep: true })

onMounted(() => {
  loadProducts()
})
</script>

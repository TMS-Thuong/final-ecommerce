<template>
  <div class="py-6">
    <div class="mx-auto px-[16rem] mb-4">
      <div class="flex text-xl">
        <router-link to="/" class="text-gray-500 hover:text-gray-700">{{ $t('common.home') }}</router-link>
        <span class="mx-2 text-gray-400">/</span>
        <router-link to="/products" class="text-gray-500 hover:text-gray-700">{{ $t('common.products') }}</router-link>
        <span v-if="product" class="mx-2 text-gray-400">/</span>
        <span v-if="product" class="text-gray-900 font-medium">{{ product.name }}</span>
      </div>
    </div>

    <div v-if="loading" class="mx-auto px-[16rem] py-12 flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800"></div>
    </div>

    <div v-else-if="error" class="mx-auto px-[16rem] py-12">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
    </div>

    <div v-else-if="product" class="mx-auto px-[16rem]">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-1/2">
          <ProductImageGallery
            :images="product.images || []"
            :thumbnailIndex="currentImageIndex"
            @select-image="selectImage"
            @next-image="nextImage"
            @prev-image="prevImage"
          />
        </div>

        <div class="w-full lg:w-1/2">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>

          <div class="flex items-center mb-4">
            <StarRating :size="'8'" :rating="product.averageRating || 0" :count="product.ratingCount || 0" :readonly="true" />
            <span class="ml-2 text-gray-500">{{ product.averageRating || 0 }} ({{ product.ratingCount || 0 }} {{ $t('product.detail.reviews').toLowerCase() }})</span>
          </div>

          <div class="mb-6">
            <div class="flex items-center">
              <span class="text-2xl font-bold text-red-600">{{ formatPrice(product.salePrice || product.basePrice) }}</span>
              <span v-if="product.salePrice" class="ml-2 text-xl text-gray-500 line-through">{{ formatPrice(product.basePrice) }}</span>
              <span v-if="discountPercent > 0" class="ml-3 bg-red-100 text-red-800 text-lg font-semibold px-2 py-1 rounded">
                {{ $t('product.detail.discount', { percent: discountPercent }) }}
              </span>
            </div>
          </div>

          <div class="mb-4 text-xl">
            <span class="font-semibold text-gray-700">{{ $t('product.detail.sku') }}:</span>
            <span class="ml-2 text-gray-900">{{ product.sku }}</span>
          </div>

          <div class="mb-4 text-xl">
            <span class="font-semibold text-gray-700">{{ $t('product.detail.brand') }}:</span>
            <span v-if="brandData" class="ml-2 text-blue-600">{{ brandData.name.toUpperCase() }}</span>
            <span v-else class="ml-2 text-blue-600">{{ product.brand?.name }}</span>
          </div>

          <div class="mb-4 text-xl">
            <span class="font-semibold text-gray-700">{{ $t('product.detail.category') }}:</span>
            <span v-if="categoryData" class="ml-2 text-gray-900">{{ categoryData.name }}</span>
            <span v-else class="ml-2 text-gray-900">{{ product.category?.name }}</span>
          </div>

          <div class="mb-6 text-xl">
            <span class="font-semibold text-gray-700">{{ $t('product.detail.stock.status') }}:</span>
            <span class="ml-2 inline-block px-2 py-1 rounded" :class="[
              product.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              {{ product.stockQuantity > 0 ? $t('product.detail.stock.inStock') : $t('product.detail.stock.outOfStock') }}
            </span>
          </div>
          <div class="mb-6 text-xl">
            <div class="flex items-center">
              <span class="mr-4 font-semibold text-gray-700">{{ $t('product.detail.quantity') }}:</span>
              <div class="flex items-center border border-gray-300 rounded-md">
                <button
                  @click="decrementQuantity"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  :disabled="quantity <= 1 || product.stockQuantity <= 0"
                >
                  -
                </button>
                <div class="w-12 py-1 text-center border-x border-gray-300">
                  {{ quantity }}
                </div>
                <button
                  @click="incrementQuantity"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  :disabled="quantity >= product.stockQuantity || product.stockQuantity <= 0"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="flex space-x-4 mb-8">
            <button
              @click="addToCart"
              class="px-6 py-3 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition w-full flex items-center justify-center"
              :disabled="product.stockQuantity <= 0"
              :class="{'opacity-50 cursor-not-allowed': product.stockQuantity <= 0}"
            >
              <CartIcon size="5" class="mr-2" />
              {{ $t('product.detail.addToCart') }}
            </button>
            <button class="p-3 border border-gray-300 rounded-md hover:bg-gray-100">
              <HeartIcon size="5" class="text-gray-700" />
            </button>
            <button class="p-3 border border-gray-300 rounded-md hover:bg-gray-100">
              <ShareIcon size="5" class="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <div class="border-b border-gray-200 text-xl">
          <nav class="flex space-x-8">
            <button class="py-4 px-1 border-b-2 border-neutral-800 font-medium text-neutral-800">
              {{ $t('product.tabs.description') }}
            </button>
            <button class="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              {{ $t('product.tabs.specifications') }}
            </button>
            <button class="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              {{ $t('product.tabs.reviews') }} ({{ product.ratingCount || 0 }})
            </button>
          </nav>
        </div>

        <div class="py-6 prose max-w-none text-gray-700 text-lg">
          <div v-if="product.description" class="text-justify" v-html="product.description"></div>
          <div v-else class="text-justify text-gray-500">{{ $t('product.detail.updating') }}</div>
          <div v-if="product.features && product.features.length > 0" class="mt-8">
            <h3 class="text-xl font-semibold mb-4">{{ $t('product.detail.features') }}</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li v-for="(feature, index) in product.features" :key="index" class="text-gray-700">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { productApi } from '@/api/product'
import { categoryApi } from '@/api/category'
import { brandApi } from '@/api/brand'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'
import StarRating from '@/components/atoms/StarRatingComponent.vue'
import ProductImageGallery from '@/components/products/ProductImageGalleryComponent.vue'
import CartIcon from '@/components/icons/CartIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import ShareIcon from '@/components/icons/ShareIcon.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { showToast } = useToast()
const cartStore = useCartStore()
const productId = computed(() => Number(route.params.id))

const product = ref(null)
const loading = ref(true)
const error = ref('')
const quantity = ref(1)
const currentImageIndex = ref(0)
const categoryData = ref(null)
const brandData = ref(null)

const discountPercent = computed(() => {
  if (!product.value || !product.value.salePrice) return 0
  const discount = product.value.basePrice - product.value.salePrice
  return Math.round((discount / product.value.basePrice) * 100)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const incrementQuantity = () => {
  if (quantity.value < product.value.stockQuantity) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const selectImage = (index) => {
  currentImageIndex.value = index
}

const nextImage = () => {
  if (product.value.images && product.value.images.length <= 1) return
  currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length
}

const prevImage = () => {
  if (product.value.images && product.value.images.length <= 1) return
  currentImageIndex.value = (currentImageIndex.value - 1 + product.value.images.length) % product.value.images.length
}

const addToCart = async () => {
  if (!product.value || product.value.stockQuantity <= 0) {
    return
  }

  try {
    loading.value = true

    if (!localStorage.getItem('accessToken')) {
      router.push({ name: 'Login', query: { redirect: route.fullPath } });
      return;
    }

    await cartStore.addItem(product.value.id, quantity.value);

    showToast(ToastEnum.Success, t('product.detail.addedToCart', { quantity: quantity.value, name: product.value.name }));
    quantity.value = 1;
  } catch (err) {
    if (err.response?.data?.message === 'PRODUCT_NOT_FOUND') {
      showToast(ToastEnum.Error, t('product.detail.productNotFound'));
    } else if (err.response?.data?.message === 'INSUFFICIENT_STOCK') {
      showToast(ToastEnum.Error, t('product.detail.insufficientStock'));
    } else {
      showToast(ToastEnum.Error, t('product.detail.addToCartError'));
    }
  } finally {
    loading.value = false;
  }
}

const loadCategoryData = async (categoryId) => {
  if (!categoryId) return

  try {
    const response = await categoryApi.getCategoryById(categoryId)
    categoryData.value = response.data
  } catch (err) {
    error.value = t('common.error')
  }
}

const loadBrandData = async (brandId) => {
  if (!brandId) return

  try {
    const response = await brandApi.getBrandById(brandId)
    brandData.value = response.data
  } catch (err) {
    error.value = t('common.error')
  }
}

const loadProductData = async () => {
  loading.value = true
  error.value = ''

  try {
    const productResponse = await productApi.getProductById(productId.value)
    product.value = productResponse.data

    if (product.value.categoryId) {
      loadCategoryData(product.value.categoryId)
    }

    if (product.value.brandId) {
      loadBrandData(product.value.brandId)
    }

  } catch (err) {
    error.value = t('common.error')
  } finally {
    loading.value = false
  }
}

watch(() => cartStore.totalItems, (newCount, oldCount) => {
})

onMounted(() => {
  loadProductData()
})
</script>

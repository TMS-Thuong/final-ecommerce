<template>
  <div class="py-4 sm:py-6">
    <div class="mx-auto px-4 sm:px-8 md:px-16 lg:px-[16rem] mb-2 sm:mb-4">
      <div class="flex flex-wrap text-base sm:text-lg md:text-xl">
        <router-link to="/" class="text-gray-500 hover:text-gray-700">{{ $t('common.home') }}</router-link>
        <span class="mx-1 sm:mx-2 text-gray-400">/</span>
        <router-link to="/products" class="text-gray-500 hover:text-gray-700">{{ $t('common.products') }}</router-link>
        <span v-if="product" class="mx-1 sm:mx-2 text-gray-400">/</span>
        <span v-if="product" class="text-gray-900 font-medium">{{ product.name }}</span>
      </div>
    </div>

    <div v-if="error" class="mx-auto px-4 sm:px-8 md:px-16 lg:px-[16rem] py-8 sm:py-12">
      <div class="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded">
        {{ error }}
      </div>
    </div>

    <div v-else-if="product" class="mx-auto px-4 sm:px-8 md:px-16 lg:px-[16rem]">
      <div class="flex flex-col lg:flex-row gap-4 sm:gap-8">
        <div class="w-full lg:w-1/2">
          <ProductImageGallery :images="product.images || []" :thumbnailIndex="currentImageIndex"
            @select-image="selectImage" @next-image="nextImage" @prev-image="prevImage" />
        </div>

        <div class="w-full lg:w-1/2">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">{{ product.name }}</h1>

          <div class="flex flex-wrap items-center mb-2 text-xl">
            <StarRating :size="'8'" :rating="product.averageRating || 0" :count="product.ratingCount || 0"
              :readonly="true" />
            <span class="ml-1 sm:ml-2 text-gray-500 ">{{ product.averageRating || 0 }} ({{ product.ratingCount || 0 }}
              {{ $t('product.detail.reviews').toLowerCase() }})</span>
          </div>

          <div class="mb-4 sm:mb-6">
            <div class="flex flex-wrap items-center">
              <span class="text-xl sm:text-2xl font-bold text-red-600">{{ formatPrice(product.salePrice ||
                product.basePrice) }}</span>
              <span v-if="product.salePrice" class="ml-1 sm:ml-2 text-base sm:text-xl text-gray-500 line-through">{{
                formatPrice(product.basePrice) }}</span>
              <span v-if="discountPercent > 0"
                class="ml-2 sm:ml-3 bg-red-100 text-red-800 text-base sm:text-lg font-semibold px-2 py-1 rounded">
                {{ $t('product.detail.discount', { percent: discountPercent }) }}
              </span>
            </div>
          </div>

          <div class="mb-2 sm:mb-4 text-base sm:text-xl">
            <span class="font-semibold text-gray-700">{{ $t('product.detail.sku') }}:</span>
            <span class="ml-1 sm:ml-2 text-gray-900">{{ product.sku }}</span>
          </div>

          <div class="mb-2 sm:mb-4 text-base sm:text-xl">
            <span class="font-semibold text-gray-700">{{ $t('product.detail.brand') }}:</span>
            <span v-if="brandData" class="ml-1 sm:ml-2 text-blue-600">{{ brandData.name.toUpperCase() }}</span>
            <span v-else class="ml-1 sm:ml-2 text-blue-600">{{ product.brand?.name }}</span>
          </div>

          <div class="mb-2 sm:mb-4 text-base sm:text-xl">
            <span class="font-semibold text-gray-700">{{ $t('product.detail.category') }}:</span>
            <span v-if="categoryData" class="ml-1 sm:ml-2 text-gray-900">{{ categoryData.name }}</span>
            <span v-else class="ml-1 sm:ml-2 text-gray-900">{{ product.category?.name }}</span>
          </div>

          <div class="mb-4 sm:mb-6 text-base sm:text-xl">
            <span class="font-semibold text-gray-700">{{ $t('product.detail.stock.status') }}:</span>
            <span class="ml-1 sm:ml-2 inline-block px-2 py-1 rounded" :class="[
              product.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              {{ product.stockQuantity > 0 ? $t('product.detail.stock.inStock') : $t('product.detail.stock.outOfStock')
              }}
            </span>
          </div>
          <div class="mb-4 sm:mb-6 text-base sm:text-xl">
            <div class="flex flex-wrap items-center">
              <span class="mr-2 sm:mr-4 font-semibold text-gray-700">{{ $t('product.detail.quantity') }}:</span>
              <div class="flex items-center border border-gray-300 rounded-md">
                <button @click="decrementQuantity"
                  class="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  :disabled="quantity <= 1 || product.stockQuantity <= 0">
                  -
                </button>
                <div class="w-10 sm:w-12 py-1 text-center border-x border-gray-300">
                  <input type="number" v-model="quantity" min="1"
                    class="w-full text-center border-0 hover:border-0 focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    @input="onQuantityInput" />
                </div>
                <button @click="incrementQuantity"
                  class="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  :disabled="quantity >= product.stockQuantity || product.stockQuantity <= 0">
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="flex space-x-2 sm:space-x-4 mb-6 sm:mb-8">
            <button @click="addToCart"
              class="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-neutral-800 text-lg text-white rounded-md hover:bg-neutral-700 transition flex items-center justify-center"
              :disabled="product.stockQuantity <= 0 || loading"
              :class="{ 'opacity-50 cursor-not-allowed': product.stockQuantity <= 0 || loading }">
              <CartIcon size="8" class="mr-2" />
              <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ $t('product.detail.addToCart') }}
            </button>
            <button
              class="p-2 sm:p-3 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center"
              @click="inWishlist" :disabled="isWishlistLoading">
              <HeartIcon fillColor="currentColor"
                :customClass="isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-gray-100'" size="8" />
            </button>
            <button
              class="p-2 sm:p-3 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center">
              <ShareIcon size="8" class="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 sm:mt-12">
        <div class="border-b border-gray-200 text-base sm:text-xl">
          <nav class="flex flex-wrap space-x-4 sm:space-x-8">
            <button
              :class="['py-2 sm:py-4 px-1 border-b-2 font-medium', tab === 'description' ? 'border-neutral-800 text-neutral-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
              @click="handleTabClick('description')">
              {{ $t('product.tabs.description') }}
            </button>
            <button
              :class="['py-2 sm:py-4 px-1 border-b-2 font-medium', tab === 'specifications' ? 'border-neutral-800 text-neutral-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
              @click="handleTabClick('specifications')">
              {{ $t('product.tabs.specifications') }}
            </button>
            <button
              :class="['py-2 sm:py-4 px-1 border-b-2 font-medium', tab === 'reviews' ? 'border-neutral-800 text-neutral-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
              @click="handleTabClick('reviews')">
              {{ $t('product.tabs.reviews') }} ({{ product.ratingCount || 0 }})
            </button>
          </nav>
        </div>

        <div v-if="tab === 'description'" class="py-4 sm:py-6 prose max-w-none text-gray-700 text-base sm:text-lg">
          <div v-if="product.description" class="text-justify text-xl prose"
            v-html="formatDescription(product.description)"></div>
          <div v-else class="text-justify text-gray-500">{{ $t('product.detail.updating') }}</div>
          <div v-if="product.features && product.features.length > 0" class="mt-6 sm:mt-8">
            <h3 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">{{ $t('product.detail.features') }}</h3>
            <ul class="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
              <li v-for="(feature, index) in product.features" :key="index" class="text-gray-700">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
        <div v-else-if="tab === 'specifications'"
          class="py-4 sm:py-6 prose max-w-none text-gray-700 text-base sm:text-lg">
          <div v-if="specificationsLoading">Loading...</div>
          <table v-else-if="specificationsData && specificationsData.attributes && specificationsData.attributes.length"
            class="w-full text-xl">
            <tbody>
              <tr v-for="(value, key, idx) in specificationsData.attributes[0].value" :key="key"
                :class="{ 'border-b border-gray-200': idx < Object.keys(specificationsData.attributes[0].value).length - 1 }">
                <td class="font-semibold pr-6 align-top py-3 w-1/3">
                  <span v-if="key.includes('-')">
                    {{ key.split('-')[0] }}<br />- {{ key.split('-').slice(1).join('-').trim() }}
                  </span>
                  <span v-else>{{ key }}</span>
                </td>
                <td class="py-3 align-top">
                  <template v-if="typeof value === 'string' && value.includes('-')">
                    <div v-for="(item, i) in value.split(/\s*-\s+/).filter(Boolean)" :key="i">
                      - {{ item.trim() }}
                    </div>
                  </template>
                  <template v-else>{{ value }}</template>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else>Không có thông số kỹ thuật</div>
        </div>
        <div v-else-if="tab === 'reviews'" class="py-4 sm:py-6">
          <div v-if="loadingReviews">Loading evaluation ...</div>
          <div v-else-if="errorReviews" class="text-red-500">{{ errorReviews }}</div>
          <div v-else>
            <div v-if="reviews.length === 0" class="text-gray-500 text-lg">No evaluation for this product.</div>
            <div v-else>
              <div v-for="review in reviews" :key="review.id" class="bg-white rounded-lg shadow p-4 mb-4">
                <div class="flex items-center mb-2">
                  <img v-if="review.user?.avatarUrl" :src="review.user.avatarUrl"
                    class="w-10 h-10 rounded-full object-cover mr-3" />
                  <div v-else
                    class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 mr-3">
                    {{ (review.user?.firstName?.[0] || 'U') }}
                  </div>
                  <div class="text-xl">
                    <div class="font-semibold">{{ review.user?.firstName }} {{ review.user?.lastName }}</div>
                    <div class="flex items-center space-x-2">
                      <StarRating :size="'6'" :rating="review.rating" :readonly="true" />
                      <span class="font-medium">{{ review.rating }}</span>
                      <span class="text-gray-400 ml-2">{{ new Date(review.createdAt).toLocaleDateString('vi-VN')
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="font-bold text-xl mb-1">{{ review.title }}</div>
                <div class="mb-2 text-lg">{{ review.comment }}</div>
                <div class="flex space-x-2 mt-2">
                  <img v-for="img in review.images" :key="img.id" :src="img.imageUrl"
                    class="w-16 h-16 object-cover rounded bg-gray-100 cursor-zoom-in"
                    @click="handleZoomImage(img.imageUrl)" />
                </div>
              </div>
            </div>
            <div v-if="zoomImageUrl" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div @click.self="closeZoom" class="flex items-center justify-center w-full h-full">
                <img :src="zoomImageUrl" class="max-w-[100vw] max-h-[95vh] rounded shadow-lg bg-white p-6" />
                <button @click="closeZoom" class="absolute top-4 right-4 text-white text-3xl font-bold">&times;</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { productApi } from '@/api/product'
import { categoryApi } from '@/api/category'
import { brandApi } from '@/api/brand'
import { useCartStore } from '@/stores/cart/cart'
import { useWishlistStore } from '@/stores/wishlist/wishlist'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'
import StarRating from '@/components/atoms/StarRatingComponent.vue'
import ProductImageGallery from '@/components/molecules/products/ProductImageGalleryComponent.vue'
import CartIcon from '@/components/icons/CartIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import ShareIcon from '@/components/icons/ShareIcon.vue'
import { reviewApi } from '@/api/review'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { showToast } = useToast()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productId = computed(() => Number(route.params.id))

const product = ref(null)
const loading = ref(true)
const error = ref('')
const quantity = ref(1)
const currentImageIndex = ref(0)
const categoryData = ref(null)
const brandData = ref(null)
const isWishlistLoading = ref(false)
const isInWishlist = computed(() => wishlistStore.isInWishlist(productId.value))
const tab = ref('description')
const reviews = ref([])
const loadingReviews = ref(false)
const errorReviews = ref('')
const zoomImageUrl = ref(null)
const zoomImageIndex = ref(null)
const specificationsLoading = ref(false)
const specificationsData = ref(null)

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
    const msg = err?.response?.data?.message || err?.response?.data?.code || t('product.detail.addToCartError');
    showToast(ToastEnum.Error, msg);
  } finally {
    loading.value = false;
  }
}

const inWishlist = async () => {
  if (isWishlistLoading.value) return;
  isWishlistLoading.value = true;
  try {
    if (isInWishlist.value) {
      await wishlistStore.removeFromWishlist(productId.value)
      showToast(ToastEnum.Success, t('wishlist.messages.removed'))
    } else {
      await wishlistStore.addToWishlist(productId.value)
      showToast(ToastEnum.Success, t('wishlist.messages.addedToWishlist'))
    }
  } catch (e) {
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.response?.data?.code ||
      (typeof e?.response?.data === 'string' ? e.response.data : '') ||
      e?.message ||
      t('wishlist.errors.addToWishlistFailed');
    showToast(ToastEnum.Error, msg)
  } finally {
    isWishlistLoading.value = false;
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

const formatDescription = (desc) => {
  if (!desc) return '';
  const sentences = desc.match(/[^.?!]+[.?!]+/g) || [desc];
  let paragraphs = [];
  let temp = '';
  for (let i = 0; i < sentences.length; i++) {
    temp += sentences[i].trim() + ' ';
    if ((i + 1) % 2 === 0) {
      paragraphs.push(temp.trim());
      temp = '';
    }
  }
  if (temp.trim()) paragraphs.push(temp.trim());
  return paragraphs.map(p => `<p>${p}</p>`).join('');
};

const loadReviews = async () => {
  loadingReviews.value = true
  errorReviews.value = ''
  try {
    const res = await reviewApi.getProductReviews(productId.value)
    reviews.value = Array.isArray(res.data?.reviews) ? [...res.data.reviews] : []
  } catch (e) {
    errorReviews.value = 'Không thể tải đánh giá sản phẩm'
  } finally {
    loadingReviews.value = false
  }
}

const handleTabClick = async (selectedTab) => {
  tab.value = selectedTab
  if (selectedTab === 'reviews') {
    loadReviews()
  }
  if (selectedTab === 'specifications' && !specificationsData.value) {
    specificationsLoading.value = true
    try {
      const res = await productApi.getProductById(productId.value)
      specificationsData.value = res.data
    } finally {
      specificationsLoading.value = false
    }
  }
}

const handleZoomImage = (url) => {
  zoomImageUrl.value = url
  if (product.value && product.value.images) {
    zoomImageIndex.value = product.value.images.findIndex(img => img.imageUrl === url)
  } else {
    zoomImageIndex.value = null
  }
}

const closeZoom = () => {
  zoomImageUrl.value = null
  zoomImageIndex.value = null
}

const prevZoomImage = () => {
  if (!product.value || !product.value.images || zoomImageIndex.value === null) return
  const total = product.value.images.length
  zoomImageIndex.value = (zoomImageIndex.value - 1 + total) % total
  zoomImageUrl.value = product.value.images[zoomImageIndex.value].imageUrl
}

const nextZoomImage = () => {
  if (!product.value || !product.value.images || zoomImageIndex.value === null) return
  const total = product.value.images.length
  zoomImageIndex.value = (zoomImageIndex.value + 1) % total
  zoomImageUrl.value = product.value.images[zoomImageIndex.value].imageUrl
}

const handleKeydown = (e) => {
  if (!zoomImageUrl.value) return
  if (e.key === 'Escape') {
    closeZoom()
  } else if (e.key === 'ArrowLeft' && zoomImageIndex.value !== null) {
    prevZoomImage()
  } else if (e.key === 'ArrowRight' && zoomImageIndex.value !== null) {
    nextZoomImage()
  }
}

watch(zoomImageUrl, (val) => {
  if (val) {
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
})

const onQuantityInput = (e) => {
  const input = e.target;
  let value = input.value;

  if (value === '') {
    quantity.value = '';
    return;
  }

  value = parseInt(value);
  if (isNaN(value) || value < 1) {
    value = 1;
  } else if (product.value && value > product.value.stockQuantity) {
    value = product.value.stockQuantity;
  }
  quantity.value = value;
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadProductData()
  if (localStorage.getItem('accessToken')) {
    wishlistStore.initWishlist()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

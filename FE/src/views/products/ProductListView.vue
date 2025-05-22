<template>
  <div class="py-8 bg-gray-50 w-full">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="w-full md:w-1/5">
        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-neutral-800">{{ $t('product.filters.title') }}</h2>
            <button @click="resetFilters" class="text-blue-600 hover:text-neutral-800 text-lg font-medium">
              {{ $t('product.filters.reset') }}
            </button>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.categories.title') }}</h3>
            <FilterDropdown v-model="tempFilters.categories" :options="categoryOptions"
              :title="$t('product.filters.categories.title')" :loading="categoriesLoading" />
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.priceRange.title') }}</h3>
            <div class="mb-4">
              <input type="range" min="0" max="5000000" step="10000" v-model="tempFilters.maxPrice"
                class="w-full h-1 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-neutral-600 outline-none border-none" />
              <div class="flex justify-between text-neutral-600 text-xl mt-2">
                <span>0 đ</span>
                <span>{{ formatPrice(tempFilters.maxPrice) }}</span>
              </div>
            </div>
            <div class="space-y-3">
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setPriceRange('0-500000')">
                <input type="radio" id="price1" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.priceRange" value="0-500000">
                <span class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.under') }}
                  500.000đ</span>
              </label>
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setPriceRange('500000-1000000')">
                <input type="radio" id="price2" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.priceRange" value="500000-1000000">
                <span class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.between') }}
                  500.000đ - 1.000.000đ</span>
              </label>
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setPriceRange('1000000-2000000')">
                <input type="radio" id="price3" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.priceRange" value="1000000-2000000">
                <span class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.between') }}
                  1.000.000đ - 2.000.000đ</span>
              </label>
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setPriceRange('2000000-5000000')">
                <input type="radio" id="price4" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.priceRange" value="2000000-5000000">
                <span class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.between') }}
                  2.000.000đ - 5.000.000đ</span>
              </label>
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setPriceRange('5000000-')">
                <input type="radio" id="price5" name="price" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.priceRange" value="5000000-">
                <span class="text-neutral-700 text-xl">{{ $t('product.filters.priceRange.above') }}
                  5.000.000đ</span>
              </label>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.brands.title') }}</h3>
            <FilterDropdown v-model="tempFilters.brands" :options="brandOptions"
              :title="$t('product.filters.brands.title')" :loading="brandsLoading" />
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.rating.title') }}</h3>
            <div class="space-y-3">
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setRating('5')">
                <input type="radio" id="rating5" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.rating" value="5">
                <div class="flex items-center">
                  <StarRating :rating="5" :showCount="false" :readonly="true" /> <span
                    class="ml-2 text-neutral-700 text-xl">and above</span>
                </div>
              </label>
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setRating('4')">
                <input type="radio" id="rating4" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.rating" value="4">
                <div class="flex items-center">
                  <StarRating :rating="4" :showCount="false" :readonly="true" />
                  <span class="ml-2 text-neutral-700 text-xl">and above</span>
                </div>
              </label>
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setRating('3')">
                <input type="radio" id="rating3" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.rating" value="3">
                <div class="flex items-center">
                  <StarRating :rating="3" :showCount="false" :readonly="true" /> <span
                    class="ml-2 text-neutral-700 text-xl">and above</span>
                </div>
              </label>
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setRating('2')">
                <input type="radio" id="rating2" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.rating" value="2">
                <div class="flex items-center">
                  <StarRating :rating="2" :showCount="false" :readonly="true" /> <span
                    class="ml-2 text-neutral-700 text-xl">and above</span>
                </div>
              </label>
              <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                @click="setRating('1')">
                <input type="radio" id="rating1" name="rating" class="mr-3 w-4 h-4 accent-neutral-600"
                  v-model="tempFilters.rating" value="1">
                <div class="flex items-center">
                  <StarRating :rating="1" :showCount="false" :readonly="true" />
                  <span class="ml-2 text-neutral-700 text-xl">and above</span>
                </div>
              </label>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.stock.title') }}</h3>
            <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer">
              <input type="checkbox" id="inStock" class="mr-3 w-4 h-4 accent-neutral-600" v-model="tempFilters.inStock">
              <span class="text-neutral-700 text-xl">{{ $t('product.filters.stock.inStockOnly') }}</span>
            </label>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.promotion.title') }}</h3>
            <label class="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer">
              <input type="checkbox" id="onSale" class="mr-3 w-4 h-4 accent-neutral-600" v-model="tempFilters.onSale">
              <span class="text-neutral-700 text-xl">{{ $t('product.filters.promotion.onSaleOnly') }}</span>
            </label>
          </div>

          <div class="mt-8">
            <button @click="applyFilters"
              class="w-full flex justify-center items-center gap-2 py-2.5 mt-2 bg-neutral-800 hover:bg-neutral-900 text-white font-semibold rounded-lg transition disabled:opacity-60">
              {{ $t('product.filters.apply') }} </button>
          </div>
        </div>
      </div>

      <div class="w-full md:w-4/5 mr-6">
        <div class="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center flex-wrap gap-4">
          <div class="flex items-center">
            <span class="mr-4 text-xl text-neutral-700">{{ $t('product.sort.title') }}:</span>
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
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product"
            class="product-card h-full" />
        </div>

        <div v-if="loadingMore" class="mt-8 flex justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-800"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { productApi } from '@/api/product';
import { categoryApi } from '@/api/category';
import { brandApi } from '@/api/brand';
import ProductCard from '@/components/products/ProductCardComponent.vue';
import StarRating from '@/components/atoms/StarRatingComponent.vue';
import SearchInputComponent from '@/components/molecules/utils/SearchInputComponent.vue';
import FilterDropdown from '@/components/molecules/utils/FilterDropdownComponent.vue';
import { useI18n } from 'vue-i18n';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const { t } = useI18n();
const route = useRoute();
const products = ref([]);
const loading = ref(false);
const error = ref('');
const currentPage = ref(1);
const hasMorePages = ref(false);
const pageSize = 8;
const totalProducts = ref(0);
const loadingMore = ref(false);
const observer = ref(null);
const lastProductRef = ref(null);
const categoryOptions = ref([]);
const brandOptions = ref([]);
const categoriesLoading = ref(false);
const brandsLoading = ref(false);

const filters = ref({
  categories: [],
  brands: [],
  priceRange: '',
  maxPrice: 0,
  rating: '',
  inStock: false,
  onSale: false,
});

const tempFilters = ref({ ...filters.value });
const searchQuery = ref('');
const sortOption = ref('newest');

const setPriceRange = (range) => {
  tempFilters.value.priceRange = range;
  tempFilters.value.maxPrice = 0;
};

const setRating = (rating) => {
  tempFilters.value.rating = rating;
};

const resetFilters = () => {
  tempFilters.value = {
    categories: [],
    brands: [],
    priceRange: '',
    maxPrice: 0,
    rating: '',
    inStock: false,
    onSale: false,
  };
  filters.value = { ...tempFilters.value };
  currentPage.value = 1;
  debouncedLoadProducts();
};

const applyFilters = () => {
  filters.value = { ...tempFilters.value };
  currentPage.value = 1;
  debouncedLoadProducts();
};

const filteredProducts = computed(() => {
  let result = [...products.value];

  if (filters.value.rating) {
    const minRating = Number(filters.value.rating);
    result = result.filter(product => product.averageRating >= minRating);
  }

  if (filters.value.inStock) {
    result = result.filter(product => product.stockQuantity > 0);
  }

  if (filters.value.onSale) {
    result = result.filter(product => product.salePrice != null && product.salePrice > 0);
  }

  if (filters.value.categories.length > 0) {
    result = result.filter(product => filters.value.categories.includes(String(product.categoryId)));
  }

  if (filters.value.brands.length > 0) {
    result = result.filter(product => filters.value.brands.includes(String(product.brandId)));
  }

  if (filters.value.priceRange) {
    const [min, max] = filters.value.priceRange.split('-').map(Number);
    result = result.filter(product => {
      const price = product.salePrice || product.basePrice;
      return price >= min && (max === 0 || isNaN(max) || price <= max);
    });
  } else if (filters.value.maxPrice > 0) {
    result = result.filter(product => {
      const price = product.salePrice || product.basePrice;
      return price <= filters.value.maxPrice;
    });
  }

  switch (sortOption.value) {
    case 'priceAsc':
      return result.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
    case 'priceDesc':
      return result.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
    case 'rating':
      return result.sort((a, b) => b.averageRating - a.averageRating);
    case 'newest':
    default:
      return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const handleSearch = (query) => {
  searchQuery.value = query;
  debouncedLoadProducts();
};

const getCategoryId = () => {
  return filters.value.categories.length > 0 ? Number(filters.value.categories[0]) : undefined;
};

const getBrandId = () => {
  const brandId = filters.value.brands.length > 0 ? Number(filters.value.brands[0]) : undefined;
  return isNaN(brandId) ? undefined : brandId;
};

const loadCategories = async () => {
  categoriesLoading.value = true;
  try {
    const response = await categoryApi.getCategories();
    categoryOptions.value = (response?.data || []).map(category => ({
      value: String(category.id),
      label: category.name,
      count: category.productCount || 0,
    }));
  } catch (err) {
    console.error('Error loading categories:', err);
  } finally {
    categoriesLoading.value = false;
  }
};

const loadBrands = async () => {
  brandsLoading.value = true;
  try {
    const response = await brandApi.getBrands();
    brandOptions.value = (response?.data || []).map(brand => ({
      value: String(brand.id),
      label: brand.name,
      count: brand.productCount || 0,
      logoPath: brand.logoPath,
    }));
  } catch (err) {
    console.error('Error loading brands:', err);
  } finally {
    brandsLoading.value = false;
  }
};

const loadProducts = async (page = 1) => {
  if (page === 1) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  error.value = '';

  try {
    let minPrice, maxPrice;
    if (filters.value.priceRange) {
      const [min, max] = filters.value.priceRange.split('-').map(Number);
      minPrice = min;
      maxPrice = max === 0 || isNaN(max) ? undefined : max;
    } else if (filters.value.maxPrice > 0) {
      maxPrice = filters.value.maxPrice;
    }

    const response = await productApi.getProducts({
      page,
      pageSize,
      searchQuery: searchQuery.value,
      minPrice,
      maxPrice,
      categoryId: getCategoryId(),
      brandId: getBrandId(),
      stockStatus: filters.value.inStock ? 'inStock' : undefined,
    });

    const newProducts = response?.data || [];

    if (page === 1) {
      products.value = newProducts;
    } else {
      products.value = [...products.value, ...newProducts];
    }

    totalProducts.value = response?.total ?? products.value.length;
    hasMorePages.value = newProducts.length === pageSize;

    nextTick(() => {
      setupIntersectionObserver();
    });
  } catch (err) {
    error.value = t('product.error.loadFailed');
    console.error('Error loading products:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const debouncedLoadProducts = debounce(() => {
  currentPage.value = 1;
  loadProducts();
}, 300);

const debouncedLoadMore = debounce(() => {
  if (loadingMore.value) return;
  currentPage.value++;
  loadProducts(currentPage.value);
}, 500);

const setupIntersectionObserver = () => {
  if (observer.value) {
    observer.value.disconnect();
  }

  if (!hasMorePages.value || loading.value || loadingMore.value || products.value.length === 0) {
    lastProductRef.value = null;
    return;
  }

  const productElements = document.querySelectorAll('.product-card');
  if (productElements.length === 0) {
    lastProductRef.value = null;
    return;
  }

  lastProductRef.value = productElements[productElements.length - 1];

  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMorePages.value && !loading.value && !loadingMore.value) {
        debouncedLoadMore();
      }
    },
    { rootMargin: '0px 0px 200px 0px', threshold: 0.1 }
  );

  if (lastProductRef.value) {
    observer.value.observe(lastProductRef.value);
  }
};

watch(() => tempFilters.value.maxPrice, () => {
  debouncedLoadProducts();
});

watch([() => filters.value.categories, () => filters.value.brands, () => filters.value.priceRange, () => filters.value.rating, () => filters.value.inStock, () => filters.value.onSale, sortOption], () => {
  if (filters.value.maxPrice) return;
  currentPage.value = 1;
  debouncedLoadProducts();
}, { deep: true });

onMounted(() => {
  if (route.query.searchQuery) {
    searchQuery.value = route.query.searchQuery.toString();
  }

  loadCategories();
  loadBrands();
  debouncedLoadProducts();
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

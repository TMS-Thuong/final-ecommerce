<template>
  <div class="py-8 bg-gray-50 w-full">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="w-full md:w-1/5">
        <div class="bg-white p-6 rounded-lg shadow-xl mb-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-neutral-800">{{ $t('product.filters.title') }}</h2>
            <button @click="resetFilters" class="text-blue-600 hover:text-neutral-800 text-lg font-medium">
              {{ $t('product.filters.reset') }}
            </button>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.categories.title') }}</h3>
            <FilterDropdown v-model="tempFilters.categories" :options="categoryOptions"
              :title="$t('product.filters.categories.title')" :loading="categoriesLoading"
              @change="handleFilterChange" />
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-2xl text-neutral-700">{{ $t('product.filters.priceRange.title') }}</h3>
            <div class="space-y-3">
              <label v-for="range in priceRanges" :key="range.value"
                class="flex items-center p-2 rounded-md cursor-pointer"
                :class="tempFilters.priceRange === range.value ? 'bg-neutral-100' : 'hover:bg-neutral-100'"
                @click="setPriceRange(range.value)">
                <span class="text-neutral-700 text-xl">
                  {{ $t(range.label) }} {{ range.display }}
                </span>
              </label>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.brands.title') }}</h3>
            <FilterDropdown v-model="tempFilters.brands" :options="brandOptions"
              :title="$t('product.filters.brands.title')" :loading="brandsLoading" @change="handleFilterChange" />
          </div>

          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.rating.title') }}</h3>
            <div class="space-y-3">
              <label v-for="n in [5, 4, 3, 2, 1]" :key="n" class="flex items-center p-2 rounded-md cursor-pointer"
                :class="tempFilters.rating === String(n) ? 'bg-neutral-100' : 'hover:bg-neutral-100'"
                @click="setRating(String(n))">
                <div class="flex items-center">
                  <StarRating :rating="n" :showCount="false" :readonly="true" />
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
        <div class="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center flex-wrap gap-4">
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

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-0">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product"
            class="product-card h-full" />
        </div>

        <div v-if="hasMorePages" class="mt-8 flex justify-center">
          <div v-if="loadingMore" class="flex items-center gap-2 text-neutral-800">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-800"></div>
            <span class="text-lg">{{ $t('common.loading') }}</span>
          </div>
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

const filteredProducts = computed(() => {
  return products.value;
});

const priceRanges = [
  { value: '0-500000', label: 'product.filters.priceRange.under', display: '500.000đ' },
  { value: '500000-1000000', label: 'product.filters.priceRange.between', display: '500.000đ - 1.000.000đ' },
  { value: '1000000-2000000', label: 'product.filters.priceRange.between', display: '1.000.000đ - 2.000.000đ' },
  { value: '2000000-5000000', label: 'product.filters.priceRange.between', display: '2.000.000đ - 5.000.000đ' },
  { value: '5000000-', label: 'product.filters.priceRange.above', display: '5.000.000đ' }
];

const setPriceRange = (range) => {
  tempFilters.value.priceRange = range;
  tempFilters.value.maxPrice = 0;
};

const setRating = (rating) => {
  tempFilters.value.rating = rating;
};

const applyFilters = () => {
  filters.value = { ...tempFilters.value };
  currentPage.value = 1;
  loadProducts();
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
  applyFilters();
};

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

const loadMore = () => {
  if (loadingMore.value || !hasMorePages.value) return;
  currentPage.value++;
  loadProducts(currentPage.value);
};

const handleScroll = () => {
  if (loadingMore.value || !hasMorePages.value) return;

  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;

  if (documentHeight - scrollPosition < 100) {
    loadMore();
  }
};

const handleFilterChange = () => {
  debouncedLoadProducts();
};

const loadProducts = async (page = 1) => {
  if (loading.value || loadingMore.value) return;
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
      averageRating: filters.value.rating ? Number(filters.value.rating) : undefined,
      onSale: filters.value.onSale ? true : undefined,
      sortBy: sortOption.value
    });
    const newProducts = response?.data || [];
    if (page === 1) {
      products.value = newProducts;
    } else {
      products.value = [...products.value, ...newProducts];
    }
    totalProducts.value = response?.total ?? products.value.length;
    hasMorePages.value = newProducts.length === pageSize;
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

watch(sortOption, () => {
  currentPage.value = 1;
  loadProducts();
});

onMounted(() => {
  if (route.query.searchQuery) {
    searchQuery.value = route.query.searchQuery.toString();
  }

  loadCategories();
  loadBrands();
  loadProducts();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

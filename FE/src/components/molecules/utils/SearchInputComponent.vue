<template>
  <div class="relative" ref="searchContainerRef">
    <form
      ref="formRef"
      :class="[
        width,
        'mx-auto',
        $attrs.class
      ]"
      @submit.prevent="onSubmit"
    >
      <label for="default-search" class="mb-2 text-lg font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div class="relative w-full">
        <div class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <SearchIcon class="w-6 h-6 text-neutral-900 dark:text-gray-600" />
        </div>
        <input
          type="search"
          id="default-search"
          v-model="searchQuery"
          :placeholder="placeholder"
          @focus="showResults = true"
          :class="[
            'block w-full p-4 ps-14 text-lg border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 hover:border-neutral-400',
            bgColor,
            textColor,
            placeholderColor,
            inputClass,
          ]"
        />
      </div>
    </form>

    <div v-if="showResults && (loading || searchResults.length > 0)" 
      class="absolute top-full right-0 mt-2 p-4 bg-white shadow-lg rounded-lg w-full max-h-60 overflow-y-auto z-50">
      <div v-if="loading" class="flex justify-center items-center p-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-800"></div>
      </div>
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="product in searchResults" :key="product.id" 
          class="py-2 cursor-pointer hover:bg-gray-50"
          @click="selectProduct(product)">
          <div class="flex items-center">
            <div class="flex-shrink-0 w-10 h-10 mr-4">
              <img v-if="product.thumbnailUrl" :src="product.thumbnailUrl" alt="" class="w-full h-full object-cover rounded">
              <div v-else class="w-full h-full bg-gray-200 rounded"></div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
              <p class="text-sm text-gray-500">{{ formatPrice(product.basePrice) }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import { productApi } from '@/api/product'

const props = defineProps({
  placeholder: { type: String, default: 'Search Name, Sku,..' },
  width: { type: String, default: 'max-w-md' },
  bgColor: { type: String, default: 'bg-white dark:bg-neutral-50' },
  textColor: { type: String, default: 'text-gray-900 dark:text-neutral-600' },
  placeholderColor: { type: String, default: 'dark:placeholder-gray-400' },
  inputClass: { type: String, default: '' },
  popup: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['search', 'close', 'update:modelValue'])
const searchQuery = ref(props.modelValue || '')
const formRef = ref(null)
const searchContainerRef = ref(null)
const searchResults = ref([])
const loading = ref(false)
const showResults = ref(false)
const router = useRouter()
const searchTimeout = ref(null)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const onSubmit = () => {
  emit('search', searchQuery.value)
  showResults.value = false
}

const fetchSearchResults = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  loading.value = true
  
  try {
    const response = await productApi.getProducts({ 
      searchQuery: searchQuery.value,
      pageSize: 5
    })
    searchResults.value = response?.data || []
  } catch (error) {
    console.error('Error searching products:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const selectProduct = (product) => {
  router.push({ name: 'ProductDetail', params: { id: product.id } })
  searchQuery.value = ''
  showResults.value = false
  emit('update:modelValue', '')
}

watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  if (newValue) {
    searchTimeout.value = setTimeout(() => {
      fetchSearchResults()
    }, 300)
  } else {
    searchResults.value = []
  }
})

const handleClickOutside = (event) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(event.target)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

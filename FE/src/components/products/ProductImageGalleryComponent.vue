<template>
  <div class="product-gallery">
    <div class="main-image-container bg-white border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-center relative h-[400px]">
      <img
        v-if="currentImage"
        :src="getCachedImageUrl(currentImage.imageUrl)"
        :alt="currentImage.altText || 'Product image'"
        class="h-auto max-h-[350px] w-auto max-w-full object-contain"
      />
      <div v-else class="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded">
        <span class="text-gray-400">No image available</span>
      </div>
      
      <button 
        v-if="images.length > 1"
        @click="$emit('prev-image')" 
        class="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition shadow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      
      <button 
        v-if="images.length > 1"
        @click="$emit('next-image')" 
        class="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition shadow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      
      <div class="absolute top-3 right-3 flex gap-2">
        <button @click="openZoomModal" class="p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition shadow" title="Zoom">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="images.length > 1" class="thumbnails-container flex space-x-2 overflow-x-auto">
      <button
        v-for="(image, index) in images"
        :key="image.id"
        @click="$emit('select-image', index)"
        class="thumbnail-item min-w-[80px] h-[80px] border rounded-md flex items-center justify-center overflow-hidden p-1 bg-white"
        :class="{ 'border-blue-500': index === thumbnailIndex, 'border-gray-200': index !== thumbnailIndex }"
      >
        <img
          :src="getCachedImageUrl(image.imageUrl)"
          :alt="image.altText || `Thumbnail ${index + 1}`"
          class="max-h-full max-w-full object-contain"
        />
      </button>
    </div>

    <div v-if="showZoomModal" class="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4" @click.self="closeZoomModal">
      <div class="relative max-w-4xl max-h-[90vh] bg-white rounded-lg p-4 w-full">
        <img 
          v-if="modalImage"
          :src="getCachedImageUrl(modalImage.imageUrl)" 
          :alt="modalImage.altText || 'Product image'" 
          class="w-full h-auto max-h-[80vh] object-contain"
        />
        
        <button @click="closeZoomModal" class="absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button 
          v-if="images.length > 1"
          @click.stop="prevImageInModal" 
          class="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <button 
          v-if="images.length > 1"
          @click.stop="nextImageInModal" 
          class="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCachedImageUrl, preloadImages } from '@/utils/imageCache'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  thumbnailIndex: {
    type: Number,
    default: 0
  }
})

const showZoomModal = ref(false)
const modalImageIndex = ref(0)

defineEmits(['select-image', 'next-image', 'prev-image'])

const currentImage = computed(() => {
  if (props.images.length === 0) return null
  return props.images[props.thumbnailIndex] || props.images[0]
})

const modalImage = computed(() => {
  if (props.images.length === 0) return null
  return props.images[modalImageIndex.value] || props.images[0]
})

const openZoomModal = () => {
  document.body.style.overflow = 'hidden'
  modalImageIndex.value = props.thumbnailIndex
  showZoomModal.value = true
}

const closeZoomModal = () => {
  document.body.style.overflow = ''
  showZoomModal.value = false
}

const nextImageInModal = () => {
  if (props.images.length <= 1) return
  modalImageIndex.value = (modalImageIndex.value + 1) % props.images.length
}

const prevImageInModal = () => {
  if (props.images.length <= 1) return
  modalImageIndex.value = (modalImageIndex.value - 1 + props.images.length) % props.images.length
}

onMounted(() => {
  // Tải trước tất cả hình ảnh để cải thiện hiệu suất
  if (props.images && props.images.length > 0) {
    const imageUrls = props.images.map(img => img.imageUrl)
    preloadImages(imageUrls)
  }
})
</script>

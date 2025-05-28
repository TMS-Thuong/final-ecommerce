<template>
  <div class="relative" ref="dropdownRef">
    <div @click="toggleDropdown"
      class="flex items-center justify-between w-full p-3 text-left border border-neutral-300 rounded-lg bg-white cursor-pointer hover:border-neutral-400 focus:outline-none">
      <div class="text-lg text-neutral-700 truncate flex items-center gap-2">
        <template v-if="selectedItems.length === 1">
          <img v-if="selectedItems[0].logoPath" :src="selectedItems[0].logoPath" alt="brand logo"
            class="w-9 h-9 object-contain rounded-full" />
          <span class="uppercase">{{ selectedItems[0].label }}</span>
        </template>
        <span v-else>{{ placeholder || `Select ${title}` }}</span>
      </div>
      <svg :class="[isOpen ? 'transform rotate-180' : '', 'w-5 h-5 text-neutral-500']" fill="none" stroke="currentColor"
        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>

    <div v-if="isOpen"
      class="absolute z-50 mt-1 w-full bg-white border border-neutral-200 rounded-md shadow-lg py-1 max-h-60 overflow-auto">
      <div v-if="loading" class="flex justify-center items-center p-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-800"></div>
      </div>
      <div v-else-if="options.length === 0" class="px-4 py-2 text-sm text-neutral-500">
        No options available
      </div>
      <template v-else>
        <div v-for="option in options" :key="option.value"
          :class="['px-4 py-2 cursor-pointer', isSelected(option.value) ? 'bg-neutral-100 font-semibold text-neutral-900' : 'hover:bg-neutral-100']"
          @click="toggleOption(option.value)">
          <div class="flex justify-between w-full text-lg items-center">
            <div class="flex items-center">
              <img v-if="option.logoPath" :src="option.logoPath" alt="" class="w-10 h-10 mr-2 object-contain" />
              <span class="text-neutral-700" style="text-transform: uppercase;">{{ option.label }}</span>
            </div>
            <span v-if="option.count && option.count > 0" class="text-neutral-500 text-sm">({{ option.count }})</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const dropdownRef = ref(null)
const selectedValues = ref([...props.modelValue])

const selectedItems = computed(() => {
  return props.options.filter(option => selectedValues.value.includes(option.value))
})

watch(() => props.modelValue, (newVal) => {
  selectedValues.value = [...newVal]
}, { deep: true })

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const toggleOption = (value) => {
  const newValue = !isSelected(value) ? [value] : [];
  selectedValues.value = newValue;
  emit('update:modelValue', newValue);
  emit('change', newValue);
  isOpen.value = false;
}

const isSelected = (value) => {
  return selectedValues.value.includes(value)
}

const inClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', inClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', inClickOutside)
})
</script>

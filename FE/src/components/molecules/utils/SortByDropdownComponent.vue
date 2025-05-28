<template>
  <div ref="dropdownRef" class="relative">
    <div @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 border border-neutral-300 rounded-md cursor-pointer hover:border-neutral-400 transition-colors">
      <span class="text-lg">{{ $t('product.sort.title') }}: {{ selectedOption.label }}</span>
      <ChevronDownIcon size="5" class="text-neutral-700" />
    </div>
    <div v-if="dropdownVisible"
      class="absolute left-0 top-full mt-1 w-64 bg-white border border-neutral-300 shadow-lg rounded-md z-10">
      <ul class="py-1">
        <li v-for="option in sortOptions" :key="option.value" @click="selectOption(option)"
          class="px-4 py-2 hover:bg-neutral-100 cursor-pointer text-lg"
          :class="{ 'bg-neutral-50': selectedOption.value === option.value }">
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: 'newest'
  }
})

const emit = defineEmits(['update:modelValue'])

const dropdownVisible = ref(false)
const dropdownRef = ref(null)

const sortOptions = computed(() => [
  { value: 'newest', label: t('product.sort.newest') },
  { value: 'priceLowToHigh', label: t('product.sort.priceLowToHigh') },
  { value: 'priceHighToLow', label: t('product.sort.priceHighToLow') },
  { value: 'topRated', label: t('product.sort.topRated') }
])

const selectedOption = computed(() => {
  return sortOptions.value.find(option => option.value === props.modelValue) || sortOptions.value[0]
})

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  dropdownVisible.value = false
}

const inClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', inClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', inClickOutside)
})
</script>
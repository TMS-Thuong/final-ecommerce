<template>
  <form
    ref="formRef"
    :class="[
      popup ? 'absolute top-full left-0 mt-2 p-4 bg-white shadow-lg rounded max-w-md w-screen sm:w-auto z-50' : width,
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
        <SearchIcon class="w-5 h-5 text-neutral-900 dark:text-gray-600" />
      </div>
      <input
        type="search"
        id="default-search"
        v-model="searchQuery"
        :placeholder="placeholder"
        required
        :class="[
          'block w-full p-3 ps-12 text-lg border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 hover:border-neutral-400',
          bgColor,
          textColor,
          placeholderColor,
          inputClass,
        ]"
      />
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'

const props = defineProps({
  placeholder: { type: String, default: 'Search Name, Sku,..' },
  width: { type: String, default: 'max-w-md' },
  bgColor: { type: String, default: 'bg-white dark:bg-neutral-50' },
  textColor: { type: String, default: 'text-gray-900 dark:text-neutral-600' },
  placeholderColor: { type: String, default: 'dark:placeholder-gray-400' },
  inputClass: { type: String, default: '' },
  popup: { type: Boolean, default: false },
})

const emit = defineEmits(['search', 'close'])
const searchQuery = ref('')
const formRef = ref(null)


const onSubmit = () => {
  emit('search', searchQuery.value)
}


watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleClickOutside = (event) => {
  if (props.popup && formRef.value && !formRef.value.contains(event.target)) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

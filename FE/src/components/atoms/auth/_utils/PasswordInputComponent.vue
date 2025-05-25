<template>
  <div class="relative">
    <div class="relative flex items-center">
      <input :type="showPassword ? 'text' : 'password'"
        class="w-full px-3 py-2 border shadow-sm focus:ring-neutral-800 focus:border-neutral-800 border-gray-300 rounded-lg text-lg"
        :placeholder="$t('auth.login.password')" :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
      <button type="button"
        class="absolute right-0 pr-3 flex items-center justify-center text-gray-500 hover:text-black top-1/2 transform -translate-y-1/2"
        @click="togglePasswordVisibility">
        <EyeIcon :class="showPassword ? 'text-gray-400' : 'text-gray-500'" class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EyeIcon } from '@heroicons/vue/24/solid'

defineProps({
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Password',
  },
  modelValue: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

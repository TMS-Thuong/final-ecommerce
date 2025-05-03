<template>
  <div class="relative">
    <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="relative flex items-center">
      <input
        :type="showPassword ? 'text' : 'password'"
        :id="id"
        class="w-full px-3 py-2 border shadow-sm focus:ring-[#704F38] focus:border-[#704F38] border-gray-300 rounded-lg"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="absolute right-0 pr-3 flex items-center justify-center text-gray-500 top-1/2 transform -translate-y-1/2"
        @click="togglePasswordVisibility"
      >
        <EyeIcon :class="showPassword ? 'text-gray-400' : 'text-gray-500'" class="h-5 w-5" />
      </button>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { EyeIcon } from '@heroicons/vue/20/solid';

defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Mật khẩu'
  },
  placeholder: {
    type: String,
    default: 'Mật khẩu'
  },
  modelValue: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

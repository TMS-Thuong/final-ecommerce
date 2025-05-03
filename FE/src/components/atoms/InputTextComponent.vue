<template>
  <div class="form-group">
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input :id="id" v-bind="$attrs" :value="modelValue" @input="updateValue" :type="type"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#704F38] focus:border-[#704F38] sm:text-sm" />
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: String,
  label: String,
  modelValue: String,
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update:modelValue', input.value);
};
</script>

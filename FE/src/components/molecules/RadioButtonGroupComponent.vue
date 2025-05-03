<template>
  <div>
    <label class="block text-sm mb-1">
      {{ label }} <span class="text-red-500">*</span>
    </label>
    <div class="flex space-x-4 mt-1">
      <div v-for="option in options" :key="option.value" class="flex items-center">
        <input
          :id="option.value"
          type="radio"
          :value="option.value"
          :name="name"
          v-bind:checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          class="w-4 h-4 text-[#704F38] bg-gray-100 border-[#704F38] focus:ring-[#704F38]"
        />
        <label :for="option.value" class="ml-2 text-sm font-medium text-gray-700">
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  options: Array,
  name: String,
  modelValue: Number,
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mb-8">
    <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.brands.title') }}</h3>
    <div class="space-y-3">
      <div
        v-for="brand in brandOptions"
        :key="brand.value"
        class="flex items-center"
      >
        <input
          type="checkbox"
          :id="`brand${brand.value}`"
          class="mr-3 w-4 h-4 accent-neutral-600"
          :value="brand.value"
          v-model="modelValue"
        />
        <label :for="`brand${brand.value}`" class="text-neutral-700 text-xl">{{ brand.label }}</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps<{
  modelValue: string[];
}>();
const emit = defineEmits(['update:modelValue']);

const brandOptions = [
  { value: '1', label: 'Apple (2)' },
  { value: '2', label: 'Sony (2)' },
  { value: '3', label: 'Samsung (1)' },
  { value: '4', label: 'JBL (1)' },
  { value: '5', label: 'Anker (2)' },
];

watch(
  () => props.modelValue,
  (val) => emit('update:modelValue', val)
);
</script>

<template>
  <div class="mb-8">
    <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.categories.title') }}</h3>
    <div class="space-y-3">
      <div v-for="category in categoryOptions" :key="category.value" class="flex items-center">
        <input
          type="checkbox"
          :id="`cat${category.value}`"
          class="mr-3 w-4 h-4 accent-neutral-800"
          :value="category.value"
          v-model="modelValue"
        />
        <label :for="`cat${category.value}`" class="text-neutral-700 text-xl">{{ category.label }}</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  modelValue: string[];
}>();
const emit = defineEmits(['update:modelValue']);

const categoryOptions = [
  { value: '1', label: useI18n().t('product.filters.categories.phoneAccessories') },
  { value: '2', label: useI18n().t('product.filters.categories.computerAccessories') },
  { value: '3', label: useI18n().t('product.filters.categories.audio') },
];

watch(
  () => props.modelValue,
  (val) => emit('update:modelValue', val)
);
</script>

<template>
  <div class="mb-8">
    <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.priceRange.title') }}</h3>
    <div class="mb-4">
      <input
        type="range"
        min="0"
        max="5000000"
        v-model="modelValue.maxPrice"
        class="w-full h-1 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-neutral-600"
      />
      <div class="flex justify-between text-neutral-600 text-xl mt-2">
        <span>0 đ</span>
        <span>{{ formatPrice(modelValue.maxPrice) }}</span>
      </div>
    </div>
    <div class="space-y-3">
      <div
        v-for="range in priceOptions"
        :key="range.value"
        class="flex items-center"
      >
        <input
          type="radio"
          name="price"
          class="mr-3 w-4 h-4 accent-neutral-600"
          :id="range.value"
          :value="range.value"
          v-model="modelValue.priceRange"
        />
        <label :for="range.value" class="text-neutral-700 text-xl">{{ range.label }}</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  modelValue: { priceRange: string; maxPrice: number };
}>();
const emit = defineEmits(['update:modelValue']);

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const { t } = useI18n();
const priceOptions = [
  { value: '0-500000', label: `${t('product.filters.priceRange.under')} 500.000đ` },
  { value: '500000-1000000', label: `${t('product.filters.priceRange.between')} 500.000đ - 1.000.000đ` },
  { value: '1000000-2000000', label: `${t('product.filters.priceRange.between')} 1.000.000đ - 2.000.000đ` },
  { value: '2000000-5000000', label: `${t('product.filters.priceRange.between')} 2.000.000đ - 5.000.000đ` },
  { value: '5000000-', label: `${t('product.filters.priceRange.above')} 5.000.000đ` },
];

watch(() => props.modelValue, val => emit('update:modelValue', val), { deep: true });
</script>

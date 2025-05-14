<template>
  <div class="mb-8">
    <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.stock.title') }}</h3>
    <div class="flex items-center">
      <input
        type="checkbox"
        id="inStock"
        class="mr-3 w-4 h-4 accent-neutral-600"
        v-model="modelValue"
      />
      <label for="inStock" class="text-neutral-700 text-xl">{{ $t('product.filters.stock.inStockOnly') }}</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

watch(
  () => props.modelValue,
  (val) => emit('update:modelValue', val)
);
</script>

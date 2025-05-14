<template>
  <div class="mb-8">
    <h3 class="font-semibold mb-4 text-xl text-neutral-700">{{ $t('product.filters.rating.title') }}</h3>
    <div class="space-y-3">
      <div v-for="star in [5,4,3,2,1]" :key="star" class="flex items-center">
        <input
          type="radio"
          :id="`rating${star}`"
          name="rating"
          class="mr-3 w-4 h-4 accent-neutral-600"
          :value="String(star)"
          v-model="modelValue"
        />
        <label :for="`rating${star}`" class="flex items-center">
          <StarRating :rating="star" :showCount="false" />
          <span class="ml-2 text-neutral-700 text-xl">{{ $t('product.filters.rating.andAbove') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarRating from '@/components/atoms/StarRatingComponent.vue'
import { watch } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(['update:modelValue']);

watch(
  () => props.modelValue,
  (val) => emit('update:modelValue', val)
);
</script>

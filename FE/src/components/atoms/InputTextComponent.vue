<template>
  <div class="form-group">
    <input :id="id" v-bind="$attrs" :value="modelValue" @input="updateValue" :type="type" :placeholder="placeholder"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-lg" />
    <p v-if="error" class="text-red-600 text-lg mt-1">{{$t(error) }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
  id: String,
  modelValue: String,
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.value)
}
</script>

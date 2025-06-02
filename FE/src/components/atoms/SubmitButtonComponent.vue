<template>
  <button :type="type" :class="$attrs.class" :disabled="disabled">
    {{ text }}
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  text: String,
  disabled: Boolean,
  type: {
    type: String as () => 'submit' | 'button' | 'reset',
    default: 'submit'
  }
})
</script>

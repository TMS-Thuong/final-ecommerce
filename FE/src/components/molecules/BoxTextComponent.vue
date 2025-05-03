<template>
  <div class="flex-1 bg-[#704F38] text-white p-8">
    <h1 class="text-xl font-bold mb-6">Quyền lợi với thành viên</h1>

    <ul class="space-y-4 font-medium mb-8">
      <li>Vận chuyển siêu tốc</li>
      <li>Sản phẩm đa dạng</li>
      <li>Đổi trả dễ dàng</li>
      <li>Tích điểm đổi quà</li>
      <li>Nhiều mã coupon dành cho thành viên thường xuyên</li>
    </ul>

    <button :disabled="disabled"
      class="w-full border border-white text-white hover:bg-[#674833] py-2 rounded-md transition-colors">
      {{ text }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
})
</script>

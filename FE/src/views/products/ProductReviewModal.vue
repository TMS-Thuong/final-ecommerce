<template>
    <div v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm pointer-events-none">
        <div
            class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative pointer-events-auto overflow-y-auto max-h-[95vh]">
            <button @click="$emit('close')"
                class="absolute top-2 right-2 text-2xl text-gray-500 hover:text-black">&times;</button>
            <h2 class="text-2xl font-bold mb-4">{{ isUpdate ? 'Cập nhật đánh giá' : 'Viết đánh giá' }}</h2>
            <div class="flex items-center gap-4 mb-4">
                <img :src="product.images?.[0]?.imageUrl" class="w-16 h-16 object-contain rounded bg-gray-100" />
                <div>
                    <div class="font-semibold">{{ product.name }}</div>
                    <div class="text-gray-500 text-sm">SKU: {{ product.sku }}</div>
                    <div class="text-red-600 font-bold">{{ formatPrice(product.salePrice || product.basePrice) }}</div>
                </div>
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Đánh giá sao *</label>
                <div class="flex gap-1">
                    <button v-for="star in 5" :key="star" @click="form.rating = star" type="button" class="text-2xl">
                        <span :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-300'">&#9733;</span>
                    </button>
                </div>
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Tiêu đề đánh giá *</label>
                <input v-model="form.title" maxlength="100" class="w-full border rounded px-3 py-2"
                    placeholder="Nhập tiêu đề cho đánh giá của bạn" />
                <div class="text-xs text-gray-400 text-right">{{ form.title.length }}/100 ký tự</div>
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Nội dung đánh giá *</label>
                <textarea v-model="form.comment" maxlength="500" rows="4" class="w-full border rounded px-3 py-2"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..." />
                <div class="text-xs text-gray-400 text-right">{{ form.comment.length }}/500 ký tự</div>
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Hình ảnh (tối đa 5 ảnh)</label>
                <input type="file" multiple accept="image/*" @change="onFileChange"
                    :disabled="form.images.length >= 5" />
                <div class="flex gap-2 mt-2 flex-wrap">
                    <div v-for="(img, idx) in form.images" :key="idx" class="relative">
                        <img :src="img.preview" class="w-16 h-16 object-cover rounded border" />
                        <button @click="removeImage(idx)"
                            class="absolute -top-2 -right-2 bg-white rounded-full text-red-500 border border-gray-200 w-6 h-6 flex items-center justify-center">×</button>
                    </div>
                </div>
                <div class="text-xs text-gray-400 mt-1">{{ form.images.length }}/5</div>
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <button @click="$emit('close')"
                    class="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold">Hủy</button>
                <button :disabled="!canSubmit" @click="onSubmit"
                    class="px-4 py-2 rounded bg-neutral-700 text-white font-semibold"
                    :class="{ 'opacity-50 cursor-not-allowed': !canSubmit }">
                    {{ isUpdate ? 'Cập nhật' : 'Gửi đánh giá' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    visible: { type: Boolean, default: false },
    product: { type: Object, required: true },
    review: { type: Object, default: null },
    isUpdate: { type: Boolean, default: false }
});
const emit = defineEmits(['close', 'submit', 'removeImage']);

const form = ref({
    rating: 0,
    title: '',
    comment: '',
    images: []
});

watch(
    () => props.review,
    (val) => {
        if (val) {
            form.value.rating = val.rating || 0;
            form.value.title = val.title || '';
            form.value.comment = val.comment || '';
            form.value.images = val.images
                ? val.images.map(img =>
                    img.imageUrl
                        ? { id: img.id, file: null, preview: img.imageUrl }
                        : { file: null, preview: img }
                )
                : [];
        } else {
            form.value = { rating: 0, title: '', comment: '', images: [] };
        }
    },
    { immediate: true }
);

const canSubmit = computed(() =>
    form.value.rating > 0 &&
    form.value.title.trim().length > 0 &&
    form.value.comment.trim().length > 0
);

function onFileChange(e) {
    const files = Array.from(e.target.files).slice(0, 5 - form.value.images.length);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            form.value.images.push({ file, preview: ev.target.result });
        };
        reader.readAsDataURL(file);
    });
    e.target.value = '';
}
function removeImage(idx) {
    if (props.isUpdate && props.review && props.review.images && props.review.images[idx] && props.review.images[idx].id) {
        emit('removeImage', idx);
    } else {
        form.value.images.splice(idx, 1);
    }
}
function onSubmit() {
    emit('submit', { ...form.value });
}
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
</script>
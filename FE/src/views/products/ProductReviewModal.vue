<template>
    <div v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm pointer-events-none">
        <div
            class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative pointer-events-auto overflow-y-auto max-h-[95vh]">
            <button @click="$emit('close')"
                class="absolute top-2 right-2 text-2xl text-gray-500 hover:text-black">&times;</button>
            <h2 class="text-2xl font-bold mb-4">{{ isUpdate ? $t('product.review.modal.updateTitle') :
                $t('product.review.modal.writeTitle') }}</h2>
            <div class="flex items-center gap-4 mb-4">
                <img :src="product.images?.[0]?.imageUrl" class="w-16 h-16 object-contain rounded bg-gray-100" />
                <div>
                    <div class="text-lg font-semibold">{{ product.name }}</div>
                    <div class="text-gray-500 text-base">SKU: {{ product.sku }}</div>
                    <div class="text-red-600 text-lg font-bold">{{ formatPrice(product.salePrice || product.basePrice)
                        }}</div>
                </div>
            </div>
            <div class="mb-4">
                <label class="text-lg block font-semibold mb-1">{{ $t('product.review.modal.starEvaluation') }}
                    *</label>
                <div class="flex gap-1">
                    <button v-for="star in 5" :key="star" @click="!isUpdate && (form.rating = star)" type="button"
                        class="text-2xl" :class="{ 'cursor-not-allowed': isUpdate }">
                        <span :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-300'">&#9733;</span>
                    </button>
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-lg font-semibold mb-1">{{ $t('product.review.modal.titleEvaluation') }}
                    *</label>
                <input v-model="form.title" maxlength="100" class="w-full border rounded px-3 py-2"
                    :placeholder="$t('product.review.modal.titlePlaceholder')" />
                <div class="text-base text-gray-400 text-right">{{ $t('product.review.modal.characters', {
                    current:
                        form.title.length, max: 100
                }) }}</div>
            </div>
            <div class="mb-4">
                <label class="block text-lg font-semibold mb-1">{{ $t('product.review.modal.reviewContent') }} *</label>
                <textarea v-model="form.comment" maxlength="500" rows="4" class="w-full border rounded px-3 py-2"
                    :placeholder="$t('product.review.modal.contentPlaceholder')" />
                <div class="text-base text-gray-400 text-right">{{ $t('product.review.modal.characters', {
                    current:
                        form.comment.length, max: 500
                }) }}</div>
            </div>
            <div class="mb-4 text-lg">
                <label class="block font-semibold mb-1">{{ $t('product.review.modal.image') }}</label>
                <input type="file" multiple accept="image/*" @change="onFileChange" :disabled="form.images.length >= 5"
                    class="text-base" />
                <div class="flex gap-2 mt-2 flex-wrap">
                    <div v-for="(img, idx) in form.images" :key="idx" class="relative">
                        <img :src="img.preview" class="w-16 h-16 object-cover rounded border" />
                        <button @click="removeImage(idx)"
                            class="absolute -top-2 -right-2 bg-white rounded-full text-red-500 border border-gray-200 w-6 h-6 flex items-center justify-center">×</button>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-2 text-lg mt-6">
                <button @click="$emit('close')"
                    class="px-4 py-2 rounded bg-gray-600 text-gray-50 font-semibold hover:bg-gray-700 transition-colors duration-200">{{
                        $t('product.review.modal.cancel') }}</button>
                <button :disabled="!canSubmit" @click="onSubmit"
                    class="px-4 py-2 rounded bg-neutral-700 text-white font-semibold hover:bg-neutral-800 transition-colors duration-200"
                    :class="{ 'opacity-50 cursor-not-allowed hover:bg-neutral-700': !canSubmit }">
                    {{ isUpdate ? $t('product.review.modal.update') : $t('product.review.modal.sendReview') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

interface ReviewImage {
    id?: number;
    file: File | null;
    preview: string;
}

interface ReviewForm {
    rating: number;
    title: string;
    comment: string;
    images: ReviewImage[];
}

interface Product {
    name: string;
    sku: string;
    salePrice?: number;
    basePrice: number;
    images?: Array<{ imageUrl: string }>;
}

interface Review {
    id?: number;
    rating?: number;
    title?: string;
    comment?: string;
    images?: Array<{ id: number; imageUrl: string } | string>;
}

const props = defineProps<{
    visible: boolean;
    product: Product;
    review: Review | null;
    isUpdate: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'submit', review: ReviewForm): void;
    (e: 'removeImage', index: number): void;
}>();

const { t } = useI18n();

const form = ref<ReviewForm>({
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
                    typeof img === 'string'
                        ? { file: null, preview: img }
                        : { id: img.id, file: null, preview: img.imageUrl }
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

function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files).slice(0, 5 - form.value.images.length);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                form.value.images.push({ file, preview: ev.target.result as string });
            }
        };
        reader.readAsDataURL(file);
    });
    input.value = '';
}

function removeImage(idx: number) {
    if (props.isUpdate && props.review?.images?.[idx] && typeof props.review.images[idx] !== 'string' && props.review.images[idx].id) {
        emit('removeImage', idx);
    } else {
        form.value.images.splice(idx, 1);
    }
}

function onSubmit() {
    const oldImages = form.value.images.filter(img => !img.file && img.preview && !img.id).map(img => img.preview);
    const newImages = form.value.images.filter(img => img.file);

    if (props.isUpdate && newImages.length > 0 && props.review && props.review.id) {
        const uploadPromises = newImages
            .filter(img => img.file)
            .map(img => {
                const formData = new FormData();
                formData.append('file', img.file!);
                return import('@/api/review').then(module => module.reviewApi.uploadReviewImage(props.review!.id!, formData))
                    .then(res => res.data?.data?.imageUrl || null);
            });
        Promise.all(uploadPromises).then(urls => {
            const allImageUrls = [...oldImages, ...urls.filter(Boolean)];
            emit('submit', { ...form.value, images: allImageUrls });
        });
    } else {
        emit('submit', { ...form.value });
    }
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function inKeydown(e: KeyboardEvent) {
    if (props.visible && e.key === 'Escape') {
        emit('close');
    }
}

watch(() => props.visible, (val) => {
    if (val) {
        window.addEventListener('keydown', inKeydown);
    } else {
        window.removeEventListener('keydown', inKeydown);
    }
});

onUnmounted(() => {
    window.removeEventListener('keydown', inKeydown);
});
</script>
<template>
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 relative">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">{{ t('account.purchasedProductsTitle') }}</h1>
        <div class="flex flex-row items-center gap-4 mb-6">
            <SearchInputComponent @search="handleSearch" placeholder="Search by product name, SKU, or order code..."
                class="w-full max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-md" />
            <select v-model="statusFilter"
                class="border text-lg rounded px-4 py-2 w-[160px] h-[30px] focus:ring-neutral-800 focus:border-neutral-900">
                <option value="all">{{ t('account.filter.all') }}</option>
                <option value="not_reviewed">{{ t('account.filter.notReviewed') }}</option>
                <option value="reviewed">{{ t('account.filter.reviewed') }}</option>
            </select>
        </div>
        <div class="flex justify-between items-center mb-4 text-xl">
            <div class="font-semibold">{{ filteredProducts.length }} {{ t('account.products') }}</div>
            <div class="text-green-600 font-semibold">{{ reviewedCount }} {{ t('account.reviewed') }}</div>
        </div>
        <div v-if="isLoading" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
            <div class="flex justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p class="text-gray-500 mt-4">{{ t('common.loading') }}</p>
        </div>
        <div v-else-if="error" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
            <p class="text-red-500 text-lg">{{ error }}</p>
            <button @click="fetchProducts" class="mt-4 px-4 py-2 rounded bg-neutral-800 text-white">{{
                t('common.retry') }}</button>
        </div>
        <div v-else-if="filteredProducts.length === 0"
            class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ t('account.noPurchasedProducts') }}</h3>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <div v-for="item in filteredProducts" :key="item.orderId + '-' + item.product.id"
                class="bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-2 relative">
                <div class="absolute top-4 right-3">
                    <span v-if="item.reviewed"
                        class="bg-green-100 text-green-700 px-2 py-1 rounded text-lg font-semibold">{{
                            t('account.reviewed') }}</span>
                    <span v-else class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-lg font-semibold">{{
                        t('account.notReviewed') }}</span>
                </div>
                <img :src="item.product.images[0]?.imageUrl" alt="" class="w-full h-80 object-contain rounded mb-2" />
                <div class="font-semibold text-2xl truncate">{{ item.product.name }}</div>
                <div class="text-gray-500 text-lg">{{ t('product.detail.sku') }}: {{ item.product.sku }} &middot; {{
                    t('product.detail.quantity') }}: {{ item.quantity }}</div>
                <div class="text-red-600 font-bold text-2xl">{{ formatPrice(item.product.salePrice ||
                    item.product.basePrice) }}</div>
                <div class="flex items-center gap-2 text-gray-500 text-base mt-1">
                    <span>{{ formatDate(item.review && item.review.order && item.review.order.createdAt ?
                        item.review.order.createdAt : item.orderDate) }}</span>
                    <span>{{ item.orderCode }}</span>
                </div>
                <div class="flex gap-2 mt-3 text-lg font-normal">
                    <button v-if="item.reviewed" @click="viewReview(item)"
                        class="flex-1 px-3 py-2 rounded bg-neutral-800 text-white">{{ t('account.viewMyReview')
                        }}</button>
                    <button v-if="item.reviewed" @click="updateReview(item)"
                        class="flex-1 px-3 py-2 rounded bg-neutral-800 text-white">{{ t('account.updateReview')
                        }}</button>
                    <button v-else @click="writeReview(item)"
                        class="flex-1 px-3 py-2 rounded bg-neutral-800 text-white">{{ t('account.writeReview')
                        }}</button>
                </div>
            </div>
        </div>
        <ProductReviewModal :visible="showReviewModal" :product="selectedProduct || {}" :review="selectedReview"
            :isUpdate="isUpdate" @close="handleCloseModal" @submit="handleSubmitReview"
            @removeImage="handleRemoveImage" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import orderApi from '@/api/order';
import ProductReviewModal from '@/views/products/ProductReviewModal.vue';
import { reviewApi } from '@/api/review';
import { useToast } from '@/hooks/useToast';
import { ToastEnum } from '@/enums/toast';
import { useRouter } from 'vue-router';
import SearchInputComponent from '@/components/molecules/utils/SearchInputComponent.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const reviewErrorMap = {
    'REVIEW_EDIT_EXPIRED': 'account.reviewErrors.editExpired',
    'REVIEW_ALREADY_EDITED': 'account.reviewErrors.alreadyEdited',
    'REVIEW_NOT_FOUND': 'account.reviewErrors.notFound'
};

const isLoading = ref(true);
const error = ref(null);
const purchasedProducts = ref([]);
const search = ref('');
const selectedProduct = ref(null);
const selectedReview = ref(null);
const showReviewModal = ref(false);
const isUpdate = ref(false);
const sortOrder = ref('newest');
const statusFilter = ref('all');
const { showToast } = useToast();
const router = useRouter();

const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const [ordersRes, reviewsRes] = await Promise.all([
            orderApi.getPurchasedProducts(),
            reviewApi.getMyReviews()
        ]);
        const myReviews = reviewsRes.data;
        purchasedProducts.value = ordersRes.data.flatMap(order =>
            order.items.map(item => {
                const reviewed = myReviews.some(
                    r => r.productId === item.product.id && r.orderId === order.id
                );
                const review = myReviews.find(
                    r => r.productId === item.product.id && r.orderId === order.id
                );
                return {
                    product: item.product,
                    quantity: item.quantity,
                    orderId: order.id,
                    orderCode: order.orderCode,
                    orderDate: order.createdAt,
                    reviewed,
                    review
                }
            })
        );
    } catch (e) {
        error.value = t('account.failedToLoadPurchasedProducts');
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchProducts);

const allProducts = computed(() => purchasedProducts.value.map(item => item));

const filteredProducts = computed(() => {
    let items = purchasedProducts.value;
    if (search.value) {
        const s = search.value.toLowerCase();
        items = items.filter(item =>
            item.product.name.toLowerCase().includes(s) ||
            item.product.sku.toLowerCase().includes(s) ||
            item.orderCode.toLowerCase().includes(s)
        );
    }
    if (statusFilter.value === 'reviewed') {
        items = items.filter(item => item.reviewed);
    } else if (statusFilter.value === 'not_reviewed') {
        items = items.filter(item => !item.reviewed);
    }
    if (sortOrder.value === 'newest') {
        items = items.slice().sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    } else {
        items = items.slice().sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    }
    return items;
});

const reviewedCount = computed(() => purchasedProducts.value.filter(item => item.reviewed).length);

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};

const onSearch = () => { };
const handleSearch = (query) => {
    search.value = query;
};
const viewReview = (item) => {
    router.push({ name: 'ProductDetail', params: { id: item.product.id }, query: { tab: 'reviews' } });
};
const updateReview = (item) => {
    selectedProduct.value = item.product;
    selectedReview.value = item.review || null;
    isUpdate.value = true;
    showReviewModal.value = true;
};
const writeReview = (item) => {
    selectedProduct.value = item.product;
    selectedReview.value = null;
    isUpdate.value = false;
    showReviewModal.value = true;
};
const handleSubmitReview = async (reviewData) => {
    if (!selectedProduct.value || !selectedProduct.value.id) {
        showToast(ToastEnum.Error, t('account.lackOfProductInfo'));
        return;
    }
    const product = selectedProduct.value;
    const orderId = purchasedProducts.value.find(
        item => item.product.id === product.id
    )?.orderId;

    if (!orderId) {
        showToast(ToastEnum.Error, t('account.lackOfOrderInfo'));
        return;
    }

    if (isUpdate.value && selectedReview.value && selectedReview.value.id) {
        try {
            await reviewApi.updateReview(selectedReview.value.id, {
                title: reviewData.title,
                comment: reviewData.comment,
            });
            showToast(ToastEnum.Success, t('account.updateReviewSuccess'));
            showReviewModal.value = false;
            await fetchProducts();
        } catch (err) {
            const errorCode = err?.response?.data?.code;
            const messageKey = reviewErrorMap[errorCode] || 'account.reviewErrors.updateFailed';
            showToast(ToastEnum.Error, t(messageKey));
        }
        return;
    }

    try {
        await reviewApi.createReview({
            productId: product.id,
            orderId: orderId,
            rating: reviewData.rating,
            title: reviewData.title,
            comment: reviewData.comment,
        });
        showToast(ToastEnum.Success, t('account.sendReviewSuccess'));
        showReviewModal.value = false;
        await fetchProducts();
    } catch (err) {
        showToast(ToastEnum.Error, t('account.sendReviewError'));
    }
};

const handleCloseModal = () => {
    showReviewModal.value = false;
    selectedProduct.value = null;
    selectedReview.value = null;
    isUpdate.value = false;
};

const handleRemoveImage = async (imgIdx) => {
    if (isUpdate.value && selectedReview.value && selectedReview.value.images && selectedReview.value.images[imgIdx]) {
        const image = selectedReview.value.images[imgIdx];
        if (image.id && selectedReview.value.id) {
            try {
                await reviewApi.deleteReviewImage(selectedReview.value.id, image.id);
                showToast(ToastEnum.Success, t('account.deleteImageSuccess'));
                selectedReview.value.images.splice(imgIdx, 1);
            } catch (err) {
                showToast(ToastEnum.Error, t('account.deleteImageFail'));
            }
        }
    }
};
</script>

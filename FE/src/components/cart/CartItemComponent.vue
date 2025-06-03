<template>
    <li class="px-6 py-4 relative">
        <div class="flex items-center">
            <div class="mr-4">
                <input type="checkbox" :id="`item-${item.id}`"
                    class="h-5 w-5 text-neutral-800 focus:ring-neutral-800 border-gray-300 rounded cursor-pointer"
                    v-model="selectedItems[item.id]"
                    @change="$emit('update-selected', item.id, selectedItems[item.id])" />
            </div>
            <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                <img v-if="item.product.image" :src="item.product.image" :alt="item.product.name"
                    class="w-full h-full object-center object-cover">
                <div v-else class="flex items-center justify-center w-full h-full text-gray-400">
                    <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
            <div class="ml-4 flex-1">
                <div class="flex justify-between">
                    <div>
                        <h3 class="text-xl font-medium text-gray-900">{{ item.product.name }}</h3>
                        <p class="mt-1 text-xl text-gray-500">
                            <span v-if="item.product.salePrice" class="line-through">{{
                                formatPrice(item.product.basePrice) }}</span>
                            <span class="font-medium ml-1">{{ formatPrice(item.price) }}</span>
                        </p>
                    </div>
                    <button @click="$emit('remove', item.id)" class="text-gray-400 hover:text-gray-500">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                            aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div class="mt-4 sm:flex sm:items-center sm:justify-between">
                    <div class="flex items-center border border-gray-300 rounded w-28">
                        <button @click="$emit('update-quantity', item.id, localQuantities[item.id] - 1)"
                            class="w-8 px-0 py-1 text-gray-500 hover:text-gray-700 border-r border-gray-300"
                            :disabled="localQuantities[item.id] <= 1"
                            :class="{ 'opacity-50 cursor-not-allowed': localQuantities[item.id] <= 1 }">
                            <span class="text-xl font-medium">-</span>
                        </button>
                        <input type="number" v-model.number="localQuantities[item.id]" min="1"
                            :max="item.product.stockQuantity"
                            class="w-10 text-center border-none py-1 text-gray-700 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            @blur="$emit('handle-quantity-input', item.id, localQuantities[item.id])"
                            @keyup.enter="$emit('handle-quantity-input', item.id, localQuantities[item.id])" />
                        <button @click="$emit('update-quantity', item.id, localQuantities[item.id] + 1)"
                            class="w-8 px-0 py-1 text-gray-500 hover:text-gray-700 border-l border-gray-300"
                            :disabled="localQuantities[item.id] >= item.product.stockQuantity"
                            :class="{ 'opacity-50 cursor-not-allowed': localQuantities[item.id] >= item.product.stockQuantity }">
                            <span class="text-xl font-medium">+</span>
                        </button>
                    </div>
                    <span class="mt-2 sm:mt-0 text-xl font-medium text-gray-900">{{ formatPrice(item.subtotal) }}</span>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
const props = defineProps({
    item: Object,
    localQuantities: Object,
    selectedItems: Object,
    loading: Boolean
});
const formatPrice = (price) => {
    if (price === undefined || price === null) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0);
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
</script>
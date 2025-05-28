<template>
    <div v-if="visible" class="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 class="text-3xl font-bold mb-4">{{ title }}</h2>
            <p class="text-xl text-gray-600 mb-6">{{ message }}</p>
            <div class="flex justify-end  text-xl gap-2">
                <button @click="$emit('cancel')"
                    class="px-4 py-2 rounded bg-gray-600 text-gray-50 font-semibold hover:bg-gray-700 transition-colors duration-200">
                    {{ cancelText }}
                </button>
                <button @click="$emit('confirm')"
                    class="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200">
                    {{ confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    confirmText: {
        type: String,
        default: 'Confirm'
    },
    cancelText: {
        type: String,
        default: 'Cancel'
    }
});

defineEmits(['confirm', 'cancel']);
</script>
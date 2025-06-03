<template>
    <div class="bg-white shadow-xl border-0 mb-8">
        <div class="bg-gradient-to-r from-gray-800 to-black text-white rounded-t-lg p-8">
            <div class="text-center">
                <div class="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size="12" />
                </div>
                <h1 class="text-4xl font-bold mb-2">{{ $t('contact.header.title') }}</h1>
                <p class="text-gray-300 text-xl max-w-2xl mx-auto">
                    {{ $t('contact.header.description') }}
                </p>
                <div v-if="success" class="mt-4">
                    <span
                        class="bg-green-100 text-green-700 border-green-200 px-3 py-1 rounded-full text-xl flex items-center justify-center">
                        <Check class="w-4 h-4 mr-2" />
                        {{ $t('contact.header.successMessage') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MessageSquare from '@/components/icons/MessageSquareIcon.vue'
import Check from '@/components/icons/CheckIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
    success: {
        type: Boolean,
        default: false
    }
})
</script>
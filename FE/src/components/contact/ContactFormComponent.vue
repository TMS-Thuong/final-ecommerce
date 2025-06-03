<template>
    <div class="bg-white shadow-xl border-0">
        <div class="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg p-8">
            <h2 class="text-2xl font-bold">{{ $t('contact.title') }}</h2>
            <p class="text-xl text-gray-300">
                {{ $t('contact.description') }}
            </p>
        </div>
        <div class="p-8 bg-gray-50">
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <label class="text-xl font-semibold text-gray-600 uppercase tracking-wide">{{
                            $t('contact.fullName') }} <span class="text-red-500">*</span></label>
                        <InputTextComponent v-model="formData.name" type="text" :placeholder="$t('contact.fullName')"
                            :disabled="loading" />
                    </div>

                    <div class="space-y-3">
                        <label class="text-xl font-semibold text-gray-600 uppercase tracking-wide">{{
                            $t('contact.emailAddress') }} <span class="text-red-500">*</span></label>
                        <InputTextComponent v-model="formData.email" type="email"
                            :placeholder="$t('contact.emailAddress')" :disabled="loading" />
                    </div>

                    <div class="space-y-3">
                        <label class="text-xl font-semibold text-gray-600 uppercase tracking-wide">{{
                            $t('contact.phoneNumber') }}</label>
                        <InputTextComponent v-model="formData.phone" type="tel" :placeholder="$t('contact.phoneNumber')"
                            :disabled="loading" />
                    </div>

                    <div class="space-y-3">
                        <label class="text-xl font-semibold text-gray-600 uppercase tracking-wide">{{
                            $t('contact.category') }}</label>
                        <select v-model="formData.category"
                            class="w-full text-base p-4 border-2 border-gray-300 focus:border-gray-600 rounded-lg bg-white text-gray-900 font-medium"
                            :disabled="loading">
                            <option value="">{{ $t('contact.selectCategory') }}</option>
                            <option value="general">{{ $t('contact.general') }}</option>
                            <option value="support">{{ $t('contact.support') }}</option>
                            <option value="orders">{{ $t('contact.orders') }}</option>
                            <option value="returns">{{ $t('contact.returns') }}</option>
                            <option value="shipping">{{ $t('contact.shipping') }}</option>
                            <option value="partnership">{{ $t('contact.partnership') }}</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-3">
                    <label class="text-xl font-semibold text-gray-600 uppercase tracking-wide">{{ $t('contact.subject')
                    }} <span class="text-red-500">*</span></label>
                    <InputTextComponent v-model="formData.subject" type="text" :placeholder="$t('contact.subject')"
                        :disabled="loading" />
                </div>

                <div class="space-y-3">
                    <label class="text-xl font-semibold text-gray-600 uppercase tracking-wide">{{ $t('contact.message')
                    }} <span class="text-red-500">*</span></label>
                    <textarea v-model="formData.message"
                        class="w-full text-base p-4 border-2 border-gray-300 focus:border-gray-600 rounded-lg bg-white text-gray-900 font-medium min-h-[120px]"
                        :placeholder="$t('contact.messagePlaceholder')" :disabled="loading"></textarea>
                </div>

                <div class="pt-6 border-t border-gray-200">
                    <button @click="handleSubmit"
                        :disabled="loading || !formData.name || !formData.email || !formData.subject || !formData.message"
                        class="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white py-4 text-xl font-semibold shadow-lg rounded-lg flex items-center justify-center">
                        <Loader2 v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
                        <Send v-else class="w-5 h-5 mr-2" />
                        {{ loading ? $t('contact.sendingMessage') : $t('contact.sendMessage') }}
                    </button>
                </div>

                <p class="text-xl text-gray-500 text-center">
                    {{ $t('contact.privacyNotice') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputTextComponent from '@/components/atoms/InputTextComponent.vue'
import Send from '@/components/icons/SendIcon.vue'
import Loader2 from '@/components/icons/LoadingSpinnerIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const formData = ref({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
})

const loading = ref(false)

const emit = defineEmits(['submit', 'success'])

const handleSubmit = async () => {
    try {
        loading.value = true;
        await new Promise(resolve => setTimeout(resolve, 1000));
        showToast(ToastEnum.Success, t('contact.successMessage'));
        formData.value = {
            name: '',
            email: '',
            subject: '',
            message: ''
        };
        emit('success')
        emit('submit', formData.value)
    } catch (error) {
        showToast(ToastEnum.Error, t('contact.errorMessage'));
    } finally {
        loading.value = false;
    }
};
</script>

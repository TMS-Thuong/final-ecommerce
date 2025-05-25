<template>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4 max-w-lg mx-auto">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.currentPassword') }}</label>
            <PasswordInputComponent id="currentPassword" v-model="form.currentPassword"
                :placeholder="$t('account.currentPasswordPlaceholder')" :error="normalizedErrors.currentPassword"
                required />
            <p v-if="normalizedErrors.currentPassword" class="text-red-500 text-sm mt-1">{{
                normalizedErrors.currentPassword }}</p>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.newPassword') }}</label>
            <PasswordInputComponent id="newPassword" v-model="form.newPassword"
                :placeholder="$t('account.newPasswordPlaceholder')" :error="normalizedErrors.newPassword" required />
            <p v-if="normalizedErrors.newPassword" class="text-red-500 text-sm mt-1">{{ normalizedErrors.newPassword }}
            </p>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.confirmNewPassword') }}</label>
            <PasswordInputComponent id="confirmPassword" v-model="form.confirmPassword"
                :placeholder="$t('account.confirmNewPasswordPlaceholder')" :error="normalizedErrors.confirmPassword"
                required />
            <p v-if="normalizedErrors.confirmPassword" class="text-red-500 text-sm mt-1">{{
                normalizedErrors.confirmPassword }}</p>
        </div>
        <div class="flex gap-4 mt-4">
            <button type="submit" class="flex-1 bg-neutral-700 text-white py-2 rounded font-semibold">
                {{ $t('account.changePassword') }}
            </button>
            <button type="button" class="flex-1 border border-neutral-400 py-2 rounded font-semibold"
                @click="$emit('cancel')">
                {{ $t('account.cancel') }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import PasswordInputComponent from '@/components/atoms/auth/_utils/PasswordInputComponent.vue'

const emit = defineEmits(['submit', 'cancel'])
const props = defineProps({
    passwordForm: {
        type: Object,
        default: () => ({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    },
    errors: {
        type: Object,
        default: () => ({})
    }
})

const form = ref({
    currentPassword: props.passwordForm.currentPassword || '',
    newPassword: props.passwordForm.newPassword || '',
    confirmPassword: props.passwordForm.confirmPassword || ''
})

watch(() => props.passwordForm, (val) => {
    form.value = {
        currentPassword: val.currentPassword || '',
        newPassword: val.newPassword || '',
        confirmPassword: val.confirmPassword || ''
    }
})

const normalizedErrors = computed(() => ({
    currentPassword: props.errors.currentPassword || '',
    newPassword: props.errors.newPassword || '',
    confirmPassword: props.errors.confirmPassword || ''
}))

const onSubmit = () => {
    emit('submit', { ...form.value })
}
</script>
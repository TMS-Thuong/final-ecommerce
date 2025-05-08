<template>
  <div
    class="w-full max-w-5xl flex flex-col md:flex-row rounded-lg border border-gray-200 overflow-hidden bg-white font-sans">
    <div class="flex-1 p-8 flex flex-col justify-center items-center h-auto max-h-[600px]">
      <h1 class="text-2xl font-bold mb-6 text-center">Khôi phục mật khẩu</h1>
      <form class="space-y-4 w-full max-w-sm" @submit.prevent="onResetPW">
        <PasswordInput id="new-password" label="Mật khẩu mới" v-model="formData.password" :error="errors.password"
          class="w-full" />
        <PasswordInput id="confirm-password" label="Xác nhận mật khẩu" v-model="confirmPassword.password"
          :error="errors.confirmPassword" class="w-full" />
        <SubmitButton :text="'Đặt lại mật khẩu'" :disabled="isLoading" class="w-full" />
      </form>
      <div class="mt-6 text-center">
        <p class="text-base font-medium text-gray-700 mb-3">Hoặc đăng nhập bằng</p>
        <div class="flex justify-center">
          <SocialLoginButton />
        </div>
      </div>
      <Toast v-if="showToast" :type="toastType" :message="toastMessage" @close="showToast = false" />
    </div>
    <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">
      <BoxText :text="'Đăng Ký'" @click="onRegister" :disabled="isLoading" />
      <div class="flex justify-center">
        <img src="@/assets/image-auth.png" alt="Description of image" class="w-100 h-80 object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PasswordInput from '@/components/atoms/auth/_utils/PasswordInputComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/auth/_utils/BoxTextComponent.vue'
import SocialLoginButton from '@/components/atoms/auth/_utils/GoogleLoginButtonComponent.vue'
import Toast from '@/components/molecules/utils/ToastComponent.vue'
import { AxiosError } from 'axios'
import { authApi } from '@/api/auth'
import { DEFAULT_FORM_DATA, EMPTY_FORM_DATA } from '@/constants/auth/_utils/form'

interface ErrorResponse {
  code?: string;
  error?: string;
  message?: string;
}

import router from '@/router'
import { AuthRouterName } from '@/enums/router'
import { resetPasswordSchema } from '@/validations/form'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const formData = ref(DEFAULT_FORM_DATA)
const confirmPassword = ref(EMPTY_FORM_DATA)
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)

const showToast = ref(false)
const toastType = ref<'success' | 'error' | 'warning'>('success')
const toastMessage = ref('')

const showToastMessage = (type: 'success' | 'error' | 'warning', message: string) => {
  if (!showToast.value) {
    toastType.value = type
    toastMessage.value = message
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}

onMounted(() => {
  const token = route.params.token
  if (!token) {
    showToastMessage('error', t('error.INVALID_TOKEN'))
    router.push({ name: AuthRouterName.Login })
  }
})

const onResetPW = async () => {
  if (isLoading.value) return;

  const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token
  if (!token) {
    showToastMessage('error', t('error.INVALID_TOKEN'))
    router.push({ name: AuthRouterName.Login })
    return
  }

  errors.value = {}

  const parsed = resetPasswordSchema.safeParse({
    password: formData.value.password,
    confirmPassword: confirmPassword.value.password,
  })

  if (!parsed.success) {
    parsed.error.errors.forEach(err => {
      const field = err.path[0]?.toString()
      if (field) errors.value[field] = err.message
    })
    return
  }

  isLoading.value = true

  try {
    const { data } = await authApi.resetPassword({
      token,
      newPassword: formData.value.password,
      confirmPassword: confirmPassword.value.password,
    })
    showToastMessage('success', t('success.PASSWORD_UPDATED'))
  } catch (error) {
    const apiError = error as AxiosError<ErrorResponse>
    const data = apiError.response?.data

    if (data?.code === 'TOKEN_EXPIRED') {
      showToastMessage('error', t('error.TOKEN_EXPIRED'))
    } else if (data?.code === 'INVALID_TOKEN') {
      showToastMessage('error', t('error.INVALID_TOKEN'))
    } else {
      showToastMessage('error', data?.message || t('error.UNEXPECTED_ERROR'))
    }
  } finally {
    isLoading.value = false
  }
}

onUnmounted(() => {
  formData.value = DEFAULT_FORM_DATA
  confirmPassword.value = EMPTY_FORM_DATA
  errors.value = {}
  isLoading.value = false
  showToast.value = false
})

const onRegister = () => {
  router.push({ name: AuthRouterName.Register })
}
</script>

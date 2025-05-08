<template>
  <div
    class="w-full max-w-5xl flex flex-col md:flex-row rounded-lg border border-gray-200 overflow-hidden bg-white font-sans">
    <div class="flex-1 p-8 flex flex-col justify-center items-center h-auto max-h-[600px]">
      <h1 class="text-4xl font-bold mb-6 text-center">Đăng Nhập</h1>
      <form @submit.prevent="onLogin" class="space-y-4 w-full max-w-sm">
        <InputText id="email" label="Email" v-model="formData.email" placeholder="Email" type="email"
          :error="errors.email" @input="onClearError('email')" class="w-full" />
        <PasswordInput id="password" v-model="formData.password" :error="errors.password" class="w-full" />
        <SubmitButton :text="'Đăng nhập'" :disabled="isLoading" class="w-full" />
      </form>
      <div class="mt-6 text-center">
        <p class="text-base font-medium text-gray-700 mb-3">Hoặc đăng nhập bằng</p>
        <div class="flex justify-center">
          <SocialLoginButton />
        </div>
      </div>
      <div class="mt-4 text-center text-base">
        Bạn quên mật khẩu bấm
        <button @click="onForgotPassword" class="text-blue-700 hover:underline">vào đây</button>
      </div>
      <Toast v-if="showToast" :type="toastType" :message="toastMessage" @close="showToast = false" />
    </div>
    <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">
      <BoxText :text="'Đăng Ký'" :disabled="isLoading" @click="onRegister" />
      <div class="flex justify-center">
        <ImagePlaceholder :src="imageSrc" alt="Description of image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import InputText from '@/components/atoms/InputTextComponent.vue'
import PasswordInput from '@/components/atoms/auth/_utils/PasswordInputComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/auth/_utils/BoxTextComponent.vue'
import SocialLoginButton from '@/components/atoms/auth/_utils/GoogleLoginButtonComponent.vue'
import Toast from "@/components/molecules/utils/ToastComponent.vue"
import ImagePlaceholder from '@/components/atoms/ImagePlaceholderComponent.vue'
import router from '@/router'
import { AuthRouterName, RouterName } from '@/enums/router'
import { DEFAULT_FORM_DATA } from '@/constants/auth/_utils/form'
import { AxiosError } from 'axios'
import { loginSchema } from '@/validations/form'
import { z } from 'zod'
import { authApi } from '@/api/auth'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth/login/token.store'

const { t } = useI18n()

const formData = ref(DEFAULT_FORM_DATA)
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const imageSrc = new URL('@/assets/image-auth.png', import.meta.url).href

const showToast = ref(false)
const toastType = ref<'success' | 'error' | 'warning'>('success')
const toastMessage = ref('')

const onClearError = (field: string) => {
  delete errors.value[field]
}

const validateForm = () => {
  try {
    loginSchema.parse(formData.value)
    errors.value = {}
    return true
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fieldErrors: { [key: string]: string } = {}
      err.errors.forEach((e) => {
        fieldErrors[e.path[0]] = e.message
      })
      errors.value = fieldErrors
    }
    return false
  }
}

const showToastMessage = (type: 'success' | 'error' | 'warning', message: string) => {
  toastType.value = type
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const onLogin = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  try {
    const formDataToSend = {
      email: formData.value.email,
      password: formData.value.password,
    }

    const response = await authApi.login(formDataToSend)

    const responseData = response?.data
    if (!responseData || !responseData.accessToken || !responseData.refreshToken) {
      throw new Error(t('error.NO_RESPONSE_DATA'))
    }

    const { accessToken, refreshToken } = responseData
    useAuthStore().setTokens(accessToken, refreshToken)
    router.push({ name: RouterName.Home });
    showToastMessage('success', t('success.LOGIN_SUCCESS'))

  } catch (error: unknown) {
    const apiError = error as AxiosError

    if (apiError?.message) {
      errorMessage.value = t(`error.${apiError.message}`)
    } else if (apiError?.code) {
      errorMessage.value = t(`error.${apiError.code}`)
    } else {
      errorMessage.value = t('error.UNEXPECTED_ERROR')
    }

    showToastMessage('error', errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

const onRegister = () => {
  router.push({ name: AuthRouterName.Register })
}

const onForgotPassword = () => {
  router.push({ name: AuthRouterName.ForgotPW })
}

onBeforeUnmount(() => {
  formData.value.email = ''
  formData.value.password = ''
  errors.value = {}
  errorMessage.value = null
  showToast.value = false
})
</script>

<template>
  <div
    class="w-full max-w-5xl flex flex-col md:flex-row rounded-lg border border-gray-200 overflow-hidden bg-white font-sans">
    <div class="flex-1 p-8 flex flex-col justify-center items-center h-auto max-h-[600px]">
      <h1 class="text-4xl font-bold mb-6 text-center">Quên mật khẩu</h1>
      <form class="space-y-4 w-full max-w-sm" @submit.prevent="onForgotPW">
        <p class="text-base font-medium mb-6 text-left">
          Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc đặt lại mật khẩu.
        </p>

        <InputText id="email" label="Email" v-model="formData.email" placeholder="Email" type="email"
          :error="errors.email" @input="onClearError('email')" class="w-full" />

        <div class="relative">
          <SubmitButton :text="'Gửi yêu cầu'" :disabled="isLoading" class="w-full" />
          <LoadingSpinner v-if="isLoading" class="absolute inset-0 flex justify-center items-center" />
        </div>
        <SubmitButton :text="'Hủy'" :disabled="isLoading" class="w-full" @click="onCancel" />
      </form>
      <div class="mt-6 text-center">
        <Toast v-if="showToast" :type="toastType" :message="toastMessage" @close="showToast = false" />
      </div>
    </div>
    <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">
      <BoxText :text="'Đăng Ký'" :disabled="isLoading" @click="onRegister" />
      <div class="flex justify-center">
        <img src="@/assets/image-auth.png" alt="Description of image" class="w-100 h-80 object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from '@/components/atoms/InputTextComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/auth/_utils/BoxTextComponent.vue'
import LoadingSpinner from '@/components/atoms/LoadingComponent.vue'
import Toast from '@/components/molecules/utils/ToastComponent.vue'
import router from '@/router'
import { AuthRouterName } from '@/enums/router'
import { DEFAULT_FORM_DATA } from '@/constants/auth/_utils/form'
import { AxiosError, isAxiosError } from 'axios'
import { forgotPasswordSchema } from '@/validations/form'
import { authApi } from '@/api/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()


const formData = ref(DEFAULT_FORM_DATA)
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const showToast = ref(false)
const toastType = ref<'success' | 'error' | 'warning'>('success')
const toastMessage = ref('')

const onClearError = (field: string) => {
  delete errors.value[field]
}

const onRegister = () => {
  router.push({ name: AuthRouterName.Register })
}

const onCancel = () => {
  router.push({ name: AuthRouterName.Login })
}

const showToastMessage = (type: 'success' | 'error' | 'warning', message: string) => {
  toastType.value = type
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const onForgotPW = async (event: Event) => {
  event.preventDefault()
  if (isLoading.value) return

  const validationResult = forgotPasswordSchema.safeParse(formData.value)
  if (!validationResult.success) {
    const fieldErrors = validationResult.error.formErrors.fieldErrors
    errors.value = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, value]) => [key, (value as string[] | undefined)?.[0] || ''])
    )
    return
  }

  try {
    isLoading.value = true
    const response = await authApi.forgotPassword(formData.value.email)

    showToastMessage('success', t('success.RESET_EMAIL_SENT'))
    setTimeout(() => {
      router.push({ name: AuthRouterName.Login })
    }, 3000)
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


</script>

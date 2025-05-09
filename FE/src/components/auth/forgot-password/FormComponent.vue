<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100 px-4">
    <div
      class="w-full max-w-5xl flex flex-col md:flex-row rounded-lg border border-gray-200 overflow-hidden bg-white font-sans">
      <div class="flex-1 p-8 flex flex-col justify-center items-center h-auto max-h-[600px]">
        <h1 class="text-4xl font-bold mb-6 text-center">{{ $t('auth.forgotPassword.title') }}</h1>
        <form class="mb-6 space-y-4 w-full max-w-sm" @submit.prevent="onForgotPW">
          <p class="text-base font-medium mb-6 text-left">{{ $t('auth.forgotPassword.description') }}</p>

          <InputText id="email" :label="$t('auth.forgotPassword.email')" v-model="formData.email" placeholder="Email"
            type="email" :error="errors.email" @input="onClearError('email')" class="w-full" />

          <div class="relative">
            <SubmitButton :text="$t('auth.forgotPassword.submitButton')" :disabled="isLoading || !isValidEmail"
              class="w-full" />
            <LoadingSpinner v-if="isLoading" class="absolute inset-0 flex justify-center items-center" />
          </div>
          <SubmitButton :text="$t('auth.forgotPassword.cancelButton')" :disabled="isLoading" class="w-full"
            @click="onCancel" />
        </form>
        <Toast v-if="toastMessageStore.isShowToast" :type="toastType" :message="toastMessage"
          @close="toastMessageStore.isShowToast = false" />
      </div>

      <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">
        <BoxText :text="$t('auth.register.title')" :disabled="isLoading" @click="onRegister" />
        <div class="flex justify-center">
          <img src="@/assets/image-auth.png" alt="Description of image" class="w-100 h-80 object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import InputText from '@/components/atoms/InputTextComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/auth/_utils/BoxTextComponent.vue'
import LoadingSpinner from '@/components/atoms/LoadingComponent.vue'
import Toast from '@/components/molecules/utils/ToastComponent.vue'
import router from '@/router'
import { AuthRouterEnum } from '@/enums/router'
import { forgotPasswordSchema } from '@/validations/form'
import { authApi } from '@/api/auth'
import { useI18n } from 'vue-i18n'
import { toCamelCase } from '@/helpers/stringUtils'
import type { AxiosError } from 'axios'
import { ToastEnum } from '@/enums/toast'
import { useToast } from '@/hooks/useToast'

const { t } = useI18n()
const { showToast, toastType, toastMessage, toastMessageStore } = useToast()

const formData = ref({ email: '' })
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const onClearError = (field: string) => {
  delete errors.value[field]
}

const isValidEmail = computed(() => {
  return forgotPasswordSchema.safeParse(formData.value).success
})

const onRegister = () => {
  router.push({ name: AuthRouterEnum.Register })
}

const onCancel = () => {
  router.push({ name: AuthRouterEnum.Login })
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

    console.log('Forgot Password Response:', response)

    showToast(ToastEnum.Success, t('success.resetEmailSent'))

    console.log('Toast Show - Success:', t('success.resetEmailSent'))

    router.push({ name: AuthRouterEnum.Login })
  } catch (error: unknown) {
    const apiError = error as AxiosError

    if (apiError?.message) {
      errorMessage.value = t(`error.${toCamelCase(apiError.message)}`)
    } else if (apiError?.code) {
      console.error(apiError.code)
      errorMessage.value = t(`error.${toCamelCase(apiError.code)}`)
      console.error(errorMessage.value)
    } else {
      errorMessage.value = t('error.unexpectedError')
    }

    showToast(ToastEnum.Error, errorMessage.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-white">
    <div class="flex-1 p-6 md:p-10 flex flex-col justify-center items-center">
      <h1 class="text-3xl md:text-4xl font-bold mb-6 text-center text-black">{{ $t('auth.forgotPassword.title') }}</h1>
      <form class="mb-6 space-y-4 w-full max-w-sm" @submit.prevent="onForgotPW">
        <p class="text-lg font-medium mb-6 text-left text-black">{{ $t('auth.forgotPassword.description') }}</p>

        <InputText id="email" :label="$t('auth.forgotPassword.email')" v-model="formData.email"
          placeholder="name@example.com" type="email" :error="errors.email" @input="onClearError('email')"
          class="w-full" />

        <div class="relative">
          <SubmitButton :text="$t('auth.forgotPassword.submitButton')" :disabled="isLoading || !isValidEmail"
            class="w-full bg-neutral-800" />
          <LoadingSpinner v-if="isLoading" class="absolute inset-0 flex justify-center items-center" />
        </div>
        <SubmitButton :text="$t('auth.forgotPassword.cancelButton')" :disabled="isLoading" class="w-full bg-neutral-800"
          @click="onCancel" />
      </form>
    </div>

    <div class="flex-1 bg-neutral-800 text-white p-6 md:p-10 font-sans flex flex-col justify-center items-center">
      <BoxText :text="$t('auth.register.title')" :disabled="isLoading" @click="onRegister" />
      <div class="flex justify-center">
        <ImagePlaceholder :src="imageSrc" alt="Description of image" />
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
import ImagePlaceholder from '@/components/atoms/ImagePlaceholderComponent.vue'

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
const imageSrc = new URL('@/assets/nen.jpg', import.meta.url).href
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

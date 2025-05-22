<template>
  <div class="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-white">
    <div class="flex-1 text-lg p-6 md:p-10 flex flex-col justify-center items-center">
      <h1 class="text-3xl md:text-2xl font-bold mb-6 text-center text-black">{{ $t('auth.resetPassword.title') }}</h1>
      <form class="space-y-4 w-full max-w-sm" @submit.prevent="onResetPW">
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.resetPassword.newPassword') }}<span
              class="text-red-500"> *</span></label>
          <PasswordInput id="newPassword" v-model="confirmPassword.newPassword" :error="errors.newPassword"
            @input="onClearError('newPassword')" class="w-full" />
        </div>

        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.resetPassword.confirmPassword') }}<span
              class="text-red-500"> *</span></label>
          <PasswordInput id="confirmPassword" v-model="confirmPassword.confirmPassword" :error="errors.confirmPassword"
            @input="onClearError('confirmPassword')" class="w-full" />
        </div>

        <div class="relative">
          <SubmitButton @click="onResetPW" :text="$t('auth.resetPassword.submitButton')" :disabled="isLoading"
            class="w-full flex justify-center items-center gap-2 py-2.5 mt-2 bg-neutral-800 hover:bg-neutral-900 text-white font-semibold rounded-lg transition disabled:opacity-60" />
          <LoadingSpinner v-if="isLoading" class="absolute inset-0 flex justify-center items-center" />
        </div>
      </form>

      <div class="flex items-center my-6 w-full max-w-sm">
        <div class="flex-grow border-t border-gray-200"></div>
        <span class="mx-4 text-gray-400 text-lg">{{ $t('auth.login.loginWith') }}</span>
        <div class="flex-grow border-t border-gray-200"></div>
      </div>
      <SocialLoginButton class="w-full max-w-sm mx-auto" />
    </div>

    <div class="flex-1 bg-neutral-800 text-white p-6 md:p-10 font-sans flex flex-col justify-center items-center">
      <BoxText :text="$t('auth.register.title')" @click="onRegister" :disabled="isLoading" />
      <div class="flex justify-center">
        <ImagePlaceholder :src="imageSrc" alt="Description of image" class="w-full" />
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
import LoadingSpinner from '@/components/atoms/LoadingComponent.vue'
import ImagePlaceholder from '@/components/atoms/ImagePlaceholderComponent.vue'
import { AxiosError } from 'axios'
import { authApi } from '@/api/auth'
import { DEFAULT_FORM_DATA, EMPTY_FORM_DATA } from '@/constants/auth/_utils/form'

import router from '@/router'
import { AuthRouterEnum } from '@/enums/router'
import { resetPasswordSchema } from '@/validations/form'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { toCamelCase } from '@/helpers/stringUtils'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'

const { t } = useI18n()
const route = useRoute()

const formData = ref(DEFAULT_FORM_DATA)
const confirmPassword = ref(EMPTY_FORM_DATA)
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const imageSrc = new URL('@/assets/nen.jpg', import.meta.url).href
const { showToast } = useToast()

onMounted(() => {
  const token = route.params.token
  if (!token) {
    showToast(ToastEnum.Error, t('error.INVALID_TOKEN'))
    router.push({ name: AuthRouterEnum.Login })
  }
})

const onClearError = (field: string) => {
  delete errors.value[field]
}

const onResetPW = async () => {
  if (isLoading.value) return

  const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token
  if (!token) {
    showToast(ToastEnum.Error, t('error.INVALID_TOKEN'))
    router.push({ name: AuthRouterEnum.Login })
    return
  }

  errors.value = {}

  const parsed = resetPasswordSchema.safeParse(confirmPassword.value)

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
      newPassword: confirmPassword.value.newPassword,
      confirmPassword: confirmPassword.value.confirmPassword,
    })
    showToast(ToastEnum.Success, t('success.passwordUpdated'))
    router.push({ name: AuthRouterEnum.Login })
  } catch (error: unknown) {
    const apiError = error as AxiosError

    if (apiError?.message) {
      errorMessage.value = t(`error.${toCamelCase(apiError.message)}`)
    } else if (apiError?.code) {
      errorMessage.value = t(`error.${toCamelCase(apiError.code)}`)
    } else {
      errorMessage.value = t('error.unexpectedError')
    }

    showToast(ToastEnum.Error, errorMessage.value)
  } finally {
    isLoading.value = false
  }
}


onUnmounted(() => {
  formData.value = DEFAULT_FORM_DATA
  confirmPassword.value = EMPTY_FORM_DATA
  errors.value = {}
  isLoading.value = false
})

const onRegister = () => {
  router.push({ name: AuthRouterEnum.Register })
}
</script>

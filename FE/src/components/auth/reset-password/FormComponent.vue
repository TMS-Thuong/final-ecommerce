<template>
  <div
    class="w-full max-w-5xl flex flex-col md:flex-row rounded-lg border border-gray-200 overflow-hidden bg-white font-sans">
    <div class="flex-1 p-8 flex flex-col justify-center items-center h-auto max-h-[600px]">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ $t('auth.resetPassword.title') }}</h1>
      <form class="space-y-4 w-full max-w-sm" @submit.prevent="onResetPW">
        <PasswordInput id="new-password" :label="$t('auth.resetPassword.newPassword')" v-model="formData.password"
          :error="errors.password" class="w-full" />
        <PasswordInput id="confirm-password" :label="$t('auth.resetPassword.confirmPassword')"
          v-model="confirmPassword.password" :error="errors.confirmPassword" class="w-full" />
        <SubmitButton :text="$t('auth.resetPassword.submitButton')" :disabled="isLoading" class="w-full" />
      </form>
      <div class="mt-6 text-center">
        <p class="text-base font-medium text-gray-700 mb-3">{{ $t('auth.resetPassword.orLogin') }}</p>
        <div class="flex justify-center">
          <SocialLoginButton />
        </div>
      </div>
      <Toast v-if="toastMessageStore.isShowToast" :type="toastType" :message="toastMessage"
        @close="toastMessageStore.isShowToast = false" />
    </div>
    <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">
      <BoxText :text="$t('auth.register.title')" @click="onRegister" :disabled="isLoading" />
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

const { showToast, toastType, toastMessage, toastMessageStore } = useToast()

onMounted(() => {
  const token = route.params.token
  if (!token) {
    showToast(ToastEnum.Error, t('error.INVALID_TOKEN'))
    router.push({ name: AuthRouterEnum.Login })
  }
})

const onResetPW = async () => {
  if (isLoading.value) return;

  const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token
  if (!token) {
    showToast(ToastEnum.Error, t('error.INVALID_TOKEN'))
    router.push({ name: AuthRouterEnum.Login })
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
    showToast(ToastEnum.Success, t('success.passwordUpdated'))
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

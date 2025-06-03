<template>
  <div class="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-white">
    <div class="flex-1 p-6 md:p-10 flex flex-col justify-center items-center text-lg">
      <h1 class="text-3xl md:text-5xl font-bold mb-2 text-black text-center">{{ $t('auth.login.welcomeBack') }}</h1>
      <p class="mb-8 text-gray-600 text-lg text-center">{{ $t('auth.login.enterDetails') }}</p>
      <form @submit.prevent="onLogin" class="space-y-4 w-full max-w-md text-center">
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.email') }}<span
              class="text-red-500">*</span></label>
          <InputText id="email" v-model="formData.email" placeholder="name@example.com" type="email"
            :error="errors.email" @input="onClearError('email')" class="w-full" />
        </div>
        <div class="text-left">
          <div class="flex justify-between items-center mb-1">
            <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.password') }}<span
                class="text-red-500">*</span></label>
            <button type="button" @click="onForgotPassword" class="text-lg text-blue-500 hover:underline">{{
              $t('auth.login.forgotPassword') }}</button>
          </div>
          <PasswordInput id="password" v-model="formData.password" :error="errors.password"
            @input="onClearError('password')" class="w-full" />
        </div>
        <SubmitButton :text="$t('auth.login.submitButton')" :disabled="isLoading"
          class="w-full flex justify-center items-center gap-2 py-2.5 mt-2 bg-neutral-800 hover:bg-neutral-900 text-white font-semibold rounded-lg transition disabled:opacity-60">
          <LoadingSpinner v-if="isLoading" class="absolute inset-0 flex justify-center items-center" />
        </SubmitButton>
      </form>
      <div class="flex items-center my-6 w-full max-w-md">
        <div class="flex-grow border-t border-gray-200"></div>
        <span class="mx-4 text-gray-400 text-lg">{{ $t('auth.login.loginWith') }}</span>
        <div class="flex-grow border-t border-gray-200"></div>
      </div>
      <SocialLoginButton class="w-full max-w-md mx-auto" />
      <div class="mt-6 text-center text-gray-600 text-lg w-full max-w-md mx-auto">
        Don't have an account? <button @click="onRegister" class="text-blue-500 font-semibold hover:underline">Sign
          up</button>
      </div>
    </div>
    <div class="flex-1 bg-neutral-800 text-white p-6 md:p-10 font-sans flex flex-col justify-center items-center">
      <BoxText :text="$t('auth.login.title')" :disabled="isLoading" @click="onLogin" />
      <ImagePlaceholder :src="imageSrc" alt="Description of image"
        class="flex justify-center h-80 w-auto object-contain" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, inject } from 'vue'
import InputText from '@/components/atoms/InputTextComponent.vue'
import PasswordInput from '@/components/atoms/auth/_utils/PasswordInputComponent.vue'
import SocialLoginButton from '@/components/atoms/auth/_utils/GoogleLoginButtonComponent.vue'
import BoxText from '@/components/molecules/auth/_utils/BoxTextComponent.vue'
import LoadingSpinner from '@/components/atoms/LoadingComponent.vue'
import ImagePlaceholder from '@/components/atoms/ImagePlaceholderComponent.vue'
import router from '@/router'
import { AuthRouterEnum, RouterEnum } from '@/enums/router'
import { DEFAULT_FORM_DATA } from '@/constants/auth/_utils/form'
import { AxiosError } from 'axios'
import { loginSchema } from '@/validations/form'
import { z } from 'zod'
import { authApi } from '@/api/auth'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth/login/token.store'
import { toCamelCase } from '@/helpers/stringUtils'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart/cart'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import { useWishlistStore } from '@/stores/wishlist/wishlist'

const { t } = useI18n()
const route = useRoute()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const forceHeaderUpdate = inject<() => void>('forceHeaderUpdate')

const formData = ref(DEFAULT_FORM_DATA)
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const imageSrc = new URL('@/assets/nen.jpg', import.meta.url).href

const { showToast, toastType, toastMessage, toastMessageStore } = useToast()
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

    useAuthStore().clearTokens();
    cartStore.clearCart();
    wishlistStore.clearWishlist();

    const response = await authApi.login(formDataToSend)

    const responseData = response?.data
    if (!responseData || !responseData.accessToken || !responseData.refreshToken) {
      throw new Error(t('error.noResponseData'))
    }

    const { accessToken, refreshToken } = responseData
    useAuthStore().setTokens(accessToken, refreshToken)

    showToast(ToastEnum.Success, t('success.loginSuccess'))

    await cartStore.initCart()
    await wishlistStore.initWishlist()
    forceHeaderUpdate && forceHeaderUpdate()

    const redirectPath = route.query.redirect as string | undefined

    if (redirectPath) {
      await cartStore.initCart();
      router.push(redirectPath)
    } else {
      await cartStore.initCart();
      router.push({ name: RouterEnum.Home })
    }
  } catch (error: unknown) {
    const apiError = error as AxiosError

    if (apiError?.code) {
      errorMessage.value = t(`error.${toCamelCase(apiError.code)}`)
    } else {
      errorMessage.value = t('error.unexpectedError')
    }

    showToast(ToastEnum.Error, errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

const onRegister = () => {
  router.push({ name: AuthRouterEnum.Register })
}

const onForgotPassword = () => {
  router.push({ name: AuthRouterEnum.ForgotPW })
}

onBeforeUnmount(() => {
  formData.value.email = ''
  formData.value.password = ''
  errors.value = {}
  errorMessage.value = null
})
</script>

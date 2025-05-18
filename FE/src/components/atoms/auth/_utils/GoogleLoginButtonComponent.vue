<template>
  <button type="button"
    class="text-black hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center inline-flex items-center justify-center border border-gray-300 shadow-sm"
    @click="onGoogleSignIn">
    <svg class="w-5 h-5 me-2 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
    {{ $t('auth.login.loginViaGoogle') }}
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gapi } from 'gapi-script'
import { authApi } from '@/api/auth'
import router from '@/router'
import { RouterEnum } from '@/enums/router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth/login/token.store'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'
import type { AxiosError } from 'axios'
import { toCamelCase } from '@/helpers/stringUtils'

interface ApiErrorResponse {
  code: string;
  message?: string;
}

const { t } = useI18n()

declare global {
  interface Window {
    initGoogleSignIn: () => void
  }
}

const { showToast } = useToast()

const errorMessage = ref<string | null>(null)

onMounted(() => {
  window.initGoogleSignIn = () => {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      });
    });
  };

  const script = document.createElement('script')
  script.src = 'https://apis.google.com/js/platform.js?onload=initGoogleSignIn'
  script.async = true
  document.head.appendChild(script)
})


const onGoogleSignIn = () => {
  if (!gapi.auth2) {
    console.error(t('error.googleApiNotInitialized'))
    return
  }

  const GoogleAuth = gapi.auth2.getAuthInstance()
  if (!GoogleAuth) {
    console.error('error.googleAuthInstanceNotFound')
    return
  }

  GoogleAuth.signIn()
    .then((googleUser: any) => {
      const idToken = googleUser.getAuthResponse().id_token
      onGoogleLogin(idToken)
    })
    .catch((error) => {
      console.error(t('error.googleSigninFailed'), error)
      showToast(ToastEnum.Error, t('error.googleSigninFailed'))
    })
}

const onGoogleLogin = async (idToken: string) => {
  try {
    const response = await authApi.loginViaGoogle(idToken);
    const responseData = response?.data
    if (!responseData || !responseData.accessToken || !responseData.refreshToken) {
      throw new Error(t('error.noResponseData'))
    }
    const { accessToken, refreshToken } = responseData
    useAuthStore().setTokens(accessToken, refreshToken)
    showToast(ToastEnum.Success, t('success.loginSuccess'))
    router.push({ name: RouterEnum.Home });
  } catch (error) {
    const apiError = error as AxiosError<{ message: string; code: string }>
    if (apiError?.response?.data?.code) {
      errorMessage.value = t(`error.${apiError.response.data.code.toLowerCase()}`)
    } else if (apiError?.response?.data?.message) {
      errorMessage.value = apiError.response.data.message
    } else {
      errorMessage.value = t('error.unexpectedError')
    }
    showToast(ToastEnum.Error, errorMessage.value)
  }
}
</script>

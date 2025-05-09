<template>
  <button type="button"
    class="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
    @click="onGoogleSignIn">
    <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
      viewBox="0 0 18 19">
      <path fill-rule="evenodd"
        d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
        clip-rule="evenodd" />
    </svg>
    Google
  </button>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { gapi } from 'gapi-script'
import { authApi } from '@/api/auth'
import router from '@/router'
import { RouterEnum } from '@/enums/router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth/login/token.store'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'

const { t } = useI18n()

declare global {
  interface Window {
    initGoogleSignIn: () => void
  }
}

const { showToast } = useToast()


onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://apis.google.com/js/platform.js?onload=initGoogleSignIn'
  script.async = true
  document.head.appendChild(script)

  script.onload = () => {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      })
    })
  }
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
    console.log(response);
    if (response.data && response.data.accessToken && response.data.refreshToken) {
      const { accessToken, refreshToken } = response.data;
      useAuthStore().setTokens(accessToken, refreshToken)
      await nextTick();
      router.push({ name: RouterEnum.Home });
      showToast(ToastEnum.Success, t('success.googleSignInSuccess'));
    } else {
      showToast(ToastEnum.Error, t('error.noResponseData'));
    }
  } catch (error) {
    showToast(ToastEnum.Error, t('error.serverError'));
  }
}
</script>

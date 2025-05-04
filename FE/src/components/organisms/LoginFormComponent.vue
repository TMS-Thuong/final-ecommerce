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
      <div v-if="responseMessage" class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
        {{ responseMessage }}
      </div>
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>
    </div>
    <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">

      <BoxText :text="'Đăng Ký'" :disabled="false" @click="onRegister" />
      <div class="flex justify-center">
        <img src="@/assets/image1.png" alt="Description of image" class="w-100 h-80 object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import InputText from '@/components/atoms/InputTextComponent.vue'
import PasswordInput from '@/components/atoms/PasswordInputComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/BoxTextComponent.vue'
import SocialLoginButton from '@/components/atoms/GoogleLoginButtonComponent.vue'
import instanceAxios from '@/helpers/configAxios'
import { ApiEndpoint } from '@/api/api'
import router from '@/router'
import { RouterName } from '@/enums/router'
import { DEFAULT_FORM_DATA } from '@/constants/form'
import { AxiosError } from 'axios'
import { loginSchema } from '@/validations/form'
import { z } from 'zod'

const formData = ref(DEFAULT_FORM_DATA)
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const responseMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

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

  try {
    const formDataToSend = {
      email: formData.value.email,
      password: formData.value.password,
    }

    const response = await instanceAxios.post(ApiEndpoint.auth.loginByEmail, formDataToSend)

    const { accessToken, refreshToken } = response.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    router.push({ name: RouterName.Home })
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Login failed:', error)
      errorMessage.value =
        error?.response?.data?.message || 'Đã xảy ra lỗi trong quá trình đăng nhập.'
    } else {
      console.error('Error during login:', error)
      errorMessage.value = 'Đã xảy ra lỗi trong quá trình đăng nhập.'
    }

    setTimeout(() => {
      errorMessage.value = null
    }, 2000)
  }
}


const onRegister = () => {
  router.push({ name: RouterName.Register })
}

const onForgotPassword = () => {
}

onBeforeUnmount(() => {
  formData.value.email = ''
  formData.value.password = ''
  errors.value = {}
  errorMessage.value = null
  responseMessage.value = null
})
</script>

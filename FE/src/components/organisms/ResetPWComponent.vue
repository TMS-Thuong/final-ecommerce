<template>
  <div
    class="w-full max-w-5xl flex flex-col md:flex-row rounded-lg border border-gray-200 overflow-hidden bg-white font-sans"
  >
    <div class="flex-1 p-8 flex flex-col justify-center items-center h-auto max-h-[600px]">
      <h1 class="text-2xl font-bold mb-6 text-center">Khôi phục mật khẩu</h1>
      <form class="space-y-4 w-full max-w-sm" @submit.prevent="onResetPW">
        <PasswordInput
          id="new-password"
          label="Mật khẩu mới"
          v-model="formData.password"
          :error="errors.password"
          class="w-full"
        />
        <PasswordInput
          id="confirm-password"
          label="Xác nhận mật khẩu"
          v-model="confirmPassword.password"
          :error="errors.password"
          class="w-full"
        />
        <SubmitButton :text="'Đặt lại mật khẩu'" :disabled="isLoading" class="w-full" />
      </form>
      <div class="mt-6 text-center">
        <p class="text-base font-medium text-gray-700 mb-3">Hoặc đăng nhập bằng</p>
        <div class="flex justify-center">
          <SocialLoginButton />
        </div>
      </div>
      <div v-if="responseMessage" class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
        {{ responseMessage }}
      </div>
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>
    </div>
    <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">
      <BoxText :text="'Đăng Ký'" @click="onRegister" :disabled="isLoading" />
      <div class="flex justify-center">
        <img src="@/assets/image1.png" alt="Description of image" class="w-100 h-80 object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PasswordInput from '@/components/atoms/PasswordInputComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/BoxTextComponent.vue'
import SocialLoginButton from '@/components/atoms/GoogleLoginButtonComponent.vue'
import { AxiosError } from 'axios'
import instanceAxios from '@/helpers/configAxios'
import { ApiEndpoint } from '@/api/api'
import { DEFAULT_FORM_DATA, EMPTY_FORM_DATA } from '@/constants/form'
import router from '@/router'
import { RouterName } from '@/enums/router'

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
})

const formData = ref(DEFAULT_FORM_DATA)
const confirmPassword = ref(EMPTY_FORM_DATA)
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const responseMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const onResetPW = async () => {
  if (formData.value.password !== confirmPassword.value.password) {
    errorMessage.value = 'Mật khẩu mới và xác nhận mật khẩu không trùng khớp'
    return
  }

  if (isLoading.value) {
    return
  }

  isLoading.value = true
  try {
    const response = await instanceAxios.post(ApiEndpoint.auth.resetPW, {
      token: props.token,
      newPassword: formData.value.password,
      confirmPassword: confirmPassword.value.password,
    })

    const message = response.data.data.message
    responseMessage.value = message
    formData.value.password = ''
    setTimeout(() => {
      router.push({ name: RouterName.Login })
    }, 2000)
  } catch (error) {
    if (error instanceof AxiosError) {
      errorMessage.value = error.response?.data?.message || 'Đã có lỗi xảy ra'
    } else {
      errorMessage.value = 'Đã có lỗi xảy ra'
    }
  } finally {
    isLoading.value = false
  }
}

const onRegister = () => {
  router.push({ name: RouterName.Register })
}
</script>

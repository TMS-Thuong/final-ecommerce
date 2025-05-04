<template>
  <div
    class="w-full max-w-5xl flex flex-col md:flex-row rounded-lg border border-gray-200 overflow-hidden bg-white font-sans">
    <div class="flex-1 p-8">
      <h1 class="text-xl font-bold mb-6">Đăng Ký Tài Khoản</h1>
      <form @submit.prevent="onRegister" class="space-y-4">
        <InputText id="lastName" label="Họ" v-model="formData.lastName" placeholder="Họ" :error="errors.lastName"
          @input="onClearError('lastName')" />
        <InputText id="firstName" label="Tên" v-model="formData.firstName" placeholder="Tên" :error="errors.firstName"
          @input="onClearError('firstName')" />
        <InputText id="email" label="Email" v-model="formData.email" placeholder="Email" type="email"
          :error="errors.email" @input="onClearError('email')" />
        <PasswordInput id="password" v-model="formData.password" :error="errors.password"
          @input="onClearError('password')" />
        <InputText id="birthDate" label="Ngày sinh" v-model="formData.birthDate" placeholder="Ngày sinh" type="date"
          :error="errors.birthDate" @input="onClearError('birthDate')" />
        <RadioButtonGroup label="Giới tính" :options="genderOptions" name="gender" v-model="formData.gender"
          :error="errors.gender" />
        <SubmitButton :text="isLoading ? 'Đang xử lý...' : 'Đăng ký'" :disabled="isLoading" />
      </form>
      <div class="mt-6 text-center">
        <p class="text-sm font-medium text-gray-700 mb-3">Hoặc đăng nhập bằng</p>
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
      <BoxText :text="'Đăng Nhập'" :disabled="isLoading" @click="onLogin" />
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
import RadioButtonGroup from '@/components/molecules/RadioButtonGroupComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/BoxTextComponent.vue'
import SocialLoginButton from '@/components/atoms/GoogleLoginButtonComponent.vue'
import { z } from 'zod'
import instanceAxios from '@/helpers/configAxios'
import { registerSchema } from '../../validations/form'
import { DEFAULT_FORM_DATA, GENDER_OPTIONS } from '@/constants/form'
import { ApiEndpoint } from '@/api/api'
import router from '@/router'
import { RouterName } from '@/enums/router'

const formData = ref(DEFAULT_FORM_DATA)
const genderOptions = GENDER_OPTIONS
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const responseMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const onClearError = (field: string) => {
  delete errors.value[field]
}

const onRegister = async () => {
  if (isLoading.value) return
  isLoading.value = true
  responseMessage.value = null
  errorMessage.value = null
  try {
    await registerSchema.parseAsync(formData.value)
    const response = await instanceAxios.post(ApiEndpoint.auth.register, formData.value)
    if (response.data && response.data.success && response.data.data.message) {
      responseMessage.value = response.data.data.message
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const newErrors: { [key: string]: string } = {}
      err.errors.forEach((e) => {
        newErrors[e.path[0]] = e.message
      })
      errors.value = newErrors
    } else {
      const axiosError = err as { response?: { data?: { message?: string } } }
      errorMessage.value =
        axiosError.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại!'
    }
  } finally {
    isLoading.value = false
  }
}
const onLogin = () => {
  router.push({ name: RouterName.Login })
}
onBeforeUnmount(() => {
  formData.value.lastName = ''
  formData.value.firstName = ''
  formData.value.email = ''
  formData.value.password = ''
  formData.value.birthDate = ''
  formData.value.gender = 0
  errors.value = {}
  errorMessage.value = null
  responseMessage.value = null
})
</script>

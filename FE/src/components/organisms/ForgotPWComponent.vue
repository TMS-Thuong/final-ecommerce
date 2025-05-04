<template>
  <div
    class="w-full max-w-5xl flex flex-col md:flex-row rounded-lg border border-gray-200 overflow-hidden bg-white font-sans"
  >
    <div class="flex-1 p-8 flex flex-col justify-center items-center h-auto max-h-[600px]">
      <h1 class="text-4xl font-bold mb-6 text-center">Quên mật khẩu</h1>
      <form class="space-y-4 w-full max-w-sm">
        <p class="text-base font-medium mb-6 text-left">
          Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc đặt lại mật khẩu.
        </p>

        <InputText
          id="email"
          label="Email"
          v-model="formData.email"
          placeholder="Email"
          type="email"
          :error="errors.email"
          @input="onClearError('email')"
          class="w-full"
        />

        <SubmitButton
          :text="'Gửi yêu cầu'"
          :disabled="isLoading"
          class="w-full"
          @click="onForgotPW"
        />
        <SubmitButton :text="'Hủy'" :disabled="isLoading" class="w-full" @click="onCancel" />
      </form>

      <div v-if="responseMessage" class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
        {{ responseMessage }}
      </div>
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>
    </div>
    <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">
      <BoxText :text="'Đăng Ký'" :disabled="isLoading" @click="onRegister" />
      <div class="flex justify-center">
        <img src="@/assets/image1.png" alt="Description of image" class="w-100 h-80 object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from '@/components/atoms/InputTextComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/BoxTextComponent.vue'
import instanceAxios from '@/helpers/configAxios'
import { ApiEndpoint } from '@/api/api'
import router from '@/router'
import { RouterName } from '@/enums/router'
import { DEFAULT_FORM_DATA } from '@/constants/form'
import { AxiosError } from 'axios'
import { forgotPasswordSchema } from '@/validations/form'

const formData = ref(DEFAULT_FORM_DATA)
const errors = ref<{ [key: string]: string }>({})
const isLoading = ref(false)
const responseMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const onClearError = (field: string) => {
  delete errors.value[field]
}
const onRegister = () => {
  router.push({ name: RouterName.Register })
}
const onCancel = () => {
  router.push({ name: RouterName.Login })
}

const onForgotPW = async (event: Event) => {
  event.preventDefault();
  if (isLoading.value) return

  const validationResult = forgotPasswordSchema.safeParse(formData.value)
  if (!validationResult.success) {
      const fieldErrors = validationResult.error.formErrors.fieldErrors;
      errors.value = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] || ''])
      );
      return
  }

  try {
    isLoading.value = true
    const response = await instanceAxios.post(ApiEndpoint.auth.forgotPW, formData.value)
    responseMessage.value = response.data.message
    setTimeout(() => {
      router.push({ name: RouterName.Login })
    }, 3000)
  } catch (error) {
    if (error instanceof AxiosError) {
      errorMessage.value = error.response?.data.message
    }
  } finally {
    isLoading.value = false
  }
}

</script>

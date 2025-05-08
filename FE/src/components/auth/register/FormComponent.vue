<template>
  <div
    class="mt-10 w-full max-w-5xl flex flex-col md:flex-row rounded-lg border border-gray-200 overflow-hidden bg-white font-sans">
    <div class="flex-1 p-8">
      <h1 class="text-3xl font-bold mb-6">Đăng Ký Tài Khoản</h1>
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
        <div class="relative">
          <SubmitButton :text="'Đăng ký'" :disabled="isLoading" class="w-full" />
          <LoadingSpinner v-if="isLoading" class="absolute inset-0 flex justify-center items-center" />
        </div>
      </form>
      <p class="mt-6 text-center text-gray-600 text-base">Nếú không nhận được email xác thực.
        <button class="text-blue-700 hover:underline" :disabled="isLoading" @click="onResentEmailVerify">Gửi
          lại</button>
      </p>
      <div class="mt-6 text-center">
        <p class="text-base font-medium text-gray-700 mb-3">Hoặc đăng nhập bằng</p>
        <div class="flex justify-center">
          <SocialLoginButton />
        </div>
      </div>
      
      <Toast v-if="showToast" :type="toastType" :message="toastMessage" @close="showToast = false" />

    </div>
    <div class="flex-1 bg-[#704F38] text-white p-8 font-sans">
      <BoxText :text="'Đăng Nhập'" :disabled="isLoading" @click="onLogin" />
      <div class="flex justify-center">
        <ImagePlaceholder :src="imageSrc" alt="Description of image" />

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from '@/components/atoms/InputTextComponent.vue'
import PasswordInput from '@/components/atoms/auth/_utils/PasswordInputComponent.vue'
import RadioButtonGroup from '@/components/molecules/auth/_utils/RadioButtonGroupComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/auth/_utils/BoxTextComponent.vue'
import LoadingSpinner from '@/components/atoms/LoadingComponent.vue'
import SocialLoginButton from '@/components/atoms/auth/_utils/GoogleLoginButtonComponent.vue'
import Toast from '@/components/molecules/utils/ToastComponent.vue'
import ImagePlaceholder from '@/components/atoms/ImagePlaceholderComponent.vue'
import { z } from 'zod'
import { registerSchema } from '@/validations/form'
import { DEFAULT_FORM_DATA, GENDER_OPTIONS } from '@/constants/auth/_utils/form'
import router from '@/router'
import { AuthRouterName } from '@/enums/router'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth/register/email.store'

const authStore = useAuthStore()
const formData = reactive({ ...DEFAULT_FORM_DATA })
const genderOptions = GENDER_OPTIONS
const errors = reactive<{ [key: string]: string }>({})
const isLoading = ref(false)

const showToast = ref(false)
const toastType = ref<'success' | 'error' | 'warning'>('success')
const toastMessage = ref('')

const { t } = useI18n()

const showToastMessage = (type: 'success' | 'error' | 'warning', message: string) => {
  toastType.value = type
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const onClearError = (field: string) => {
  delete errors[field]
}

const imageSrc = new URL('@/assets/image-auth.png', import.meta.url).href

const onRegister = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    await registerSchema.parseAsync(formData);

    const response = await authApi.register(formData);

    if (response.data && response.data.code) {
      showToastMessage('success', t(`success.${response.data.code}`));
    } else {
      showToastMessage('success', t('success.REGISTRATION_SUCCESS'));
    }
    authStore.setEmail(formData.email);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const newErrors: { [key: string]: string } = {};
      err.errors.forEach((e) => {
        newErrors[e.path[0]] = e.message;
      });
      Object.assign(errors, newErrors);
    } else {
      const code = (err as any).code || 'UNEXPECTED_ERROR';
      const msg = t(`error.${code}`) || t('error.UNEXPECTED_ERROR');
      showToastMessage('error', msg);
    }
  } finally {
    isLoading.value = false;
  }
};

const onResentEmailVerify = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    await authApi.resendVerificationEmail(authStore.email);
    showToastMessage('success', t('success.RESET_EMAIL_SENT'));
  } catch (err) {
    if (err && typeof err === 'object' && 'response' in err) {
      const errorResponse = err.response as { data?: { message?: string } };
      showToastMessage('error', errorResponse.data?.message || t('error.UNEXPECTED_ERROR'));
    } else {
      showToastMessage('error', ('error.EMAIL_NOT_SENT'));
    }
  } finally {
    isLoading.value = false;
  }
};

const onLogin = () => {
  router.push({ name: AuthRouterName.Login })
}

onBeforeUnmount(() => {
  Object.assign(formData, DEFAULT_FORM_DATA)
  Object.keys(errors).forEach(key => delete errors[key])
  showToast.value = false
})
</script>



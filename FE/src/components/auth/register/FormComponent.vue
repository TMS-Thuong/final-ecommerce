<template>
  <div class="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-white">
    <div class="flex-1 p-6 md:p-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ $t('auth.register.title') }}</h1>
      <p class="mb-6 text-gray-500 text-lg">{{ $t('auth.register.registerDescription') }}</p>
      <form @submit.prevent="onRegister" class="space-y-4">
        <div class="flex flex-col gap-4 md:flex-row">
          <div class="w-full md:w-1/2">
            <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.firstName') }}<span
                class="text-red-500">*</span></label>
            <InputText id="firstName" :label="$t('auth.register.firstName')" v-model="formData.firstName"
              :placeholder="$t('auth.register.firstName')" :error="errors.firstName"
              @input="onClearError('firstName')" />
          </div>
          <div class="w-full md:w-1/2">
            <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.lastName') }}<span
                class="text-red-500">*</span></label>
            <InputText id="lastName" :label="$t('auth.register.lastName')" v-model="formData.lastName"
              :placeholder="$t('auth.register.lastName')" :error="errors.lastName" @input="onClearError('lastName')" />
          </div>
        </div>
        <div>
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.email') }}<span
              class="text-red-500">*</span></label>
          <InputText id="email" v-model="formData.email" placeholder="name@example.com" type="email"
            :error="errors.email" @input="onClearError('email')" class="w-full" />
        </div>
        <div>
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.password') }}<span
              class="text-red-500">*</span></label>
          <PasswordInput id="password" :label="$t('auth.register.password')" v-model="formData.password"
            :error="errors.password" @input="onClearError('password')" />
        </div>
        <div>
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.birthDate') }}<span
              class="text-red-500">*</span></label>
          <InputText id="birthDate" :label="$t('auth.register.birthDate')" v-model="formData.birthDate"
            :placeholder="$t('auth.register.gender')" type="date" :error="errors.birthDate"
            @input="onClearError('birthDate')" class="text-gray-400" />
        </div>
        <div>
          <RadioButtonGroup :label="$t('auth.register.gender')" :options="genderOptions" name="gender"
            v-model="formData.gender" :error="errors.gender" />
        </div>
        <div class="relative">
          <SubmitButton :text="$t('auth.register.submitButton')" :disabled="isLoading" class="w-full" />
          <LoadingSpinner v-if="isLoading" class="absolute inset-0 flex justify-center items-center" />
        </div>
      </form>
      <p class="mt-6 text-center text-gray-600 text-lg">{{ $t('auth.register.emailVerifyText') }}
        <button class="text-blue-500 hover:underline" :disabled="isLoading" @click="onResentEmailVerify">{{
          $t('auth.register.resendButton') }}</button>
      </p>
      <div class="mt-6 text-center">
        <div class="flex items-center my-6">
          <div class="flex-grow border-t border-gray-200"></div>
          <span class="mx-4 text-gray-400 text-lg font-medium">{{ $t('auth.register.loginWith') }}</span>
          <div class="flex-grow border-t border-gray-200"></div>
        </div>
        <div class="flex justify-center">
          <SocialLoginButton />
        </div>
        <div class="mt-6 text-center text-gray-600 text-lg w-full max-w-md mx-auto">
          {{ $t('auth.register.alreadyHaveAccount') }}
          <Button @click="onLogin" class="text-blue-500 font-semibold hover:underline">Sign in</Button>
        </div>
      </div>
    </div>
    <div class="flex-1 bg-neutral-800 text-white p-6 md:p-10 font-sans flex flex-col justify-center items-center">
      <BoxText :text="$t('auth.login.title')" :disabled="isLoading" @click="onLogin" />
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
import ImagePlaceholder from '@/components/atoms/ImagePlaceholderComponent.vue'
import { z } from 'zod'
import { registerSchema } from '@/validations/form'
import { DEFAULT_FORM_DATA, GENDER_OPTIONS } from '@/constants/auth/_utils/form'
import router from '@/router'
import { AuthRouterEnum } from '@/enums/router'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth/register/email.store'
import { toCamelCase } from '@/helpers/stringUtils'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'

const authStore = useAuthStore()
const formData = reactive({ ...DEFAULT_FORM_DATA })
const genderOptions = GENDER_OPTIONS
const errors = reactive<{ [key: string]: string }>({})
const isLoading = ref(false)

const { showToast, toastType, toastMessage, toastMessageStore } = useToast()

const { t } = useI18n()

const onClearError = (field: string) => {
  delete errors[field]
}

const imageSrc = new URL('@/assets/nen.jpg', import.meta.url).href

const onRegister = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    await registerSchema.parseAsync(formData);

    const response = await authApi.register(formData);

    if (response.data && response.data.code) {
      showToast(ToastEnum.Success, t(`success.${toCamelCase(response.data.code)}`));
    } else {
      showToast(ToastEnum.Success, t('success.registrationSuccess'));
    }
    router.push({ name: AuthRouterEnum.Login })
    authStore.setEmail(formData.email);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const newErrors: { [key: string]: string } = {};
      err.errors.forEach((e) => {
        newErrors[e.path[0]] = e.message;
      });
      Object.assign(errors, newErrors);
    } else {
      const code = (err as any).code || 'unexpectedError';
      const msg = t(`error.${toCamelCase(code)}`) || t('error.unexpectedError');
      showToast(ToastEnum.Error, msg);
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
    showToast(ToastEnum.Success, t('success.resetEmailSent'));
  } catch (err) {
    if (err && typeof err === 'object' && 'response' in err) {
      const errorResponse = err.response as { data?: { message?: string } };
      showToast(ToastEnum.Error, errorResponse.data?.message || t('error.unexpectedError'));
    } else {
      showToast(ToastEnum.Error, t('error.emailNotSent'));
    }
  } finally {
    isLoading.value = false;
  }
};

const onLogin = () => {
  router.push({ name: AuthRouterEnum.Login })
}

onBeforeUnmount(() => {
  Object.assign(formData, DEFAULT_FORM_DATA)
  Object.keys(errors).forEach(key => delete errors[key])
})
</script>

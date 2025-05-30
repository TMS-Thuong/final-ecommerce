<template>
  <div class="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-white">
    <!-- Left side - Form -->
    <div class="flex-1 p-6 md:p-10 flex flex-col justify-center">
      <h1 class="text-3xl md:text-5xl font-bold mb-2 text-black text-center">
        {{ $t('auth.register.title') }}
      </h1>
      <p class="mb-8 text-gray-600 text-lg text-center">
        {{ $t('auth.register.registerDescription') }}
      </p>

      <form @submit.prevent="onRegister" class="space-y-4 w-full max-w-md mx-auto">
        <!-- First Name & Last Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="text-left">
            <label class="block text-lg font-medium text-gray-700">
              {{ $t('auth.register.firstName') }}<span class="text-red-500">*</span>
            </label>
            <InputText id="firstName" v-model="formData.firstName" :error="errors.firstName"
              @input="onClearError('firstName')" class="w-full" />
          </div>
          <div class="text-left">
            <label class="block text-lg font-medium text-gray-700">
              {{ $t('auth.register.lastName') }}<span class="text-red-500">*</span>
            </label>
            <InputText id="lastName" v-model="formData.lastName" :error="errors.lastName"
              @input="onClearError('lastName')" class="w-full" />
          </div>
        </div>

        <!-- Email -->
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">
            {{ $t('auth.register.email') }}<span class="text-red-500">*</span>
          </label>
          <InputText id="email" v-model="formData.email" type="email" placeholder="name@example.com"
            :error="errors.email" @input="onClearError('email')" class="w-full" />
        </div>

        <!-- Password -->
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">
            {{ $t('auth.register.password') }}<span class="text-red-500">*</span>
          </label>
          <PasswordInput id="password" v-model="formData.password" :error="errors.password"
            @input="onClearError('password')" class="w-full" />
        </div>

        <!-- Birth Date -->
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">
            {{ $t('auth.register.birthDate') }}<span class="text-red-500">*</span>
          </label>
          <InputText id="birthDate" v-model="formData.birthDate" type="date" :error="errors.birthDate"
            @input="onClearError('birthDate')" class="w-full" />
        </div>

        <!-- Gender -->
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">
            {{ $t('auth.register.gender') }}<span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-3 gap-4 mt-2">
            <button v-for="option in genderOptions" :key="option.value" type="button"
              @click="formData.gender = option.value" class="p-3 border rounded-lg text-center transition" :class="[
                formData.gender === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              ]">
              {{ $t(`common.form.gender.${option.value}`) }}
            </button>
          </div>
          <p v-if="errors.gender" class="mt-1 text-sm text-red-600">
            {{ errors.gender }}
          </p>
        </div>

        <!-- Submit Button -->
        <SubmitButton :text="$t('auth.register.submitButton')" :disabled="isLoading"
          class="w-full flex justify-center items-center gap-2 py-2.5 mt-6 bg-neutral-800 hover:bg-neutral-900 text-white font-semibold rounded-lg transition disabled:opacity-60">
          <LoadingSpinner v-if="isLoading" class="absolute inset-0 flex justify-center items-center" />
        </SubmitButton>

        <!-- Email Verification Text -->
        <p class="mt-6 text-center text-gray-600 text-lg">
          {{ $t('auth.register.emailVerifyText') }}
          <button class="text-blue-500 hover:underline" :disabled="isLoading" @click="onResentEmailVerify">
            {{ $t('auth.register.resendButton') }}
          </button>
        </p>

        <!-- Social Login -->
        <div class="mt-6">
          <div class="flex items-center my-6">
            <div class="flex-grow border-t border-gray-200"></div>
            <span class="mx-4 text-gray-400 text-lg font-medium">{{ $t('auth.register.loginWith') }}</span>
            <div class="flex-grow border-t border-gray-200"></div>
          </div>
          <div class="flex justify-center">
            <SocialLoginButton />
          </div>
        </div>

        <!-- Login Link -->
        <p class="mt-6 text-center text-gray-600 text-lg">
          {{ $t('auth.register.alreadyHaveAccount') }}
          <button @click="onLogin" class="text-blue-500 font-semibold hover:underline">
            {{ $t('auth.register.login') }}
          </button>
        </p>
      </form>
    </div>

    <!-- Right side - Image -->
    <div class="hidden md:block md:w-1/2 bg-neutral-800 text-white p-10 flex flex-col justify-center items-center">
      <BoxText :text="$t('auth.login.title')" :disabled="isLoading" @click="onLogin" />
      <div class="flex justify-center mt-6">
        <ImagePlaceholder :src="imageSrc" alt="Register" class="rounded-lg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from '@/components/atoms/InputTextComponent.vue'
import PasswordInput from '@/components/atoms/auth/_utils/PasswordInputComponent.vue'
import SubmitButton from '@/components/atoms/SubmitButtonComponent.vue'
import BoxText from '@/components/molecules/auth/_utils/BoxTextComponent.vue'
import LoadingSpinner from '@/components/atoms/LoadingComponent.vue'
import SocialLoginButton from '@/components/atoms/auth/_utils/GoogleLoginButtonComponent.vue'
import ImagePlaceholder from '@/components/atoms/ImagePlaceholderComponent.vue'
import { z } from 'zod'
import { registerSchema } from '@/validations/form'
import { DEFAULT_FORM_DATA } from '@/constants/auth/_utils/form'
import router from '@/router'
import { AuthRouterEnum } from '@/enums/router'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth/register/email.store'
import { toCamelCase } from '@/helpers/stringUtils'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/enums/toast'

const authStore = useAuthStore()
const formData = reactive({ ...DEFAULT_FORM_DATA })
const errors = reactive<{ [key: string]: string }>({})
const isLoading = ref(false)

const { showToast } = useToast()
const { t } = useI18n()

const genderOptions = [
  { value: 'male', label: t('common.form.gender.male') },
  { value: 'female', label: t('common.form.gender.female') },
  { value: 'other', label: t('common.form.gender.other') }
]

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
      router.push({ name: AuthRouterEnum.Login });
      authStore.setEmail(formData.email);
    } else {
      showToast(ToastEnum.Success, t('success.registrationSuccess'));
      router.push({ name: AuthRouterEnum.Login });
      authStore.setEmail(formData.email);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const newErrors: { [key: string]: string } = {};
      err.errors.forEach((e) => {
        newErrors[e.path[0]] = e.message;
      });
      Object.assign(errors, newErrors);
    } else if (err && typeof err === 'object' && 'response' in err) {
      const errorResponse = err.response as { data?: { code?: string; message?: string } };
      const code = errorResponse.data?.code || 'unexpectedError';
      const msg = t(`error.${toCamelCase(code)}`) || errorResponse.data?.message || t('error.unexpectedError');
      showToast(ToastEnum.Error, msg);
    } else {
      showToast(ToastEnum.Error, t('error.unexpectedError'));
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

<style scoped>
@media (max-width: 768px) {
  .max-w-md {
    width: 100%;
  }
}
</style>

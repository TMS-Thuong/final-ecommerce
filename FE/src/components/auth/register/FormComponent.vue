<template>
  <div class="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-white">
    <div class="flex-1 p-6 md:p-10 flex flex-col justify-center items-center text-lg">
      <h1 class="text-3xl md:text-5xl font-bold mb-2 text-black text-center">{{ $t('auth.register.title') }}</h1>
      <p class="mb-8 text-gray-600 text-lg text-center">{{ $t('auth.register.registerDescription') }}</p>
      <form @submit.prevent="onRegister" class="space-y-4 w-full max-w-md text-center">
        <div class="flex flex-col gap-4 md:flex-row">
          <div class="w-full md:w-1/2 text-left">
            <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.firstName') }}<span
                class="text-red-500">*</span></label>
            <InputText id="firstName" :label="$t('auth.register.firstName')" v-model="formData.firstName"
              :placeholder="$t('auth.register.firstName')" :error="errors.firstName" @input="onClearError('firstName')"
              class="w-full" />
          </div>
          <div class="w-full md:w-1/2 text-left">
            <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.lastName') }}<span
                class="text-red-500">*</span></label>
            <InputText id="lastName" :label="$t('auth.register.lastName')" v-model="formData.lastName"
              :placeholder="$t('auth.register.lastName')" :error="errors.lastName" @input="onClearError('lastName')"
              class="w-full" />
          </div>
        </div>
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.email') }}<span
              class="text-red-500">*</span></label>
          <InputText id="email" v-model="formData.email" placeholder="name@example.com" type="email"
            :error="errors.email" @input="onClearError('email')" class="w-full" />
        </div>
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.password') }}<span
              class="text-red-500">*</span></label>
          <PasswordInput id="password" :label="$t('auth.register.password')" v-model="formData.password"
            :error="errors.password" @input="onClearError('password')" class="w-full" />
        </div>
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.birthDate') }}<span
              class="text-red-500">*</span></label>
          <InputText id="birthDate" :label="$t('auth.register.birthDate')" v-model="formData.birthDate"
            :placeholder="$t('auth.register.gender')" type="date" :error="errors.birthDate"
            @input="onClearError('birthDate')" class="w-full text-gray-400" />
        </div>
        <div class="text-left">
          <label class="block text-lg font-medium text-gray-700">{{ $t('auth.register.gender') }}<span
              class="text-red-500">*</span></label>
          <RadioButtonGroup :label="$t('auth.register.gender')" :options="genderOptionsTranslated" name="gender"
            v-model="formData.gender" :error="errors.gender" class="w-full" />
        </div>
        <SubmitButton :text="$t('auth.register.submitButton')" :disabled="isLoading"
          class="w-full flex justify-center items-center gap-2 py-2.5 mt-2 bg-neutral-800 hover:bg-neutral-900 text-white font-semibold rounded-lg transition disabled:opacity-60">
          <LoadingSpinner v-if="isLoading" class="absolute inset-0 flex justify-center items-center" />
        </SubmitButton>
      </form>
      <p class="mt-6 text-center text-gray-600 text-lg">{{ $t('auth.register.emailVerifyText') }}
        <button class="text-blue-500 hover:underline" :disabled="isLoading" @click="onResentEmailVerify">{{
          $t('auth.register.resendButton') }}</button>
      </p>
      <div class="flex items-center my-6 w-full max-w-md">
        <div class="flex-grow border-t border-gray-200"></div>
        <span class="mx-4 text-gray-400 text-lg">{{ $t('auth.register.loginWith') }}</span>
        <div class="flex-grow border-t border-gray-200"></div>
      </div>
      <SocialLoginButton class="w-full max-w-md mx-auto" />
      <div class="mt-6 text-center text-gray-600 text-lg w-full max-w-md mx-auto">
        {{ $t('auth.register.alreadyHaveAccount') }}
        <Button @click="onLogin" class="text-blue-500 font-semibold hover:underline">Sign in</Button>
      </div>
    </div>

    <!-- Right side - Image -->
    <div class="hidden md:block md:w-1/2 bg-neutral-800 text-white p-10 flex flex-col justify-center items-center">
      <BoxText :text="$t('auth.login.title')" :disabled="isLoading" @click="onLogin" />
      <ImagePlaceholder :src="imageSrc" alt="Description of image"
        class="flex justify-center h-80 w-auto object-contain" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, reactive, computed } from 'vue'
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
const errors = reactive<{ [key: string]: string }>({})
const isLoading = ref(false)

const { showToast } = useToast()
const { t } = useI18n()

const genderOptionsTranslated = computed(() =>
  GENDER_OPTIONS.map(opt => ({
    ...opt,
    label: t(opt.label)
  }))
)

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
        newErrors[e.path[0]] = t(e.message);
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

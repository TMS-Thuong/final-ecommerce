<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <div class="flex flex-col md:flex-row gap-6">
      <aside class="w-full md:w-1/4 text-xl">
        <div class="shadow-xl border-0 bg-white rounded-lg overflow-hidden">
          <div
            class="text-center pb-6 bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-t-lg px-6 pt-8">
            <div class="relative flex flex-col items-center">
              <div
                class="w-24 h-24 mx-auto rounded-full border-2 border-white/40 shadow-2xl overflow-hidden flex items-center justify-center bg-gray-100">
                <img v-if="avatarPreview || (userStore.profile?.avatarUrl && !avatarError)"
                  :src="avatarPreview || userStore.profile?.avatarUrl" alt="avatar" class="object-cover w-full h-full"
                  @error="avatarError = true" />
                <DefaultAvatarIcon v-else class="w-full h-full text-neutral-400 object-contain" />
              </div>
            </div>
            <div class="mt-4">
              <h2 class="text-2xl font-bold">{{ userStore.profile?.firstName }} {{
                userStore.profile?.lastName }}</h2>
            </div>
          </div>
          <div class="p-0 text-xl">
            <nav class="space-y-1 mt-2">
              <button
                :class="tabClass('profile') + ' w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-300'"
                @click="activeTab = 'profile'">
                <UserCircleIcon size="6" />
                <span class="font-medium">Account info</span>
              </button>
              <button
                :class="tabClass('orders') + ' w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-300'"
                @click="goToOrders">
                <UserBagIcon size="6" />
                <span class="font-medium">My Orders</span>
              </button>
              <button
                :class="tabClass('password') + ' w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-300'"
                @click="activeTab = 'password'">
                <UserLockIcon size="6" />
                <span class="font-medium">Change Password</span>
              </button>
              <button
                :class="tabClass('purchased-products') + ' w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-300'"
                @click="goToPurchasedProducts">
                <UserBagIcon size="6" />
                <span class="font-medium">Purchased Products</span>
              </button>
            </nav>
            <div class="px-4 pb-6 mt-6">
              <button
                class="w-full flex items-center justify-center gap-2 border border-neutral-300 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-300 rounded py-2"
                @click="logout">
                <LogoutIcon size="6" />
                <i class="fa-solid fa-arrow-right-from-bracket w-4 h-4"></i>
                <span>{{ $t('account.logout') }}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <section class="flex-1 text-xl">
        <div v-if="activeTab === 'profile'">
          <div class="shadow-xl border-0 bg-white rounded-lg overflow-hidden">
            <div
              class="bg-gradient-to-r from-neutral-800 to-black text-white rounded-t-lg px-8 py-6 flex flex-row items-center justify-between">
              <div>
                <h2 class="text-3xl font-bold">{{ $t('account.profile') }}</h2>
                <p class="text-neutral-300 mt-1 text-xl">Manage your personal information</p>
              </div>
              <EditIcon v-if="!isEditing" @click="isEditing = true" size="8" />
            </div>
            <div class="p-8 bg-white">
              <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-6">
                  <div>
                    <label class="font-normal text-gray-600 mb-3 block uppercase tracking-wide">{{
                      $t('account.firstName') }}</label>
                    <div class="p-4 bg-white border-l-4 border-neutral-600 rounded-lg shadow-sm">
                      <span class="text-neutral-900 text-xl">{{
                        userStore.profile?.firstName || '-' }}</span>
                    </div>
                  </div>
                  <div>
                    <label class=" font-normal text-gray-600 mb-3 block uppercase tracking-wide">{{
                      $t('account.lastName') }}</label>
                    <div class="p-4 bg-white border-l-4 border-neutral-700 rounded-lg shadow-sm">
                      <span class="text-neutral-900 text-xl">{{
                        userStore.profile?.lastName || '-' }}</span>
                    </div>
                  </div>
                  <div>
                    <label class=" font-normal text-gray-600 mb-3 block uppercase tracking-wide">{{
                      $t('account.gender') }}</label>
                    <div class="p-4 bg-white border-l-4 border-neutral-600 rounded-lg shadow-sm">
                      <span class="text-neutral-900 text-xl">{{
                        genderText(userStore.profile?.gender) }}</span>
                    </div>
                  </div>
                </div>
                <div class="space-y-6">
                  <div>
                    <label class=" font-normal text-gray-600 mb-3 block uppercase tracking-wide">{{
                      $t('account.email') }}</label>
                    <div class="p-4 bg-white border-l-4 border-neutral-600 rounded-lg shadow-sm">
                      <div class="flex items-center gap-3">
                        <MailIcon size="6" />
                        <span class="text-neutral-900 text-xl">{{ userStore.profile?.email
                          || '-' }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="userStore.profile?.phoneNumber">
                    <label class=" font-normal text-gray-600 mb-3 block uppercase tracking-wide">Phone
                      Number</label>
                    <div class="p-4 bg-white border-l-4 border-neutral-600 rounded-lg shadow-sm">
                      <div class="flex items-center gap-3">
                        <TelephoneIcon size="6" />
                        <span class="text-neutral-900 text-xl">{{
                          userStore.profile.phoneNumber }}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class=" font-normal text-gray-600 mb-3 block uppercase tracking-wide">{{
                      $t('account.birthDate') }}</label>
                    <div class="p-4 bg-white border-l-4 border-neutral-600 rounded-lg shadow-sm">
                      <div class="flex items-center gap-3">
                        <CalendarDotsIcon size="6" />
                        <span class="text-neutral-900 text-xl">{{
                          formatDate(userStore.profile?.birthDate, 'date') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <ProfileInfoForm ref="profileInfoFormRef" :profile="userStore.profile || undefined"
                  :isEditing="isEditing" :form="form" @submit="onSubmit" @cancel-edit="cancelEdit"
                  @update-avatar="onUpdateAvatar" />
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'password'">
          <div class="shadow-xl border-0 bg-white rounded-lg overflow-hidden">
            <div class="bg-gradient-to-r from-neutral-800 to-neutral-800 text-white rounded-t-lg px-8 py-6">
              <h2 class="text-2xl font-bold mb-1">{{ $t('account.changePassword') }}</h2>
              <p class="text-neutral-300 mt-1">Update your security settings</p>
            </div>
            <div class="p-12 bg-neutral-50">
              <ChangePasswordForm :passwordForm="passwordForm" :errors="errors" @submit="onChangePassword" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user.store';
import { useRouter } from 'vue-router';
import { useToast } from '@/hooks/useToast';
import ProfileInfoForm from '@/components/molecules/account/ProfileInfoForm.vue';
import ChangePasswordForm from '@/components/molecules/account/ChangePasswordForm.vue';
import DefaultAvatarIcon from '@/components/icons/DefaultAvatarIcon.vue';
import UserCircleIcon from '@/components/icons/UserCircleIcon.vue';
import UserBagIcon from '@/components/icons/UserBagIcon.vue';
import UserLockIcon from '@/components/icons/UserLockIcon.vue';
import LogoutIcon from '@/components/icons/LogoutIcon.vue';
import MailIcon from '@/components/icons/MailIcon.vue';
import TelephoneIcon from '@/components/icons/TelephoneIcon.vue';
import CalendarDotsIcon from '@/components/icons/CalendarDotsIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import { ToastEnum } from '@/enums/toast';
import { updateProfile, updateAvatar } from '@/api/user';
import { z } from 'zod';
import { resetPasswordSchema } from '@/validations/form';
import { useI18n } from 'vue-i18n';

const userStore = useUserStore();
const { fetchProfile, updateUserPassword, updateUserAvatar } = userStore;
const { showToast } = useToast();
const router = useRouter();
const { t } = useI18n();

const activeTab = ref('profile');
const isEditing = ref(false);
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  avatarUrl: '',
});
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const avatarError = ref(false);
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const profileInfoFormRef = ref<{ resetAvatarPreview?: () => void }>();
const errors = ref<{ [key: string]: string }>({});

watch(
  () => userStore.profile,
  (val) => {
    if (val) {
      form.firstName = val.firstName || '';
      form.lastName = val.lastName || '';
      form.email = val.email || '';
      form.phone = val.phoneNumber || '';
      form.birthDate = val.birthDate ? val.birthDate.slice(0, 10) : '';
      const genderValue = val.gender?.toString() || '';
      if (genderValue === '1') form.gender = 'male';
      else if (genderValue === '2') form.gender = 'female';
      else if (genderValue === '0') form.gender = 'other';
      else form.gender = '';
      form.avatarUrl = val.avatarUrl || '';
    }
  },
  { immediate: true }
);

watch(
  () => userStore.profile?.avatarUrl,
  () => { avatarError.value = false; }
);

onMounted(() => {
  fetchProfile();
});

const tabClass = (tab: string) =>
  `px-4 py-2 rounded cursor-pointer transition ${activeTab.value === tab ? 'bg-neutral-200 font-normal text-black' : 'hover:bg-gray-50 text-gray-600'}`;

const goToOrders = () => {
  router.push({ name: 'MyOrders' });
};
const goToPurchasedProducts = () => {
  router.push({ name: 'MyPurchasedProducts' });
};
const logout = () => {
  localStorage.removeItem('accessToken');
  router.push({ name: 'Login' });
};
const cancelEdit = () => {
  isEditing.value = false;
  if (userStore.profile) {
    form.firstName = userStore.profile.firstName || '';
    form.lastName = userStore.profile.lastName || '';
    form.phone = userStore.profile.phoneNumber || '';
    form.birthDate = userStore.profile.birthDate ? userStore.profile.birthDate.slice(0, 10) : '';
    form.gender = userStore.profile.gender?.toString() || '';
    form.avatarUrl = userStore.profile.avatarUrl || '';
  }
};
const onSubmit = async () => {
  let gender = form.gender;
  if (!['male', 'female', 'other'].includes(gender)) {
    showToast(ToastEnum.Error, t('account.invalidGender'));
    return;
  }
  if (avatarFile.value) {
    const formData = new FormData();
    formData.append('file', avatarFile.value);
    await updateAvatar(formData);
    avatarFile.value = null;
  } else {
    await updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      birthDate: form.birthDate,
      gender: gender,
      phoneNumber: form.phone,
    });
  }
  await fetchProfile();
  isEditing.value = false;
  showToast(ToastEnum.Success, t('account.updateProfileSuccess'));
};
const onChangePassword = async (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
  errors.value = {};

  const parsed = resetPasswordSchema.safeParse({
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  });

  if (!payload.currentPassword) {
    errors.value.currentPassword = 'Current password is required';
  }

  if (!parsed.success) {
    parsed.error.errors.forEach(err => {
      const field = err.path[0]?.toString();
      if (field) errors.value[field] = err.message;
    });
  }

  if (Object.keys(errors.value).length > 0) return;

  try {
    await updateUserPassword({
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    });
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    errors.value = {};
    showToast(ToastEnum.Success, t('account.changePasswordSuccess'));
  } catch (error: any) {
    if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      error.response.data.errors.forEach((err: any) => {
        if (err.path && err.message) {
          errors.value[err.path[0]] = err.message;
        }
      });
      error.response.data.errors.forEach((err: any) => {
        if (err.message) {
          showToast(ToastEnum.Error, err.message);
        }
      });
    } else if (error?.response?.data?.message) {
      showToast(ToastEnum.Error, error.response.data.message);
    } else if (error?.message) {
      showToast(ToastEnum.Error, error.message);
    } else {
      showToast(ToastEnum.Error, t('account.changePasswordFailed'));
    }
  }
};
const onAvatarChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    avatarFile.value = files[0];
    avatarPreview.value = URL.createObjectURL(files[0]);
  } else {
    avatarFile.value = null;
    avatarPreview.value = null;
  }
};
const onUpdateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  await updateAvatar(formData);
  await fetchProfile();
  showToast(ToastEnum.Success, t('account.updateAvatarSuccess'));
  if (profileInfoFormRef.value?.resetAvatarPreview) {
    profileInfoFormRef.value.resetAvatarPreview();
  }
};

function formatDate(dateStr: string | undefined, mode: 'date' | 'datetime' = 'datetime') {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  if (mode === 'date') return d.toLocaleDateString();
  return d.toLocaleString();
}

function genderText(gender: number | string | undefined) {
  const genderValue = gender?.toString();
  if (genderValue === '0') return 'Other';
  if (genderValue === '1') return 'Male';
  if (genderValue === '2') return 'Female';
  return '-';
}
</script>

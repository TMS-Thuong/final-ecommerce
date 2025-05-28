import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProfile, updatePassword, updateAvatar } from '@/api/user';
import type { UserProfile } from '@/types/user';
import { AxiosError } from 'axios';

interface UpdatePasswordBody {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const useUserStore = defineStore('user', () => {
    const profile = ref<UserProfile | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchProfile = async () => {
        loading.value = true;
        error.value = null;
        try {
            const res = await getProfile();
            profile.value = res.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                error.value = err.response?.data?.message || 'Failed to fetch profile';
            } else {
                error.value = 'Failed to fetch profile';
            }
        } finally {
            loading.value = false;
        }
    };

    const updateUserPassword = async (data: UpdatePasswordBody) => {
        loading.value = true;
        error.value = null;
        try {
            await updatePassword(data);
        } catch (err) {
            if (err instanceof AxiosError) {
                error.value = err.response?.data?.message || 'Failed to update password';
            } else {
                error.value = 'Failed to update password';
            }
        } finally {
            loading.value = false;
        }
    };

    const updateUserAvatar = async (formData: FormData) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await updateAvatar(formData);
            profile.value = res.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                error.value = err.response?.data?.message || 'Failed to update avatar';
            } else {
                error.value = 'Failed to update avatar';
            }
        } finally {
            loading.value = false;
        }
    };

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateUserPassword,
        updateUserAvatar,
    };
}); 
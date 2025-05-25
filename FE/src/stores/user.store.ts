import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProfile, updatePassword, updateAvatar } from '@/api/user';

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    gender?: number | string;
    phoneNumber?: string;
    birthDate?: string;
    address?: string;
}

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
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch profile';
        } finally {
            loading.value = false;
        }
    };

    const updateUserPassword = async (data: UpdatePasswordBody) => {
        loading.value = true;
        error.value = null;
        try {
            await updatePassword(data);
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update password';
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
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update avatar';
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
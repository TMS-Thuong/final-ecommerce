import instanceAxios from '@/helpers/configAxios';
import type { UserProfile } from '@/types/user';

export const getProfile = async () => {
    return instanceAxios.get('/api/users/me');
};

interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const updateProfile = async (data: Partial<UserProfile>) => {
    return instanceAxios.put('/api/users/me', data);
};

export const updatePassword = async (data: UpdatePasswordData) => {
    return instanceAxios.put('/api/users/me/change-password', data);
};

export const updateAvatar = async (formData: FormData) => {
    return instanceAxios.put('/api/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}; 
import instanceAxios from '@/helpers/configAxios';

export const getProfile = async () => {
    return instanceAxios.get('/users/me');
};

export const updateProfile = async (data: any) => {
    return instanceAxios.put('/users/me', data);
};

export const updatePassword = async (data: any) => {
    return instanceAxios.put('/users/me/password', data);
};

export const updateAvatar = async (formData: FormData) => {
    return instanceAxios.put('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}; 
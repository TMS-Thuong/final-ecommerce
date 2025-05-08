import instanceAxios from '@/helpers/configAxios'
import { DEFAULT_FORM_DATA } from '@/constants/auth/_utils/form'

const USE_URL = '/user/api/auth'
export const authApi = {
  register: (data = DEFAULT_FORM_DATA) => instanceAxios.post(`${USE_URL}/register`, data),
  login: (data: { email: string; password: string }) =>
    instanceAxios.post(`${USE_URL}/login`, data),
  resendVerificationEmail: (email: string) =>
    instanceAxios.get(`${USE_URL}/resend-verify-email`, { params: { email } }),
  loginViaGoogle: (idToken: string) =>
    instanceAxios.post(`${USE_URL}/google-signin`, { idToken }),

  forgotPassword: (email: string) =>
    instanceAxios.post(`${USE_URL}/forgot-password`, { email }),
  resetPassword: (data: { token: string; newPassword: string; confirmPassword: string }) =>
    instanceAxios.post(`${USE_URL}/reset-password`, data),
  refreshAccessToken: async (refreshToken: string) => {
    try {
      const response = await instanceAxios.post(`${USE_URL}/refresh-token`, { refreshToken });
      return response.data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh token');
    }
  }
};

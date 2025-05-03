const USE_URL = 'api/user/auth'
const AUTH_URL = 'api/auth'
export const ApiEndpoint = {
  auth: {
    register: `${USE_URL}/register`,
    googleSignIn: `${USE_URL}/google-signin`,
    loginByEmail: `${USE_URL}/login`,
    forgotPW: `${AUTH_URL}/forgot-password`,
    resetPW: `${AUTH_URL}/reset-password`,
    refreshToken: `${AUTH_URL}/refresh-token`,
  },
}

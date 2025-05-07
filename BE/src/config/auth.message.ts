export const AuthErrorMessages = {
  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_INVALID: 'Invalid email address.',
  EMAIL_NOT_VERIFIED: 'Email has not been verified.',
  EMAIL_USED: 'Email is already in use.',
  EMAIL_NOT_FOUND: 'Email not found.',
  VERIFICATION_EMAIL_FAILED: 'Could not send verification email.',
  VERIFICATION_EMAIL_ALREADY_SENT: 'Token is still valid.',
  ALREADY_VERIFIED: 'Email is already verified.',

  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long.',
  PASSWORD_MAX_LENGTH: 'Password must not exceed 16 characters.',
  PASSWORD_PATTERN:
    'Password must include at least one uppercase letter, one lowercase letter, and one special character.',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
  PASSWORD_INCORRECT: 'Incorrect password.',

  FIRST_NAME_REQUIRED: 'First name is required.',
  LAST_NAME_REQUIRED: 'Last name is required.',
  BIRTH_DATE_REQUIRED: 'Birth date is required.',
  BIRTH_DATE_INVALID: 'Invalid birth date format.',
  GENDER_INVALID: 'Invalid gender value.',
  USER_INFO_INCOMPLETE: 'User information is incomplete.',
  USER_NOT_FOUND: 'User not found.',
  USER_NOT_ACTIVE: 'Account is not active.',
  GOOGLE_ACCOUNT_CANNOT_RESET: 'This account was logged in via Google. You cannot use the password reset feature.',

  TOKEN_REQUIRED: 'Token is required.',
  TOKEN_NOT_SAVED: 'Token is not saved.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required.',
  TOKEN_INVALID: 'Invalid or expired token.',
  REFRESH_TOKEN_INVALID: 'Invalid refresh token.',
  TOKEN_NOT_FOUND: 'Token not found.',
  TOKEN_EXPIRED: 'Token has expired.',
  TOKENID_INVALID: 'Invalid token ID.',

  INVALID_CREDENTIALS: 'Incorrect email or password.',
  UNAUTHORIZED: 'Unauthorized access.',
  NOT_VERIFIED: 'Google email has not been verified.',

  SERVER_ERROR: 'Server error.',
  FAILED_TO_SEND_EMAIL: 'Failed to send email.',
  INVALID_RESET_DATA: 'Invalid reset data.',
  INVALID_DATA: 'Invalid request data.',
  UNEXPECTED_ERROR: 'An unexpected error occurred.',
  REQUIRED_JWT_SECRET: 'JWT_SECRET is required',
  PAYLOAD_INVALID: 'Invalid payload',
};

export const AuthMessages = {
  REGISTRATION_SUCCESS: 'Registration successful. Please check your email to verify your account.',
  REGISTER_GOOGLE_SUCCESS: 'Sign up for an account with Google successfully.',
  VERIFICATION_EMAIL_SENT: 'Verification email has been sent.',
  LOGIN_SUCCESS: 'Login successful.',
  PASSWORD_UPDATED: 'Password has been updated.',
  RESET_EMAIL_SENT: 'Password reset email has been sent.',
  USER_ACTIVED: 'User account has been activated.',
};

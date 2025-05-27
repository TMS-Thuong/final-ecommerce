export const USER_MESSAGES = {
  FIRST_NAME_REQUIRED: 'First name is required',
  LAST_NAME_REQUIRED: 'Last name is required',
  BIRTH_DATE_REQUIRED: 'Birth date is required',
  BIRTH_DATE_INVALID: 'Invalid birth date format',
  PHONE_NUMBER_INVALID: 'Phone number must be 10 digits',
  CURRENT_PASSWORD_REQUIRED: 'Current password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_MAX_LENGTH: 'Password must not exceed 16 characters',
  PASSWORD_PATTERN:
    'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',

  USER_NOT_FOUND: 'User not found',
  UPDATE_PROFILE_ERROR: 'Failed to update user profile',
  USER_NO_PASSWORD: 'User has no password set',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
  UPDATE_PASSWORD_ERROR: 'Failed to update password',
  UPDATE_AVATAR_ERROR: 'Failed to update avatar',

  PASSWORD_UPDATED: 'Password updated successfully',
} as const;

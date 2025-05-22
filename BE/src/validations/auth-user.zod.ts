import { z } from 'zod';

import { Gender } from '@app/types/auth.type';

import { AuthErrorMessages } from '../constants/auth.message';
const minString = (minLength: number, errorMessage: string): z.ZodString => z.string().min(minLength, errorMessage);

export const registerUserZobSchema = z.object({
  email: minString(1, AuthErrorMessages.EMAIL_REQUIRED).email(AuthErrorMessages.EMAIL_INVALID),
  password: z
    .string()
    .min(8, AuthErrorMessages.PASSWORD_MIN_LENGTH)
    .max(16, AuthErrorMessages.PASSWORD_MAX_LENGTH)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,16}$/, AuthErrorMessages.PASSWORD_PATTERN),
  firstName: minString(1, AuthErrorMessages.FIRST_NAME_REQUIRED),
  lastName: minString(1, AuthErrorMessages.LAST_NAME_REQUIRED),
  birthDate: z.coerce.date({
    required_error: AuthErrorMessages.BIRTH_DATE_REQUIRED,
    invalid_type_error: AuthErrorMessages.BIRTH_DATE_INVALID,
  }),
  gender: z
    .string()
    .toLowerCase()
    .refine((val) => ['male', 'female', 'other'].includes(val), {
      message: AuthErrorMessages.GENDER_INVALID,
    })
    .transform((val) => {
      if (val === 'male') return Gender.MALE;
      if (val === 'female') return Gender.FEMALE;
      return Gender.OTHER;
    }),
});

export const loginZodSchema = z.object({
  email: minString(1, AuthErrorMessages.EMAIL_REQUIRED).email(AuthErrorMessages.EMAIL_INVALID),
  password: minString(1, AuthErrorMessages.PASSWORD_REQUIRED),
});

export const verifyEmailZobSchema = z.object({
  token: minString(1, AuthErrorMessages.TOKEN_REQUIRED),
});

export const resendVerifyEmailZobSchema = z.object({
  email: minString(1, AuthErrorMessages.EMAIL_REQUIRED).email(AuthErrorMessages.EMAIL_INVALID),
});

export const loginViaGoogleZobSchema = z.object({
  idToken: minString(1, AuthErrorMessages.TOKEN_REQUIRED),
});

export const refreshTokenZodSchema = z.object({
  refreshToken: minString(1, AuthErrorMessages.REFRESH_TOKEN_REQUIRED),
});

export const forgotPasswordZodSchema = z.object({
  email: minString(1, AuthErrorMessages.EMAIL_REQUIRED).email(AuthErrorMessages.EMAIL_INVALID),
});

export const resetPasswordZodSchema = z
  .object({
    token: minString(1, AuthErrorMessages.TOKEN_REQUIRED),
    newPassword: z
      .string()
      .min(8, AuthErrorMessages.PASSWORD_MIN_LENGTH)
      .max(16, AuthErrorMessages.PASSWORD_MAX_LENGTH)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,16}$/, AuthErrorMessages.PASSWORD_PATTERN),
    confirmPassword: z
      .string()
      .min(8, AuthErrorMessages.PASSWORD_MIN_LENGTH)
      .max(16, AuthErrorMessages.PASSWORD_MAX_LENGTH)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,16}$/, AuthErrorMessages.PASSWORD_PATTERN),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: AuthErrorMessages.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

export type RegisterUserInput = z.infer<typeof registerUserZobSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailZobSchema>;
export type LoginInput = z.infer<typeof loginZodSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenZodSchema>;
export type LoginViaGoogleInput = z.infer<typeof loginViaGoogleZobSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordZodSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordZodSchema>;

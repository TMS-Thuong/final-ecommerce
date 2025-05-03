import { Gender } from '@prisma/client';
import { z } from 'zod';

import { AuthErrorMessages } from './auth.error';

export const googleLoginSchema = z.object({
  idToken: z.string().min(1, 'ID Token is required'),
});

export const registerUserZobSchema = z.object({
  email: z.string().min(1, AuthErrorMessages.EMAIL_REQUIRED).email(AuthErrorMessages.EMAIL_INVALID),
  password: z
    .string()
    .min(8, AuthErrorMessages.PASSWORD_MIN_LENGTH)
    .max(16, AuthErrorMessages.PASSWORD_MAX_LENGTH)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,16}$/, AuthErrorMessages.PASSWORD_PATTERN),
  firstName: z.string().min(1, AuthErrorMessages.FIRST_NAME_REQUIRED),
  lastName: z.string().min(1, AuthErrorMessages.LAST_NAME_REQUIRED),
  birthDate: z.coerce.date({
    required_error: AuthErrorMessages.BIRTH_DATE_REQUIRED,
    invalid_type_error: AuthErrorMessages.BIRTH_DATE_INVALID,
  }),
  gender: z
    .number()
    .int()
    .min(0, AuthErrorMessages.GENDER_INVALID)
    .max(2, AuthErrorMessages.GENDER_INVALID)
    .transform((val) => {
      if (val === 0) return Gender.MALE;
      if (val === 1) return Gender.FEMALE;
      return Gender.OTHER;
    }),
});

export const verifyEmailZobSchema = z.object({
  token: z.string().min(1, AuthErrorMessages.TOKEN_REQUIRED),
});

export const loginZodSchema = z.object({
  email: z.string().min(1, AuthErrorMessages.EMAIL_REQUIRED).email(AuthErrorMessages.EMAIL_INVALID),
  password: z.string().min(1, AuthErrorMessages.PASSWORD_REQUIRED),
});

export const refreshTokenZodSchema = z.object({
  refreshToken: z.string().min(1, AuthErrorMessages.REFRESH_TOKEN_REQUIRED),
});

export const forgotPasswordZodSchema = z.object({
  email: z.string().min(1, AuthErrorMessages.EMAIL_REQUIRED).email(AuthErrorMessages.EMAIL_INVALID),
});

export const resetPasswordZodSchema = z
  .object({
    token: z.string().min(1, AuthErrorMessages.TOKEN_REQUIRED),
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
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordZodSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordZodSchema>;

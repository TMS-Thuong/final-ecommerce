import { z } from 'zod';

import { USER_MESSAGES } from '@app/constants/message.constant';
import { minString } from '@utils/zod.util';

export const updateUserZodSchema = z.object({
  firstName: minString(1, USER_MESSAGES.FIRST_NAME_REQUIRED).optional(),
  lastName: minString(1, USER_MESSAGES.LAST_NAME_REQUIRED).optional(),
  birthDate: z.coerce
    .date({
      required_error: USER_MESSAGES.BIRTH_DATE_REQUIRED,
      invalid_type_error: USER_MESSAGES.BIRTH_DATE_INVALID,
    })
    .optional(),
  gender: z
    .enum(['male', 'female', 'other'])
    .transform((val) => ({ male: 1, female: 2, other: 0 }[val]))
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, USER_MESSAGES.PHONE_NUMBER_INVALID)
    .optional(),
});

export const updatePasswordZodSchema = z
  .object({
    currentPassword: z.string().min(1, USER_MESSAGES.CURRENT_PASSWORD_REQUIRED),
    newPassword: z
      .string()
      .min(8, USER_MESSAGES.PASSWORD_MIN_LENGTH)
      .max(16, USER_MESSAGES.PASSWORD_MAX_LENGTH)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,16}$/, USER_MESSAGES.PASSWORD_PATTERN),
    confirmPassword: z
      .string()
      .min(8, USER_MESSAGES.PASSWORD_MIN_LENGTH)
      .max(16, USER_MESSAGES.PASSWORD_MAX_LENGTH)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,16}$/, USER_MESSAGES.PASSWORD_PATTERN),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: USER_MESSAGES.PASSWORDS_NOT_MATCH,
    path: ['confirmPassword'],
  });

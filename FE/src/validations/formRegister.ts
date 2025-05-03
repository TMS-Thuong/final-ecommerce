import { z } from 'zod';
import { ERROR_MESSAGES } from '@/constants/formRegister';

export const formSchema = z.object({
  lastName: z.string()
    .min(1, { message: ERROR_MESSAGES.required })
    .max(50, { message: 'Họ không được quá 50 ký tự' }),

  firstName: z.string()
    .min(1, { message: ERROR_MESSAGES.required })
    .max(50, { message: 'Tên không được quá 50 ký tự' }),

  email: z.string()
    .email({ message: ERROR_MESSAGES.invalidEmail })
    .nonempty({ message: ERROR_MESSAGES.required }),

  password: z.string()
    .min(6, { message: ERROR_MESSAGES.passwordTooShort })
    .nonempty({ message: ERROR_MESSAGES.required })
    .regex(/[a-z]/, { message: ERROR_MESSAGES.passwordNoLowercase })
    .regex(/[A-Z]/, { message: ERROR_MESSAGES.passwordNoUppercase })
    .regex(/[\W_]/, { message: ERROR_MESSAGES.passwordNoSpecialChar }),

  birthDate: z.string()
    .nonempty({ message: ERROR_MESSAGES.required })
    .refine(value => !isNaN(Date.parse(value)), { message: ERROR_MESSAGES.invalidDate })
    .refine(value => new Date(value) <= new Date(), { message: ERROR_MESSAGES.dateInFuture })
});

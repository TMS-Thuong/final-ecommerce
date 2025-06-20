import { z } from 'zod'
import { ERROR_MESSAGES } from '@/constants/auth/_utils/message'

export const registerSchema = z.object({
  lastName: z
    .string()
    .min(1, { message: ERROR_MESSAGES.firstNameTooShort })
    .max(50, { message: ERROR_MESSAGES.lastNameTooLong }),

  firstName: z
    .string()
    .min(1, { message: ERROR_MESSAGES.firstNameTooShort })
    .max(50, { message: ERROR_MESSAGES.firstNameTooLong }),

  email: z
    .string()
    .email({ message: ERROR_MESSAGES.invalidEmail })
    .nonempty({ message: ERROR_MESSAGES.required }),

  password: z
    .string()
    .regex(/[a-z]/, { message: ERROR_MESSAGES.passwordNoLowercase })
    .regex(/[A-Z]/, { message: ERROR_MESSAGES.passwordNoUppercase })
    .regex(/[\W_]/, { message: ERROR_MESSAGES.passwordNoSpecialChar })
    .min(8, { message: ERROR_MESSAGES.passwordTooShort })
    .max(16, { message: ERROR_MESSAGES.passwordTooLong })
    .nonempty({ message: ERROR_MESSAGES.required }),

  birthDate: z
    .string()
    .superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: ERROR_MESSAGES.required })
        return
      }
      const parsedDate = Date.parse(value)
      if (isNaN(parsedDate)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: ERROR_MESSAGES.invalidDate })
      } else if (new Date(value) > new Date()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: ERROR_MESSAGES.dateInFuture })
      }
    })

})

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: ERROR_MESSAGES.invalidEmail })
    .nonempty({ message: ERROR_MESSAGES.required }),
  password: z
    .string()
    .nonempty({ message: ERROR_MESSAGES.required }),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty({ message: ERROR_MESSAGES.required })
    .email({ message: ERROR_MESSAGES.invalidEmail }),
})

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .regex(/[a-z]/, { message: ERROR_MESSAGES.passwordNoLowercase })
    .regex(/[A-Z]/, { message: ERROR_MESSAGES.passwordNoUppercase })
    .regex(/[\W_]/, { message: ERROR_MESSAGES.passwordNoSpecialChar })
    .min(8, { message: ERROR_MESSAGES.passwordTooShort })
    .max(16, { message: ERROR_MESSAGES.passwordTooLong })
    .nonempty({ message: ERROR_MESSAGES.required }),

  confirmPassword: z
    .string()
    .nonempty({ message: ERROR_MESSAGES.required }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: ERROR_MESSAGES.passwordNotMath,
})

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: ERROR_MESSAGES.firstNameTooShort })
    .max(50, { message: ERROR_MESSAGES.firstNameTooLong }),

  lastName: z
    .string()
    .min(1, { message: ERROR_MESSAGES.lastNameTooShort })
    .max(50, { message: ERROR_MESSAGES.lastNameTooLong }),

  phone: z
    .string()
    .min(1, { message: ERROR_MESSAGES.required })
    .regex(/^[0-9]+$/, { message: ERROR_MESSAGES.invalidPhoneNumber }),

  birthDate: z
    .string()
    .superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: ERROR_MESSAGES.required })
        return
      }
      const parsedDate = Date.parse(value)
      if (isNaN(parsedDate)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: ERROR_MESSAGES.invalidDate })
      } else if (new Date(value) > new Date()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: ERROR_MESSAGES.dateInFuture })
      }
    }),

  gender: z
    .string()
    .min(1, { message: ERROR_MESSAGES.required })
});

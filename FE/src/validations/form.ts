import { z } from 'zod'
import { ERROR_MESSAGES } from '@/constants/form'

export const registerSchema = z.object({
  lastName: z
    .string()
    .min(1, { message: ERROR_MESSAGES.firtNameTooShort })
    .max(50, { message: ERROR_MESSAGES.lastNameTooLong }),

  firstName: z
    .string()
    .min(1, { message: ERROR_MESSAGES.firtNameTooShort })
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

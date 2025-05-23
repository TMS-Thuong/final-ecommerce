import { z } from 'zod';

import { minString } from '@utils/zod.util';

export const updateUserZodSchema = z.object({
  firstName: minString(1, 'First name is required'),
  lastName: minString(1, 'Last name is required'),
  birthDate: z.coerce.date({
    required_error: 'Birth date is required',
    invalid_type_error: 'Invalid birth date format',
  }),
  gender: z.enum(['male', 'female', 'other']).transform((val) => ({ male: 1, female: 2, other: 0 }[val])),
});

export const updatePasswordZodSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,16}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one special character'
    ),
});

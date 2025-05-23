import { z } from 'zod';

export const minString = (min: number, message: string): z.ZodString => {
  return z.string().min(min, message);
};

export const maxString = (max: number, message: string): z.ZodString => {
  return z.string().max(max, message);
};

export const minMaxString = (min: number, max: number, message: string): z.ZodString => {
  return z.string().min(min, message).max(max, message);
};

export const optionalString = (): z.ZodOptional<z.ZodString> => {
  return z.string().optional();
};

export const requiredString = (message: string): z.ZodString => {
  return z.string({ required_error: message });
};

export const emailString = (message: string): z.ZodString => {
  return z.string().email(message);
};

export const passwordString = (message: string): z.ZodString => {
  return z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,16}$/, message);
};

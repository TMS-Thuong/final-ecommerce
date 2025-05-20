import { z } from 'zod';

export const AddressZodSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().optional(),
  ward: z.string().optional(),
  streetAddress: z.string().min(1, 'Street address is required'),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
});

export const AddressIdZodSchema = z.object({
  id: z.number().int().positive('Invalid address ID'),
});

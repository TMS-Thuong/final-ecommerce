import { z } from 'zod';

import { AddressMessages } from '@app/constants/address.messages';

export const AddressZodSchema = z.object({
  recipientName: z.string().min(1, AddressMessages.recipientName),
  phoneNumber: z.string().min(10, AddressMessages.phoneNumber),
  province: z.string().min(1, AddressMessages.province),
  district: z.string().optional(),
  ward: z.string().optional(),
  streetAddress: z.string().min(1, AddressMessages.streetAddress),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
});

export const AddressIdZodSchema = z.object({
  id: z.number().int().positive(AddressMessages.addressId),
});

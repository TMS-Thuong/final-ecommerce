import { z } from 'zod';

import { OrderMessages } from '@app/constants/oder.message';

export const CreateOrderZodSchema = z.object({
  addressId: z.number().int().positive(OrderMessages.addressId),
  shippingMethodId: z.number().int().positive(OrderMessages.shippingMethodId),
  paymentMethodId: z.number().int().positive(OrderMessages.paymentMethodId),
  customerNotes: z.string().optional(),
  couponCode: z.string().optional(),
  cartItemIds: z.array(z.number().int().positive()).optional(),
});

export const OrderIdZodSchema = z.object({
  id: z.number().int().positive(OrderMessages.orderId),
});

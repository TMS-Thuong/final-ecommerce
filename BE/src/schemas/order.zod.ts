import { z } from 'zod';

export const CreateOrderZodSchema = z.object({
  addressId: z.number().int().positive('Address ID is required'),
  shippingMethodId: z.number().int().positive('Shipping method is required'),
  paymentMethodId: z.number().int().positive('Payment method is required'),
  customerNotes: z.string().optional(),
  couponCode: z.string().optional(),
});

export const OrderIdZodSchema = z.object({
  id: z.number().int().positive('Invalid order ID'),
});

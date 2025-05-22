import { z } from 'zod';

export const CartIdZodSchema = z.object({
  id: z.string().uuid(),
});

export const CartItemIdZodSchema = z.object({
  id: z.number().int().positive(),
});

export const AddCartItemZodSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const UpdateCartItemZodSchema = z.object({
  quantity: z.number().int().positive(),
});

import { z } from 'zod';

export const ProductIdZodSchema = z.object({
  productId: z.number().int().positive(),
});

export const FavoriteItemIdZodSchema = z.object({
  id: z.number().int().positive(),
});

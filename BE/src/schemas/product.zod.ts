import { z } from 'zod';

import { ProductErrorMessages } from '@app/config/product.message';

export const ProductIdZodSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, {
      message: ProductErrorMessages.INVALID_PRODUCT_ID_FORMAT,
    })
    .transform(Number)
    .refine((num) => num > 0, {
      message: ProductErrorMessages.INVALID_PRODUCT_ID,
    }),
});

export const ProductQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().optional().default(10),
  minPrice: z.coerce.number().optional().nullable(),
  maxPrice: z.coerce.number().optional().nullable(),
  brandId: z.coerce.number().optional().nullable(),
  categoryId: z.coerce.number().optional().nullable(),
  stockStatus: z.string().optional().nullable(),
  searchQuery: z.string().optional().default(''),
});

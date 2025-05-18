import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  basePrice: z.number(),
  salePrice: z.number().nullable().optional(),
  averageRating: z.number(),
  ratingCount: z.number(),
  stockQuantity: z.number().optional(),
  soldCount: z.number().optional(),
  viewCount: z.number().optional(),
  description: z.string().optional(),
  images: z.array(z.object({
    id: z.number(),
    imageUrl: z.string(),
    isThumbnail: z.boolean().optional()
  })).optional()
})

export type Product = z.infer<typeof ProductSchema> 
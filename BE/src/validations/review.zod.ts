import { z } from 'zod';

export const CreateReviewZodSchema = z
  .object({
    productId: z.number(),
    orderId: z.number(),
    rating: z.number().min(1).max(5),
    title: z.string().max(100).optional(),
    comment: z.string().min(1).max(500),
  })
  .strict();

export const UpdateReviewZodSchema = z
  .object({
    title: z.string().max(100).optional(),
    comment: z.string().min(1).max(500).optional(),
  })
  .strict();

export const ReviewIdZodSchema = z.object({
  id: z.number(),
});

export const ProductReviewsQuerySchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(50).default(10),
  rating: z.number().min(1).max(5).optional(),
  hasImages: z.boolean().optional(),
  sortBy: z.enum(['newest', 'oldest']).default('newest'),
});

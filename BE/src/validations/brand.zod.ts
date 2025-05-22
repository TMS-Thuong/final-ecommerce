import { z } from 'zod';

import { BrandErrorMessages } from '@app/constants/brand.message';

export const BrandIdZodSchema = z.object({
  id: z.coerce.number().int().positive({
    message: BrandErrorMessages.INVALID_BRAND_ID,
  }),
});

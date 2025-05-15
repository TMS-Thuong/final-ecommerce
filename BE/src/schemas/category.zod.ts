import { z } from 'zod';

import { CategoryErrorMessages } from '@app/config/category.message';

export const CategoryIdZodSchema = z.object({
  id: z.coerce.number().int().positive({
    message: CategoryErrorMessages.INVALID_CATEGORY_ID,
  }),
});

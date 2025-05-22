import { FastifyReply, FastifyRequest } from 'fastify';

import { CategoryErrorMessages } from '@app/constants/category.message';
import { CategoryService } from '@app/services/category.service';
import { CategoryIdZodSchema } from '@app/validations/category.zod';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async getCategories(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const categories = await this.categoryService.getCategories();
      return reply.ok(categories);
    } catch (error) {
      return reply.internalError(CategoryErrorMessages.FETCH_CATEGORIES_ERROR, 'FETCH_CATEGORIES_ERROR');
    }
  }

  async getCategoryById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { categoryId } = req.params as { categoryId: string };

    if (!categoryId) {
      return reply.badRequest(CategoryErrorMessages.INVALID_CATEGORY_ID, 'INVALID_CATEGORY_ID');
    }

    const validationResult = CategoryIdZodSchema.safeParse({ id: categoryId });
    if (!validationResult.success) {
      return reply.badRequest(validationResult.error.message, 'INVALID_CATEGORY_ID');
    }

    const validCategoryId = validationResult.data.id;

    try {
      const category = await this.categoryService.getCategoryById(validCategoryId);

      if (!category) {
        return reply.ok(null);
      }

      return reply.ok(category);
    } catch (error) {
      return reply.internalError(error.message || CategoryErrorMessages.FETCH_CATEGORY_ERROR, 'FETCH_CATEGORY_ERROR');
    }
  }
}

import { FastifyInstance } from 'fastify';

import { CategoryController } from '@app/controllers/category.controller';
import { getCategoriesSchema, getCategoryByIdSchema } from '@app/schemas/category.schema';

const categoryController = new CategoryController();

export async function categoryRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/categories', {
    schema: getCategoriesSchema,
    handler: categoryController.getCategories.bind(categoryController),
  });

  fastify.get('/categories/:categoryId', {
    schema: getCategoryByIdSchema,
    handler: categoryController.getCategoryById.bind(categoryController),
  });
}

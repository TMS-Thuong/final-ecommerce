import { FastifyInstance } from 'fastify';

import { ProductController } from '@app/controllers/product.controller';
import { GetProductsSchema, GetProductByIdSchema, GetProductImagesSchema } from '@app/schemas/product.schema';

const productController = new ProductController();

export async function productRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/products', {
    schema: GetProductsSchema,
    handler: productController.getProducts.bind(productController),
  });

  fastify.get('/products/:id', {
    schema: GetProductByIdSchema,
    handler: productController.getProductById.bind(productController),
  });

  fastify.get('/products/:productId/images', {
    schema: GetProductImagesSchema,
    handler: productController.getProductImages.bind(productController),
  });
}

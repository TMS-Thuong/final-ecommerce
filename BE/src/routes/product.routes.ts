import { FastifyInstance } from 'fastify';

import { ProductController } from '@app/controllers/product.controller';
import {
  getProductByIdSchema,
  getProductImagesByProductIdSchema,
  getProductsSchema,
} from '@app/schemas/product.schema';
const productController = new ProductController();

export async function productRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/products', {
    schema: getProductsSchema,
    handler: productController.getProducts.bind(productController),
  });
  fastify.get('/products/:id', {
    schema: getProductByIdSchema,
    handler: productController.getProductById.bind(productController),
  });
  fastify.get('/products/:productId/images', {
    schema: getProductImagesByProductIdSchema,
    handler: productController.getProductImagesByProductId.bind(productController),
  });
}

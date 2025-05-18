import { FastifyInstance } from 'fastify';

import { BrandController } from '@app/controllers/brand.controller';
import { getBrandsSchema, getBrandByIdSchema } from '@app/schemas/brand.schema';

const brandController = new BrandController();

export async function brandRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/brands', {
    schema: getBrandsSchema,
    handler: brandController.getBrands.bind(brandController),
  });

  fastify.get('/brands/:brandId', {
    schema: getBrandByIdSchema,
    handler: brandController.getBrandById.bind(brandController),
  });
}

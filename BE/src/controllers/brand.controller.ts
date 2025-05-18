import { FastifyReply, FastifyRequest } from 'fastify';

import { BrandErrorMessages } from '@app/config/brand.message';
import { BrandIdZodSchema } from '@app/schemas/brand.zod';
import { BrandService } from '@app/services/brand.service';

export class BrandController {
  private brandService: BrandService;

  constructor() {
    this.brandService = new BrandService();
  }

  async getBrands(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const brands = await this.brandService.getBrands();
      return reply.ok(brands);
    } catch (error) {
      return reply.internalError(BrandErrorMessages.FETCH_BRANDS_ERROR, 'FETCH_BRANDS_ERROR');
    }
  }

  async getBrandById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { brandId } = req.params as { brandId: string };

    if (!brandId) {
      return reply.badRequest(BrandErrorMessages.INVALID_BRAND_ID, 'INVALID_BRAND_ID');
    }

    const validationResult = BrandIdZodSchema.safeParse({ id: brandId });
    if (!validationResult.success) {
      return reply.badRequest(validationResult.error.message, 'INVALID_BRAND_ID');
    }

    const validBrandId = validationResult.data.id;

    try {
      const brand = await this.brandService.getBrandById(validBrandId);

      if (!brand) {
        return reply.notFound(BrandErrorMessages.BRAND_NOT_FOUND, 'BRAND_NOT_FOUND');
      }

      return reply.ok(brand);
    } catch (error) {
      return reply.internalError(error.message || BrandErrorMessages.FETCH_BRAND_ERROR, 'FETCH_BRAND_ERROR');
    }
  }
}

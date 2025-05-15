import { PrismaClient } from '@prisma/client';

import { BrandErrorMessages } from '@app/config/brand.message';
import { IBrand } from '@app/types/brand.type';

const prisma = new PrismaClient();

export class BrandService {
  async getBrands(): Promise<IBrand[]> {
    try {
      const brands = await prisma.brand.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          logoPath: true,
          description: true,
          isActive: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
      return brands;
    } catch (error) {
      throw new Error(BrandErrorMessages.FETCH_BRANDS_ERROR);
    }
  }

  async getBrandById(id: number): Promise<IBrand | null> {
    try {
      const brand = await prisma.brand.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          logoPath: true,
          description: true,
          isActive: true,
        },
      });

      if (!brand) return null;

      return brand;
    } catch (error) {
      throw new Error(BrandErrorMessages.FETCH_BRAND_ERROR);
    }
  }
}

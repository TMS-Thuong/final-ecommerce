import { PrismaClient } from '@prisma/client';

import { ProductErrorMessages } from '@app/config/product.message';
import { IProduct, IProductBase, IProductImage } from '@app/types/product.type';

const prisma = new PrismaClient();

export class ProductService {
  async getProducts(
    page = 1,
    pageSize = 10,
    brandId?: number,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    stockStatus?: string,
    searchQuery?: string
  ): Promise<IProductBase[]> {
    const filters: {
      isActive: boolean;
      OR?: {
        name?: { contains?: string; mode?: 'insensitive' };
        sku?: { contains?: string; mode?: 'insensitive' };
        description?: { contains?: string; mode?: 'insensitive' };
      }[];
      brandId?: number;
      categoryId?: number;
      basePrice?: { gte?: number; lte?: number };
      stockQuantity?: { gt?: number; equals?: number };
    } = { isActive: true };

    if (searchQuery && searchQuery.trim() !== '') {
      filters.OR = [
        { name: { contains: searchQuery.trim(), mode: 'insensitive' } },
        { sku: { contains: searchQuery.trim(), mode: 'insensitive' } },
      ];
    }

    if (brandId) {
      filters.brandId = brandId;
    }
    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.basePrice = {};
      if (minPrice !== undefined) filters.basePrice.gte = minPrice;
      if (maxPrice !== undefined) filters.basePrice.lte = maxPrice;
    }

    if (stockStatus) {
      if (stockStatus === 'inStock') {
        filters.stockQuantity = { gt: 0 };
      } else if (stockStatus === 'outOfStock') {
        filters.stockQuantity = { equals: 0 };
      }
    }

    try {
      const products = await prisma.product.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: filters,
        select: {
          id: true,
          name: true,
          basePrice: true,
          salePrice: true,
          averageRating: true,
          ratingCount: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
      return products.map((product) => ({
        ...product,
        basePrice: product.basePrice.toNumber(),
        salePrice: product.salePrice ? product.salePrice.toNumber() : 0,
        averageRating: product.averageRating ? product.averageRating.toNumber() : 0,
      }));
    } catch (error) {
      throw new Error(ProductErrorMessages.FETCH_PRODUCTS_ERROR);
    }
  }

  async getProductById(id: number): Promise<IProduct | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        sku: true,
        name: true,
        slug: true,
        description: true,
        categoryId: true,
        brandId: true,
        basePrice: true,
        salePrice: true,
        stockQuantity: true,
        averageRating: true,
        ratingCount: true,
        viewCount: true,
        soldCount: true,
        isActive: true,
        isFeatured: true,
      },
    });

    if (!product) return null;

    return {
      ...product,
      basePrice: product.basePrice.toNumber(),
      salePrice: product.salePrice ? product.salePrice.toNumber() : 0,
      averageRating: product.averageRating ? product.averageRating.toNumber() : 0,
    };
  }

  async getProductImagesByProductId(productId: number): Promise<IProductImage[]> {
    try {
      const productImages = await prisma.productImage.findMany({
        where: { productId },
        select: {
          id: true,
          productId: true,
          imageUrl: true,
          isThumbnail: true,
          displayOrder: true,
        },
      });

      return productImages;
    } catch (error) {
      throw new Error(ProductErrorMessages.FETCH_PRODUCT_IMAGES_ERROR);
    }
  }
}

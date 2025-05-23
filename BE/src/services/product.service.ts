import { PrismaClient } from '@prisma/client';

import { ProductErrorMessages } from '@app/constants/product.message';
import {
  IProductImage,
  IProductWithImages,
  PrismaProductResult,
  PrismaProductWithImages,
} from '@app/types/product.type';

const prisma = new PrismaClient();

export class ProductService {
  private imageCache: { [productId: number]: IProductImage[] } = {};
  private cacheTTL = 5 * 60 * 1000;
  private lastCacheCleanup = Date.now();

  constructor() {
    setInterval(() => this.cleanupCache(), 60 * 1000);
  }

  private cleanupCache(): void {
    const now = Date.now();
    if (now - this.lastCacheCleanup > this.cacheTTL) {
      this.imageCache = {};
      this.lastCacheCleanup = now;
    }
  }

  public invalidateProductCache(productId: number): void {
    if (this.imageCache[productId]) {
      delete this.imageCache[productId];
    }
  }

  public clearImageCache(): void {
    this.imageCache = {};
  }

  async getProducts(
    page = 1,
    pageSize = 10,
    brandId?: number,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    stockStatus?: string,
    searchQuery?: string,
    averageRating?: number
  ): Promise<IProductWithImages[]> {
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
      averageRating?: { gte?: number };
    } = { isActive: true };

    // Tìm kiếm theo từ khóa
    if (searchQuery && searchQuery.trim() !== '') {
      filters.OR = [
        { name: { contains: searchQuery.trim(), mode: 'insensitive' } },
        { sku: { contains: searchQuery.trim(), mode: 'insensitive' } },
      ];
    }

    // Lọc theo thương hiệu
    if (brandId) {
      filters.brandId = brandId;
    }
    // Lọc theo danh mục
    if (categoryId) {
      filters.categoryId = categoryId;
    }

    // Lọc theo khoảng giá
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.basePrice = {};
      if (minPrice !== undefined) filters.basePrice.gte = minPrice;
      if (maxPrice !== undefined) filters.basePrice.lte = maxPrice;
    }

    // Lọc theo tình trạng tồn kho
    if (stockStatus) {
      if (stockStatus === 'inStock') {
        filters.stockQuantity = { gt: 0 };
      } else if (stockStatus === 'outOfStock') {
        filters.stockQuantity = { equals: 0 };
      }
    }

    if (averageRating !== undefined && averageRating !== null) {
      filters.averageRating = { gte: averageRating };
    }

    try {
      const products = await prisma.product.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: filters,
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
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      return await this.addImagesToProducts(products);
    } catch (error) {
      throw new Error(ProductErrorMessages.FETCH_PRODUCTS_ERROR);
    }
  }

  async getProductById(id: number): Promise<IProductWithImages | null> {
    let product = null;

    try {
      product = await prisma.product.findUnique({
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
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new Error(ProductErrorMessages.FETCH_PRODUCT_ERROR);
    }

    if (!product) return null;

    const productsWithImages = await this.addImagesToProducts([product]);
    return productsWithImages[0];
  }

  async getProductImagesByProductId(productId: number): Promise<IProductImage[]> {
    if (this.imageCache[productId]) {
      return this.imageCache[productId];
    }

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
        orderBy: {
          displayOrder: 'asc',
        },
      });
      this.imageCache[productId] = productImages;
      return productImages;
    } catch (error) {
      throw new Error(ProductErrorMessages.FETCH_PRODUCT_IMAGES_ERROR);
    }
  }

  private async addImagesToProducts(products: PrismaProductResult[]): Promise<IProductWithImages[]> {
    if (!products.length) return [];

    const hasImages =
      products[0] && 'images' in products[0] && Array.isArray((products[0] as PrismaProductWithImages).images);

    if (hasImages) {
      return products.map((product) => ({
        ...product,
        basePrice: product.basePrice.toNumber(),
        salePrice: product.salePrice ? product.salePrice.toNumber() : 0,
        averageRating: product.averageRating ? product.averageRating.toNumber() : 0,
        images: ((product as PrismaProductWithImages).images as IProductImage[]) || [],
      }));
    }
    const productIds: number[] = products.map((product) => product.id);
    const uncachedProductIds = productIds.filter((id) => !this.imageCache[id]);

    if (uncachedProductIds.length > 0) {
      const newImages = await prisma.productImage.findMany({
        where: {
          productId: {
            in: uncachedProductIds,
          },
        },
        select: {
          id: true,
          productId: true,
          imageUrl: true,
          isThumbnail: true,
          displayOrder: true,
        },
        orderBy: {
          displayOrder: 'asc',
        },
      });

      // Group images by product ID and update cache
      for (const image of newImages) {
        const productId = image.productId;
        if (!this.imageCache[productId]) {
          this.imageCache[productId] = [];
        }
        this.imageCache[productId].push(image);
      }
    }

    // Create the result using cached images
    return products.map((product) => {
      return {
        ...product,
        basePrice: product.basePrice.toNumber(),
        salePrice: product.salePrice ? product.salePrice.toNumber() : 0,
        averageRating: product.averageRating ? product.averageRating.toNumber() : 0,
        images: this.imageCache[product.id] || [],
      } as IProductWithImages;
    });
  }
}

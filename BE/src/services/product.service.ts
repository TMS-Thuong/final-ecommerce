import { PrismaClient, Prisma } from '@prisma/client';

import { ProductErrorMessages } from '@app/constants/product.message';
import {
  IProductImage,
  IProductWithImages,
  IProductDetails,
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
    averageRating?: number,
    sortBy: 'newest' | 'priceAsc' | 'priceDesc' | 'rating' = 'newest',
    onSale?: boolean
  ): Promise<IProductWithImages[]> {
    try {
      // Nếu sắp xếp theo giá thực tế
      if (sortBy === 'priceAsc' || sortBy === 'priceDesc') {
        const orderDirection = sortBy === 'priceAsc' ? 'ASC' : 'DESC';
        let whereSQL = 'WHERE "IsActive" = true';
        if (brandId) whereSQL += ` AND "BrandID" = ${brandId}`;
        if (categoryId) whereSQL += ` AND "CategoryID" = ${categoryId}`;
        if (minPrice !== undefined) whereSQL += ` AND (COALESCE("SalePrice", "BasePrice") >= ${minPrice})`;
        if (maxPrice !== undefined) whereSQL += ` AND (COALESCE("SalePrice", "BasePrice") <= ${maxPrice})`;
        if (stockStatus === 'inStock') whereSQL += ' AND "StockQuantity" > 0';
        if (stockStatus === 'outOfStock') whereSQL += ' AND "StockQuantity" = 0';
        if (averageRating !== undefined && averageRating !== null) {
          whereSQL += ` AND "AverageRating" >= ${averageRating} AND "RatingCount" > 0`;
        }
        if (onSale) {
          whereSQL += ' AND "SalePrice" IS NOT NULL AND "SalePrice" > 0';
        }
        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.trim().replace(/'/g, "''");
          whereSQL += ` AND ("Name" ILIKE '%${q}%' OR "SKU" ILIKE '%${q}%')`;
        }
        const offset = (page - 1) * pageSize;
        const products: unknown = await prisma.$queryRawUnsafe(
          `SELECT 
            "ProductID" as "id", "SKU" as "sku", "Name" as "name", "Slug" as "slug", 
            "Description" as "description", "CategoryID" as "categoryId", 
            "BrandID" as "brandId", "BasePrice" as "basePrice", "SalePrice" as "salePrice", 
            "StockQuantity" as "stockQuantity", "AverageRating" as "averageRating", 
            "RatingCount" as "ratingCount", "ViewCount" as "viewCount", 
            "SoldCount" as "soldCount", "IsActive" as "isActive", 
            "IsFeatured" as "isFeatured", "CreatedAt" as "createdAt", 
            "UpdatedAt" as "updatedAt",
            COALESCE("SalePrice", "BasePrice") as "displayPrice"
           FROM "Products"
           ${whereSQL}
           ORDER BY "displayPrice" ${orderDirection}
           LIMIT ${pageSize} OFFSET ${offset}`
        );
        return await this.addImagesToProducts(products as PrismaProductResult[]);
      }

      const orderBy: Record<string, 'asc' | 'desc'> = {};
      if (sortBy === 'newest') orderBy.createdAt = 'desc';
      if (sortBy === 'rating') {
        orderBy.averageRating = 'desc';
      }

      const filters: Prisma.ProductWhereInput = { isActive: true };

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
        const salePriceCondition: { not: null; gte?: number; lte?: number } = { not: null };
        if (minPrice !== undefined) salePriceCondition.gte = minPrice;
        if (maxPrice !== undefined) salePriceCondition.lte = maxPrice;

        const basePriceCondition: { gte?: number; lte?: number } = {};
        if (minPrice !== undefined) basePriceCondition.gte = minPrice;
        if (maxPrice !== undefined) basePriceCondition.lte = maxPrice;

        const priceFilter = {
          OR: [
            {
              AND: [{ salePrice: salePriceCondition }],
            },
            {
              AND: [{ salePrice: null, basePrice: basePriceCondition }],
            },
          ],
        };

        if (filters.OR) {
          filters.AND = [{ OR: filters.OR }, priceFilter];
          delete filters.OR;
        } else {
          Object.assign(filters, priceFilter);
        }
      }

      // Lọc theo tình trạng tồn kho
      if (stockStatus) {
        if (stockStatus === 'inStock') {
          filters.stockQuantity = { gt: 0 };
        } else if (stockStatus === 'outOfStock') {
          filters.stockQuantity = { equals: 0 };
        }
      }

      // Lọc theo rating
      if (averageRating !== undefined && averageRating !== null) {
        filters.averageRating = { gte: averageRating };
        filters.ratingCount = { gt: 0 };
      }

      // Lọc theo sản phẩm đang giảm giá
      if (onSale) {
        filters.salePrice = { gt: 0 };
      }

      const products = await prisma.product.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: filters,
        orderBy,
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
      return await this.addImagesToProducts(products as PrismaProductResult[]);
    } catch (error) {
      console.error('Error in getProducts:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }
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
      const pid = product.id;
      const getNumber = (val: unknown): number => {
        if (val && typeof (val as { toNumber?: () => number }).toNumber === 'function')
          return (val as { toNumber: () => number }).toNumber();
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseFloat(val);
        return 0;
      };
      return {
        id: pid,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        brandId: product.brandId,
        basePrice: getNumber(product.basePrice),
        salePrice: getNumber(product.salePrice),
        stockQuantity: product.stockQuantity,
        averageRating: getNumber(product.averageRating),
        ratingCount: product.ratingCount,
        viewCount: product.viewCount,
        soldCount: product.soldCount,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        images: this.imageCache[pid] || [],
      } as IProductWithImages;
    });
  }

  async getProductDetails(productId: number): Promise<IProductDetails> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        productAttributeValues: {
          include: {
            attribute: true,
          },
        },
        images: true,
        category: true,
        brand: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const attributes = product.productAttributeValues.map((pav) => {
      let parsedValue = {};
      try {
        console.log(`DEBUG attribute ID: ${pav.attribute.id}, value: ${pav.attribute.value}`);
        if (typeof pav.attribute.value === 'string' && pav.attribute.value.trim() !== '') {
          parsedValue = JSON.parse(pav.attribute.value);
        } else {
          console.warn(`Invalid or empty attribute value for ID ${pav.attribute.id}: ${pav.attribute.value}`);
        }
      } catch (e) {
        console.error(`JSON parse error for attribute ID ${pav.attribute.id}:`, pav.attribute.value, e);
      }
      return {
        id: pav.attribute.id,
        value: parsedValue,
        isVariantAttribute: pav.attribute.isVariantAttribute,
      };
    });

    const result = {
      ...product,
      basePrice: product.basePrice.toNumber(),
      salePrice: product.salePrice ? product.salePrice.toNumber() : null,
      averageRating: product.averageRating ? product.averageRating.toNumber() : 0,
      attributes,
    };

    console.log('DEBUG final attributes:', JSON.stringify(attributes, null, 2));
    return result;
  }
}

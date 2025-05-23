import { FastifyReply, FastifyRequest } from 'fastify';

import { ProductErrorMessages } from '@app/constants/product.message';
import { ProductService } from '@app/services/product.service';
import { ProductIdZodSchema, ProductQuerySchema } from '@app/validations/product.zod';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getProducts(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const validationResult = ProductQuerySchema.safeParse(req.query);

    if (!validationResult.success) {
      return reply.badRequest(validationResult.error.message, 'INVALID_QUERY_PARAMETERS');
    }

    const { page, pageSize, minPrice, maxPrice, brandId, categoryId, stockStatus, searchQuery, averageRating, sortBy } =
      validationResult.data;

    try {
      const products = await this.productService.getProducts(
        page,
        pageSize,
        brandId,
        categoryId,
        minPrice,
        maxPrice,
        stockStatus,
        searchQuery,
        averageRating,
        sortBy
      );
      return reply.ok(products);
    } catch (error) {
      return reply.internalError(ProductErrorMessages.FETCH_PRODUCTS_ERROR, 'FETCH_PRODUCTS_ERROR');
    }
  }

  async getProductById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: string };

    if (!id) {
      return reply.badRequest(ProductErrorMessages.INVALID_PRODUCT_ID, 'INVALID_PRODUCT_ID');
    }

    const validationResult = ProductIdZodSchema.safeParse({ id });
    if (!validationResult.success) {
      return reply.badRequest(validationResult.error.message, 'INVALID_PRODUCT_ID');
    }

    const validProductId = validationResult.data.id;

    try {
      const product = await this.productService.getProductById(validProductId);

      if (!product) {
        return reply.notFound(ProductErrorMessages.PRODUCT_NOT_FOUND, 'PRODUCT_NOT_FOUND');
      }
      return reply.ok(product);
    } catch (error) {
      return reply.internalError(error.message || ProductErrorMessages.FETCH_PRODUCT_ERROR, 'FETCH_PRODUCT_ERROR');
    }
  }

  async getProductImagesByProductId(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { productId } = req.params as { productId: string };

    if (!productId) {
      return reply.badRequest(ProductErrorMessages.INVALID_PRODUCT_ID, 'INVALID_PRODUCT_ID');
    }

    const validationResult = ProductIdZodSchema.safeParse({ id: productId });

    if (!validationResult.success) {
      return reply.badRequest(validationResult.error.message, 'INVALID_PRODUCT_ID');
    }

    const validProductId = validationResult.data.id;

    try {
      // Lấy danh sách hình ảnh của sản phẩm
      const productImages = await this.productService.getProductImagesByProductId(validProductId);

      if (!productImages || productImages.length === 0) {
        return reply.ok([]);
      }

      const formattedImages = productImages.map((image) => ({
        id: image.id,
        productId: image.productId,
        imageUrl: image.imageUrl,
        isThumbnail: image.isThumbnail,
        displayOrder: image.displayOrder,
      }));
      return reply.ok(formattedImages);
    } catch (error) {
      return reply.internalError(
        error.message || ProductErrorMessages.FETCH_PRODUCT_IMAGES_ERROR,
        'FETCH_PRODUCT_IMAGES_ERROR'
      );
    }
  }
}

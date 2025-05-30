import { FastifyReply, FastifyRequest } from 'fastify';

import { ProductErrorMessages } from '@app/constants/product.message';
import { ProductService } from '@app/services/product.service';

// Add ProductQuery interface for query params
interface ProductQuery {
  page?: number;
  pageSize?: number;
  brandId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: string;
  searchQuery?: string;
  sortBy?: string;
  onSale?: boolean;
  averageRating?: number;
}

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getProducts(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const {
        page,
        pageSize,
        brandId,
        categoryId,
        minPrice,
        maxPrice,
        stockStatus,
        searchQuery,
        sortBy,
        onSale,
        averageRating,
      } = request.query as ProductQuery;
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
        sortBy as 'newest' | 'priceAsc' | 'priceDesc' | 'rating',
        onSale
      );
      return reply.ok(products);
    } catch (error) {
      request.log.error('Error in getProducts controller:', error);
      const errorMessage = error instanceof Error ? error.message : ProductErrorMessages.FETCH_PRODUCTS_ERROR;
      return reply.status(500).send({
        statusCode: 500,
        code: 'FETCH_PRODUCTS_ERROR',
        message: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  async getProductById(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { id } = request.params as { id: number };
      const product = await this.productService.getProductDetails(id);

      if (!product) {
        return reply.notFound(ProductErrorMessages.PRODUCT_NOT_FOUND, 'PRODUCT_NOT_FOUND');
      }

      return reply.ok(product);
    } catch (error) {
      request.log.error(error);
      return reply.internalError(ProductErrorMessages.FETCH_PRODUCT_ERROR, 'FETCH_PRODUCT_ERROR');
    }
  }

  async getProductImages(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { productId } = request.params as { productId: number };
      const images = await this.productService.getProductImagesByProductId(productId);

      if (!images.length) {
        return reply.notFound(ProductErrorMessages.FETCH_PRODUCT_IMAGES_ERROR, 'PRODUCT_IMAGES_NOT_FOUND');
      }

      return reply.ok(images);
    } catch (error) {
      request.log.error(error);
      return reply.internalError(ProductErrorMessages.FETCH_PRODUCT_IMAGES_ERROR, 'FETCH_PRODUCT_IMAGES_ERROR');
    }
  }
}

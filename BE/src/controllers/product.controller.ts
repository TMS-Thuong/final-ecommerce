import { FastifyReply, FastifyRequest } from 'fastify';

import { ProductErrorMessages } from '@app/config/product.message';
import { ProductService } from '@app/services/product.service';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getProducts(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const {
      page = 1,
      pageSize = 10,
      minPrice,
      maxPrice,
      brandId,
      categoryId,
      stockStatus,
      searchQuery,
    } = req.query as {
      page?: number;
      pageSize?: number;
      minPrice?: number;
      maxPrice?: number;
      brandId?: number;
      categoryId?: number;
      stockStatus?: string;
      searchQuery?: string;
    };

    console.log('Query parameters received:', {
      page,
      pageSize,
      minPrice,
      maxPrice,
      brandId,
      categoryId,
      stockStatus,
      searchQuery,
    });

    try {
      const products = await this.productService.getProducts(
        page,
        pageSize,
        brandId,
        categoryId,
        minPrice,
        maxPrice,
        stockStatus,
        searchQuery
      );
      reply.ok(products);
    } catch (error) {
      console.error(error);
      reply.internalError(ProductErrorMessages.FETCH_PRODUCTS_ERROR, 'FETCH_PRODUCTS_ERROR');
    }
  }

  async getProductById(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id: number };

    try {
      const product = await this.productService.getProductById(id);

      if (!product) {
        reply.ok(null);
        return;
      }

      reply.ok(product);
    } catch (error) {
      reply.internalError(error.message || ProductErrorMessages.FETCH_PRODUCT_ERROR, 'FETCH_PRODUCT_ERROR');
    }
  }

  async getProductImagesByProductId(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { productId } = req.params as { productId: string };

    try {
      const productImages = await this.productService.getProductImagesByProductId(parseInt(productId, 10));

      if (!productImages || productImages.length === 0) {
        reply.ok([]);
        return;
      }

      const formattedImages = productImages.map((image) => ({
        id: image.id,
        productId: image.productId,
        imageUrl: image.imageUrl,
        isThumbnail: image.isThumbnail,
        displayOrder: image.displayOrder,
      }));

      reply.ok(formattedImages);
    } catch (error) {
      reply.internalError(
        error.message || ProductErrorMessages.FETCH_PRODUCT_IMAGES_ERROR,
        'FETCH_PRODUCT_IMAGES_ERROR'
      );
    }
  }
}

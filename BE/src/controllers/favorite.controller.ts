import { FastifyReply, FastifyRequest } from 'fastify';

import { FavoriteErrorMessages } from '@app/constants/favorite.message';
import { FavoriteService } from '@app/services/favorite.service';
import { ProductIdZodSchema, FavoriteItemIdZodSchema } from '@app/validations/favorite.zod';
import { binding } from '@decorator/binding';

class FavoriteController {
  private favoriteService: FavoriteService;

  constructor() {
    this.favoriteService = new FavoriteService();
  }

  @binding
  async getUserFavorites(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const favorites = await this.favoriteService.getUserFavorites(userId);

      const transformedFavorites =
        favorites?.items?.map((item) => ({
          ...item.product,
          basePrice: Number(item.product.basePrice),
          salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
          averageRating: Number(item.product.averageRating) || 0,
          createdAt: item.product.createdAt.toISOString(),
          updatedAt: item.product.updatedAt.toISOString(),
          images: item.product.images.map((img) => ({
            id: img.id,
            productId: item.product.id,
            imageUrl: img.imageUrl,
            isThumbnail: img.isThumbnail,
            displayOrder: img.displayOrder,
          })),
        })) || [];

      return reply.ok(transformedFavorites);
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return reply.internalError(FavoriteErrorMessages.GET_WISHLIST_ERROR, 'GET_WISHLIST_ERROR');
    }
  }

  @binding
  async addToFavorites(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const result = ProductIdZodSchema.safeParse(request.body);

      if (!result.success) {
        return reply.badRequest(
          result.error.errors[0]?.message || FavoriteErrorMessages.INVALID_PRODUCT_ID,
          'INVALID_PRODUCT_ID'
        );
      }

      const { productId } = result.data;
      const favoriteItem = await this.favoriteService.addToFavorites(userId, productId);

      if (!favoriteItem) {
        return reply.internalError(FavoriteErrorMessages.ADD_TO_WISHLIST_ERROR, 'ADD_TO_WISHLIST_ERROR');
      }

      const transformedFavoriteItem = {
        id: favoriteItem.id,
        favoriteId: favoriteItem.favoriteId,
        productId: favoriteItem.productId,
        product: favoriteItem.product
          ? {
              ...favoriteItem.product,
              basePrice: Number(favoriteItem.product.basePrice),
              salePrice: favoriteItem.product.salePrice ? Number(favoriteItem.product.salePrice) : null,
              averageRating: Number(favoriteItem.product.averageRating) || 0,
              createdAt: favoriteItem.product.createdAt.toISOString(),
              updatedAt: favoriteItem.product.updatedAt.toISOString(),
              images: favoriteItem.product.images.map((img) => ({
                id: img.id,
                productId: img.productId,
                imageUrl: img.imageUrl,
                isThumbnail: img.isThumbnail,
                displayOrder: img.displayOrder,
              })),
            }
          : null,
      };

      return reply.created(transformedFavoriteItem);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === FavoriteErrorMessages.PRODUCT_NOT_FOUND) {
          return reply.notFound(FavoriteErrorMessages.PRODUCT_NOT_FOUND, 'PRODUCT_NOT_FOUND');
        }
        if (error.message === FavoriteErrorMessages.PRODUCT_ALREADY_IN_FAVORITES) {
          return reply.conflict(FavoriteErrorMessages.PRODUCT_ALREADY_IN_FAVORITES, 'PRODUCT_ALREADY_IN_FAVORITES');
        }
      }
      console.error('Error adding to favorites:', error);
      return reply.internalError(FavoriteErrorMessages.ADD_TO_WISHLIST_ERROR, 'ADD_TO_WISHLIST_ERROR');
    }
  }

  @binding
  async removeFromFavorites(
    request: FastifyRequest<{ Params: { favoriteItemId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const userId = request.user.userId;

      if (isNaN(Number(request.params.favoriteItemId))) {
        return reply.badRequest(FavoriteErrorMessages.INVALID_FAVORITE_ITEM_ID, 'INVALID_FAVORITE_ITEM_ID');
      }

      const id = parseInt(request.params.favoriteItemId);
      const validationResult = FavoriteItemIdZodSchema.safeParse({ id });

      if (!validationResult.success) {
        return reply.badRequest(
          validationResult.error.errors[0]?.message || FavoriteErrorMessages.INVALID_FAVORITE_ITEM_ID,
          'INVALID_FAVORITE_ITEM_ID'
        );
      }

      const { id: parsedId } = validationResult.data;
      await this.favoriteService.removeFromFavorites(userId, parsedId);

      return reply.ok({ message: 'Successfully removed from favorites' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === FavoriteErrorMessages.WISHLIST_NOT_FOUND) {
          return reply.notFound(FavoriteErrorMessages.WISHLIST_NOT_FOUND, 'WISHLIST_NOT_FOUND');
        }
        if (error.message === FavoriteErrorMessages.PRODUCT_NOT_IN_FAVORITES) {
          return reply.notFound(FavoriteErrorMessages.PRODUCT_NOT_IN_FAVORITES, 'PRODUCT_NOT_IN_FAVORITES');
        }
      }
      console.error('Error removing from favorites:', error);
      return reply.internalError(FavoriteErrorMessages.REMOVE_FROM_WISHLIST_ERROR, 'REMOVE_FROM_WISHLIST_ERROR');
    }
  }
}

export default new FavoriteController();

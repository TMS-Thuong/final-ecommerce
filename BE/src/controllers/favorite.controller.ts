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

      const transformedFavorites = {
        ...favorites,
        items:
          favorites?.items?.map((item) => ({
            ...item,
            product: {
              ...item.product,
              images: item.product.images.map((img) => img.imageUrl),
            },
          })) || [],
      };

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

      const transformedFavoriteItem = favoriteItem
        ? {
            ...favoriteItem,
            product: favoriteItem.product
              ? {
                  ...favoriteItem.product,
                  images: favoriteItem.product.images.map((img) => img.imageUrl),
                }
              : null,
          }
        : null;

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

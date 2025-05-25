import { FastifyInstance } from 'fastify';

import favoriteController from '@app/controllers/favorite.controller';
import { verifyUserAuthentication } from '@app/middlewares/auth.middleware';
import { getUserFavoritesSchema, addToFavoritesSchema, removeFromFavoritesSchema } from '@app/schemas/favorite.schema';

export async function favoriteRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', verifyUserAuthentication);

  fastify.get('/wishlist', {
    schema: getUserFavoritesSchema,
    handler: favoriteController.getUserFavorites.bind(favoriteController),
  });

  fastify.post('/wishlist', {
    schema: addToFavoritesSchema,
    handler: favoriteController.addToFavorites.bind(favoriteController),
  });

  fastify.delete('/wishlist/:favoriteItemId', {
    schema: removeFromFavoritesSchema,
    handler: favoriteController.removeFromFavorites.bind(favoriteController),
  });
}

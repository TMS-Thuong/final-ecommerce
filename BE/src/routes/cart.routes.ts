import { FastifyInstance } from 'fastify';

import { CartController } from '@app/controllers/cart.controller';
import { verifyUserAuthentication } from '@app/middlewares/auth.middleware';
import { verifyCartItemOwnership } from '@app/middlewares/cart.middleware';
import {
  addItemToCartSchema,
  deleteCartItemSchema,
  getCartSchema,
  updateCartItemSchema,
} from '@app/schemas/cart.schema';

const cartController = new CartController();

export async function cartRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/cart',
    {
      schema: getCartSchema,
      preHandler: verifyUserAuthentication,
    },
    cartController.getCart.bind(cartController)
  );

  fastify.post(
    '/cart',
    {
      schema: addItemToCartSchema,
      preHandler: verifyUserAuthentication,
    },
    cartController.addItemToCart.bind(cartController)
  );

  fastify.put(
    '/cart/:id',
    {
      schema: updateCartItemSchema,
      preHandler: [verifyUserAuthentication, verifyCartItemOwnership],
    },
    cartController.updateCartItem.bind(cartController)
  );

  fastify.delete(
    '/cart/:id',
    {
      schema: deleteCartItemSchema,
      preHandler: [verifyUserAuthentication, verifyCartItemOwnership],
    },
    cartController.removeCartItem.bind(cartController)
  );
}

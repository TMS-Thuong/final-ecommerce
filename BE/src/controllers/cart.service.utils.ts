import { FastifyReply, FastifyRequest } from 'fastify';

import { CartService } from '@app/services/cart.service';

export const getUserId = (req: FastifyRequest, reply: FastifyReply): number | null => {
  const userId = req.user.id || req.user.userId;
  if (!userId) {
    return null;
  }
  return userId;
};

export const getOrCreateCart = async (userId: number, cartService: CartService) => {
  const cart = await cartService.getCartByUserId(userId);

  if (!cart) {
    return await cartService.createCart(userId);
  }

  return cart;
};

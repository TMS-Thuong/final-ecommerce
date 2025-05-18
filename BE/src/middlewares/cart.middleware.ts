import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CartErrorMessages } from '@app/config/cart.message';

const prisma = new PrismaClient();

export const verifyCartOwnership = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return reply.badRequest(CartErrorMessages.INVALID_CART_ID, 'INVALID_CART_ID');
    }

    if (req.user) {
      const userId = req.user.id || req.user.userId;

      const cart = await prisma.cart.findUnique({
        where: { id },
      });

      if (!cart) {
        return reply.notFound(CartErrorMessages.CART_NOT_FOUND, 'CART_NOT_FOUND');
      }

      if (cart.userId !== null && cart.userId !== userId) {
        return reply.forbidden('You do not have permission to access this cart', 'FORBIDDEN');
      }
    }
  } catch (error) {
    return reply.internalError('Error verifying cart ownership', 'SERVER_ERROR');
  }
};

export const verifyCartItemOwnership = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return reply.badRequest(CartErrorMessages.INVALID_CART_ID, 'INVALID_CART_ITEM_ID');
    }

    const cartItemId = parseInt(id);

    if (isNaN(cartItemId)) {
      return reply.badRequest(CartErrorMessages.INVALID_CART_ID, 'INVALID_CART_ITEM_ID');
    }

    const userId = req.user.id || req.user.userId;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return reply.notFound(CartErrorMessages.CART_NOT_FOUND, 'CART_ITEM_NOT_FOUND');
    }

    if (cartItem.cart.userId !== userId) {
      return reply.forbidden('You do not have permission to access this cart item', 'FORBIDDEN');
    }
  } catch (error) {
    console.error('Error in verifyCartItemOwnership:', error);
    return reply.internalError('Error verifying cart item ownership', 'SERVER_ERROR');
  }
};

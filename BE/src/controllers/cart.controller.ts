import { FastifyReply, FastifyRequest } from 'fastify';

import { CartErrorMessages } from '@app/config/cart.message';
import { AddCartItemZodSchema, CartItemIdZodSchema, UpdateCartItemZodSchema } from '@app/schemas/cart.zod';
import { CartService } from '@app/services/cart.service';

import { getUserId, getOrCreateCart } from '../utils/cart.service.utils';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  async getCart(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return reply.unauthorized('Unauthorized', 'UNAUTHORIZED');
      }

      const cart = await getOrCreateCart(userId, this.cartService);

      return reply.ok(cart);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : CartErrorMessages.FETCH_CART_ERROR;
      return reply.internalError(errorMessage, 'FETCH_CART_ERROR');
    }
  }

  async addItemToCart(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = req.body as unknown;

    try {
      const userId = getUserId(req);
      if (!userId) {
        return reply.unauthorized('Unauthorized', 'UNAUTHORIZED');
      }

      const cart = await getOrCreateCart(userId, this.cartService);

      const bodyValidationResult = AddCartItemZodSchema.safeParse(body);
      if (!bodyValidationResult.success) {
        return reply.badRequest(bodyValidationResult.error.message, 'INVALID_REQUEST_BODY');
      }

      const { productId, quantity } = bodyValidationResult.data;

      try {
        const cartItem = await this.cartService.addItemToCart(cart.id, productId, quantity);
        const updatedCart = await this.cartService.getCartByUserId(userId);

        return reply.ok({
          addedItem: cartItem,
          cart: updatedCart,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message === CartErrorMessages.PRODUCT_NOT_FOUND ||
            error.message === CartErrorMessages.INSUFFICIENT_STOCK)
        ) {
          return reply.badRequest(error.message, 'PRODUCT_ERROR');
        }
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : CartErrorMessages.ADD_ITEM_ERROR;
      return reply.internalError(errorMessage, 'ADD_ITEM_ERROR');
    }
  }

  async updateCartItem(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id?: string };
    const body = req.body as unknown;

    if (!id) {
      return reply.badRequest(CartErrorMessages.INVALID_CART_ID, 'INVALID_CART_ITEM_ID');
    }

    const idValidationResult = CartItemIdZodSchema.safeParse({ id: parseInt(id) });
    if (!idValidationResult.success) {
      return reply.badRequest(idValidationResult.error.message, 'INVALID_CART_ITEM_ID');
    }

    const cartItemId = idValidationResult.data.id;

    const bodyValidationResult = UpdateCartItemZodSchema.safeParse(body);
    if (!bodyValidationResult.success) {
      return reply.badRequest(bodyValidationResult.error.message, 'INVALID_REQUEST_BODY');
    }

    const { quantity } = bodyValidationResult.data;

    try {
      const userId = getUserId(req);
      if (!userId) {
        return reply.unauthorized('Unauthorized', 'UNAUTHORIZED');
      }

      const updatedCartItem = await this.cartService.updateCartItem(cartItemId, quantity);
      const updatedCart = await this.cartService.getCartByUserId(userId);

      return reply.ok({
        updatedItem: updatedCartItem,
        cart: updatedCart,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : CartErrorMessages.UPDATE_ITEM_ERROR;
      return reply.internalError(errorMessage, 'UPDATE_ITEM_ERROR');
    }
  }

  async removeCartItem(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = req.params as { id?: string };

    if (!id) {
      return reply.badRequest(CartErrorMessages.INVALID_CART_ID, 'INVALID_CART_ITEM_ID');
    }

    const idValidationResult = CartItemIdZodSchema.safeParse({ id: parseInt(id) });
    if (!idValidationResult.success) {
      return reply.badRequest(idValidationResult.error.message, 'INVALID_CART_ITEM_ID');
    }

    const cartItemId = idValidationResult.data.id;

    try {
      const userId = getUserId(req);
      if (!userId) {
        return reply.unauthorized('Unauthorized', 'UNAUTHORIZED');
      }

      await this.cartService.removeCartItem(cartItemId);
      const updatedCart = await this.cartService.getCartByUserId(userId);

      return reply.ok({
        success: true,
        message: 'Item removed from cart',
        cart: updatedCart,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : CartErrorMessages.REMOVE_ITEM_ERROR;
      return reply.internalError(errorMessage, 'REMOVE_ITEM_ERROR');
    }
  }
}

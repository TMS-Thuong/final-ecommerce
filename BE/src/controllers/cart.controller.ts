import { FastifyReply, FastifyRequest } from 'fastify';

import { CartErrorMessages } from '@app/config/cart.message';
import { AddCartItemZodSchema, CartItemIdZodSchema, UpdateCartItemZodSchema } from '@app/schemas/cart.zod';
import { CartService } from '@app/services/cart.service';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  async getCart(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = req.user.id || req.user.userId;

      if (!userId) {
        return reply.badRequest('Invalid user ID in token', 'INVALID_USER_ID');
      }

      let cart = await this.cartService.getCartByUserId(userId);

      if (!cart) {
        cart = await this.cartService.getCartByUserId(userId);
      }

      if (!cart) {
        return reply.ok({
          id: null,
          userId: userId,
          items: [],
          totalAmount: 0,
          totalItems: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return reply.ok(cart);
    } catch (error) {
      return reply.internalError(error.message || CartErrorMessages.FETCH_CART_ERROR, 'FETCH_CART_ERROR');
    }
  }

  async addItemToCart(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = req.body as unknown;

    try {
      const userId = req.user.id || req.user.userId;

      if (!userId) {
        return reply.badRequest('Invalid user ID in token', 'INVALID_USER_ID');
      }

      let cart = await this.cartService.getCartByUserId(userId);

      if (!cart) {
        cart = await this.cartService.getCartByUserId(userId);
      }

      if (!cart) {
        return reply.internalError(CartErrorMessages.CART_NOT_FOUND, 'CART_NOT_FOUND');
      }

      const bodyValidationResult = AddCartItemZodSchema.safeParse(body);
      if (!bodyValidationResult.success) {
        return reply.badRequest(bodyValidationResult.error.message, 'INVALID_REQUEST_BODY');
      }

      const { productId, quantity } = bodyValidationResult.data;

      const cartItem = await this.cartService.addItemToCart(cart.id, productId, quantity);

      const updatedCart = await this.cartService.getCartByUserId(userId);

      return reply.ok({
        addedItem: cartItem,
        cart: updatedCart,
      });
    } catch (error) {
      return reply.internalError(error.message || CartErrorMessages.ADD_ITEM_ERROR, 'ADD_ITEM_ERROR');
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

    const validCartItemId = idValidationResult.data.id;

    const bodyValidationResult = UpdateCartItemZodSchema.safeParse(body);
    if (!bodyValidationResult.success) {
      return reply.badRequest(bodyValidationResult.error.message, 'INVALID_REQUEST_BODY');
    }

    const { quantity } = bodyValidationResult.data;

    try {
      const updatedCartItem = await this.cartService.updateCartItem(validCartItemId, quantity);
      const userId = req.user.id || req.user.userId;
      const updatedCart = await this.cartService.getCartByUserId(userId);

      return reply.ok({
        updatedItem: updatedCartItem,
        cart: updatedCart,
      });
    } catch (error) {
      return reply.internalError(error.message || CartErrorMessages.UPDATE_ITEM_ERROR, 'UPDATE_ITEM_ERROR');
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

    const validCartItemId = idValidationResult.data.id;

    try {
      await this.cartService.removeCartItem(validCartItemId);

      const userId = req.user.id || req.user.userId;
      const updatedCart = await this.cartService.getCartByUserId(userId);

      return reply.ok({
        success: true,
        message: 'Item removed from cart',
        cart: updatedCart,
      });
    } catch (error) {
      return reply.internalError(error.message || CartErrorMessages.REMOVE_ITEM_ERROR, 'REMOVE_ITEM_ERROR');
    }
  }
}

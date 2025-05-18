import { PrismaClient, Prisma } from '@prisma/client';

import { CartErrorMessages } from '@app/config/cart.message';
import { ICart, ICartItem } from '@app/types/cart.type';

const prisma = new PrismaClient();

interface ProductImage {
  imageUrl: string | null;
}

interface ProductWithImages {
  id: number;
  name: string;
  basePrice: Prisma.Decimal;
  salePrice: Prisma.Decimal | null;
  stockQuantity: number;
  images: ProductImage[];
}

interface CartItemWithProduct {
  id: number;
  cartId: string;
  productId: number;
  quantity: number;
  addedAt: Date;
  options: Prisma.JsonValue;
  product: ProductWithImages;
}

/**
 * Safely convert Prisma JsonValue to Record<string, unknown>
 */
function jsonValueToRecord(value: Prisma.JsonValue): Record<string, unknown> {
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value as Record<string, unknown>).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val }),
      {} as Record<string, unknown>
    );
  }
  return {};
}

export class CartService {
  async getCartById(cartId: string): Promise<ICart | null> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isThumbnail: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });

      if (!cart) return null;

      const cartItems = cart.items.map((item) => {
        return this.mapCartItemToICartItem(item);
      });

      const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

      return {
        id: cart.id,
        userId: cart.userId,
        items: cartItems,
        totalAmount,
        totalItems: cartItems.length,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw new Error(CartErrorMessages.FETCH_CART_ERROR);
    }
  }

  async createCart(
    userId: number | null = null
  ): Promise<{ id: string; userId: number | null; createdAt: Date; updatedAt: Date }> {
    try {
      if (userId) {
        const existingCart = await prisma.cart.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });

        if (existingCart) {
          return existingCart;
        }
      }

      const cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
      return cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw new Error(CartErrorMessages.CREATE_CART_ERROR);
    }
  }

  async addItemToCart(cartId: string, productId: number, quantity: number): Promise<ICartItem> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error(CartErrorMessages.PRODUCT_NOT_FOUND);
      }

      if (product.stockQuantity < quantity) {
        throw new Error(CartErrorMessages.INSUFFICIENT_STOCK);
      }

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (existingItem) {
        const updatedQuantity = existingItem.quantity + quantity;

        if (product.stockQuantity < updatedQuantity) {
          throw new Error(CartErrorMessages.INSUFFICIENT_STOCK);
        }

        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: updatedQuantity,
          },
        });

        return {
          id: updatedItem.id,
          cartId: updatedItem.cartId,
          productId: updatedItem.productId,
          quantity: updatedItem.quantity,
          addedAt: updatedItem.addedAt,
          options: jsonValueToRecord(updatedItem.options),
        };
      } else {
        const cartItem = await prisma.cartItem.create({
          data: {
            cartId,
            productId,
            quantity,
            options: {},
          },
        });

        return {
          id: cartItem.id,
          cartId: cartItem.cartId,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          addedAt: cartItem.addedAt,
          options: jsonValueToRecord(cartItem.options),
        };
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      const errorMessage = error instanceof Error ? error.message : CartErrorMessages.ADD_ITEM_ERROR;
      throw new Error(errorMessage);
    }
  }

  async updateCartItem(cartItemId: number, quantity: number): Promise<ICartItem> {
    try {
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { product: true },
      });

      if (!cartItem) {
        throw new Error(CartErrorMessages.CART_ITEM_NOT_FOUND);
      }

      if (cartItem.product.stockQuantity < quantity) {
        throw new Error(CartErrorMessages.INSUFFICIENT_STOCK);
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });

      return {
        id: updatedItem.id,
        cartId: updatedItem.cartId,
        productId: updatedItem.productId,
        quantity: updatedItem.quantity,
        addedAt: updatedItem.addedAt,
        options: jsonValueToRecord(updatedItem.options),
      };
    } catch (error) {
      console.error('Error updating cart item:', error);
      const errorMessage = error instanceof Error ? error.message : CartErrorMessages.UPDATE_ITEM_ERROR;
      throw new Error(errorMessage);
    }
  }

  async removeCartItem(cartItemId: number): Promise<boolean> {
    try {
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });

      if (!cartItem) {
        throw new Error(CartErrorMessages.CART_ITEM_NOT_FOUND);
      }

      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      return true;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw new Error(CartErrorMessages.REMOVE_ITEM_ERROR);
    }
  }

  async getCartByUserId(userId: number): Promise<ICart | null> {
    try {
      const cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isThumbnail: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!cart) return null;

      const cartItems = cart.items.map((item) => {
        return this.mapCartItemToICartItem(item);
      });

      const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

      const result = {
        id: cart.id,
        userId: cart.userId,
        items: cartItems,
        totalAmount,
        totalItems: cartItems.length,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      };

      return result;
    } catch (error) {
      console.error('Error fetching cart by userId:', error);
      throw new Error(CartErrorMessages.FETCH_CART_ERROR);
    }
  }

  private mapCartItemToICartItem(item: CartItemWithProduct): ICartItem {
    const price =
      item.product.salePrice && parseFloat(item.product.salePrice.toString()) > 0
        ? item.product.salePrice
        : item.product.basePrice;
    const subtotal = parseFloat(price.toString()) * item.quantity;

    return {
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      addedAt: item.addedAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        basePrice: parseFloat(item.product.basePrice.toString()),
        salePrice: item.product.salePrice ? parseFloat(item.product.salePrice.toString()) : null,
        stockQuantity: item.product.stockQuantity,
        image: item.product.images[0]?.imageUrl || null,
      },
      price: parseFloat(price.toString()),
      subtotal: subtotal,
      options: jsonValueToRecord(item.options),
    };
  }
}

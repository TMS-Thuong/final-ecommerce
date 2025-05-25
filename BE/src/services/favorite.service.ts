import { PrismaClient } from '@prisma/client';

import { Favorite, FavoriteItem, Product } from '@app/types/favorite.types';

const prisma = new PrismaClient();

export class FavoriteService {
  async getUserFavorites(userId: number): Promise<Favorite> {
    try {
      // Lấy danh sách yêu thích của người dùng
      const favorite = await prisma.favorite.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  basePrice: true,
                  salePrice: true,
                  stockQuantity: true,
                  images: {
                    select: {
                      imageUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!favorite) {
        return {
          id: 0,
          userId,
          createdAt: new Date(),
          items: [],
        };
      }

      return favorite;
    } catch (error) {
      console.error('Error in getUserFavorites:', error);
      throw new Error('Failed to get wishlist');
    }
  }

  private async getProductDetails(productId: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        basePrice: true,
        salePrice: true,
        stockQuantity: true,
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
    });
  }

  async addToFavorites(userId: number, productId: number): Promise<FavoriteItem> {
    try {
      // Kiểm tra sản phẩm có tồn tại không
      const product = await this.getProductDetails(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      // Tạo mới hoặc lấy danh sách yêu thích cho user
      const favorite = await prisma.favorite.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      //KT sản phẩm đã có trong danh sách yêu thích chưa
      const existingItem = await prisma.favoriteItem.findFirst({
        where: {
          favoriteId: favorite.id,
          productId,
        },
      });

      if (existingItem) {
        throw new Error('Product is already in wishlist');
      }

      // Thêm sản phẩm vào danh sách yêu thích
      const favoriteItem = await prisma.favoriteItem.create({
        data: {
          favoriteId: favorite.id,
          productId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              basePrice: true,
              salePrice: true,
              stockQuantity: true,
              images: {
                select: {
                  imageUrl: true,
                },
              },
            },
          },
        },
      });

      return favoriteItem;
    } catch (error) {
      console.error('Error in addToFavorites:', error);
      throw error;
    }
  }

  async removeFromFavorites(userId: number, id: number): Promise<{ message: string }> {
    try {
      // Lấy danh sách yêu thích của người dùng
      const favorite = await prisma.favorite.findUnique({
        where: { userId },
      });

      if (!favorite) {
        throw new Error('Wishlist not found');
      }

      // Tìm kiếm theo ID của mục yêu thích
      const favoriteItem = await prisma.favoriteItem.findFirst({
        where: {
          id: id,
          favoriteId: favorite.id,
        },
      });

      if (!favoriteItem) {
        throw new Error('Product not found in wishlist');
      }

      // Xóa sản phẩm khỏi danh sách yêu thích
      await prisma.favoriteItem.delete({
        where: { id: favoriteItem.id },
      });

      return { message: 'Product removed from wishlist successfully' };
    } catch (error) {
      console.error('Error in removeFromFavorites:', error);
      throw error;
    }
  }
}

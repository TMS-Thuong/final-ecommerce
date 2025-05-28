import { PrismaClient, OrderStatus } from '@prisma/client';

import { ReviewErrorMessages } from '@app/constants/review.message';
import { IReviewCreateInput, IReviewResponse, IReviewUpdateInput, IReviewWithUser } from '@app/types/review.type';

const prisma = new PrismaClient();

export class ReviewService {
  async createReview(userId: number, reviewData: IReviewCreateInput): Promise<IReviewWithUser> {
    // kiểm tra xem đặt hàng có tồn tại và được hoàn thành
    const order = await prisma.order.findFirst({
      where: {
        id: reviewData.orderId,
        userId: userId,
        status: OrderStatus.Completed,
      },
    });

    if (!order) {
      throw new Error(ReviewErrorMessages.ORDER_NOT_COMPLETED);
    }

    // Kiểm tra xem sản phẩm có được mua trong đơn hàng này không
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        orderId: reviewData.orderId,
        productId: reviewData.productId,
      },
    });

    if (!orderItem) {
      throw new Error(ReviewErrorMessages.PRODUCT_NOT_PURCHASED);
    }

    // kiểm tra xem đã đánh giá sản phẩm này trong đơn hàng chưa
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: reviewData.productId,
        userId: userId,
        orderId: reviewData.orderId,
      },
    });

    if (existingReview) {
      throw new Error(ReviewErrorMessages.REVIEW_ALREADY_EXISTS);
    }

    const review = await prisma.review.create({
      data: {
        productId: reviewData.productId,
        userId: userId,
        orderId: reviewData.orderId,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // update rating products
    await this.updateProductRating(reviewData.productId);

    return review;
  }

  async updateReview(userId: number, reviewId: number, reviewData: IReviewUpdateInput): Promise<IReviewWithUser> {
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: userId,
      },
    });

    if (!review) {
      throw new Error(ReviewErrorMessages.REVIEW_NOT_FOUND);
    }

    if (review.updatedAt > review.createdAt) {
      throw new Error(ReviewErrorMessages.REVIEW_ALREADY_EDITED);
    }

    const sevenDaysFromCreation = new Date(review.createdAt);
    sevenDaysFromCreation.setDate(sevenDaysFromCreation.getDate() + 7);

    if (new Date() > sevenDaysFromCreation) {
      throw new Error(ReviewErrorMessages.REVIEW_EDIT_EXPIRED);
    }

    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        title: reviewData.title,
        comment: reviewData.comment,
        updatedAt: new Date(), // Set updatedAt to current time
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return updatedReview;
  }

  async getProductReviews(
    productId: number,
    page = 1,
    pageSize = 10,
    rating?: number,
    hasImages?: boolean,
    sortBy: 'newest' | 'oldest' = 'newest'
  ): Promise<IReviewResponse> {
    const where = {
      productId,
      ...(rating && { rating }),
      ...(hasImages && {
        images: {
          some: {},
        },
      }),
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: sortBy === 'newest' ? 'desc' : 'asc',
        },
        include: {
          images: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    const averageRating = await this.calculateAverageRating(productId);

    return {
      reviews,
      total,
      averageRating,
    };
  }

  private async calculateAverageRating(productId: number): Promise<number> {
    const result = await prisma.review.aggregate({
      where: {
        productId,
      },
      _avg: {
        rating: true,
      },
    });

    return result._avg.rating || 0;
  }

  private async updateProductRating(productId: number): Promise<void> {
    const averageRating = await this.calculateAverageRating(productId);
    const ratingCount = await prisma.review.count({
      where: {
        productId,
      },
    });

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        averageRating,
        ratingCount,
      },
    });
  }

  async getUserReviews(userId: number): Promise<IReviewWithUser[]> {
    return await prisma.review.findMany({
      where: { userId },
      include: {
        product: true,
        images: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        order: {
          select: {
            id: true,
            createdAt: true,
            orderCode: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

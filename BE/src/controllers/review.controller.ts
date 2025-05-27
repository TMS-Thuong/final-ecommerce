import { FastifyReply, FastifyRequest } from 'fastify';

import { ReviewErrorMessages } from '@app/constants/review.message';
import { ReviewService } from '@app/services/review.service';
import { IReviewCreateInput } from '@app/types/review.type';
import { CreateReviewZodSchema, UpdateReviewZodSchema, ProductReviewsQuerySchema } from '@app/validations/review.zod';
import { binding } from '@decorator/binding';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  @binding
  async createReview(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const validationResult = CreateReviewZodSchema.safeParse(request.body);

      if (!validationResult.success) {
        return reply.badRequest(
          validationResult.error.errors[0]?.message || ReviewErrorMessages.INVALID_REVIEW_DATA,
          'INVALID_REVIEW_DATA'
        );
      }

      const reviewData: IReviewCreateInput = {
        productId: validationResult.data.productId,
        orderId: validationResult.data.orderId,
        rating: validationResult.data.rating,
        comment: validationResult.data.comment,
        title: validationResult.data.title,
      };

      const review = await this.reviewService.createReview(userId, reviewData);
      return reply.created(review);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ReviewErrorMessages.ORDER_NOT_COMPLETED) {
          return reply.badRequest(error.message, 'ORDER_NOT_COMPLETED');
        }
        if (error.message === ReviewErrorMessages.PRODUCT_NOT_PURCHASED) {
          return reply.badRequest(error.message, 'PRODUCT_NOT_PURCHASED');
        }
        if (error.message === ReviewErrorMessages.REVIEW_ALREADY_EXISTS) {
          return reply.conflict(error.message, 'REVIEW_ALREADY_EXISTS');
        }
      }
      console.error('Error creating review:', error);
      return reply.internalError(ReviewErrorMessages.CREATE_REVIEW_ERROR, 'CREATE_REVIEW_ERROR');
    }
  }

  @binding
  async updateReview(request: FastifyRequest<{ Params: { reviewId: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const reviewId = parseInt(request.params.reviewId);

      if (isNaN(reviewId)) {
        return reply.badRequest(ReviewErrorMessages.INVALID_REVIEW_ID, 'INVALID_REVIEW_ID');
      }

      const validationResult = UpdateReviewZodSchema.safeParse(request.body);
      if (!validationResult.success) {
        return reply.badRequest(
          validationResult.error.errors[0]?.message || ReviewErrorMessages.INVALID_REVIEW_DATA,
          'INVALID_REVIEW_DATA'
        );
      }

      const review = await this.reviewService.updateReview(userId, reviewId, validationResult.data);
      return reply.ok(review);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ReviewErrorMessages.REVIEW_NOT_FOUND) {
          return reply.notFound(error.message, 'REVIEW_NOT_FOUND');
        }
        if (error.message === ReviewErrorMessages.REVIEW_EDIT_EXPIRED) {
          return reply.badRequest(error.message, 'REVIEW_EDIT_EXPIRED');
        }
        if (error.message === ReviewErrorMessages.REVIEW_ALREADY_EDITED) {
          return reply.badRequest(error.message, 'REVIEW_ALREADY_EDITED');
        }
      }
      console.error('Error updating review:', error);
      return reply.internalError(ReviewErrorMessages.UPDATE_REVIEW_ERROR, 'UPDATE_REVIEW_ERROR');
    }
  }

  @binding
  async getProductReviews(
    request: FastifyRequest<{ Params: { productId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const productId = parseInt(request.params.productId);

      if (isNaN(productId)) {
        return reply.badRequest(ReviewErrorMessages.INVALID_REVIEW_ID, 'INVALID_REVIEW_ID');
      }

      const validationResult = ProductReviewsQuerySchema.safeParse(request.query);
      if (!validationResult.success) {
        return reply.badRequest(
          validationResult.error.errors[0]?.message || ReviewErrorMessages.INVALID_REVIEW_DATA,
          'INVALID_REVIEW_DATA'
        );
      }

      const { page, pageSize, rating, hasImages, sortBy } = validationResult.data;
      const reviews = await this.reviewService.getProductReviews(productId, page, pageSize, rating, hasImages, sortBy);

      return reply.ok(reviews);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return reply.internalError(ReviewErrorMessages.FETCH_REVIEWS_ERROR, 'FETCH_REVIEWS_ERROR');
    }
  }

  @binding
  async getMyReviews(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.userId;
      const reviews = await this.reviewService.getUserReviews(userId);
      return reply.ok(reviews);
    } catch (error) {
      return reply.internalError('Failed to fetch user reviews', 'FETCH_USER_REVIEWS_ERROR');
    }
  }
}

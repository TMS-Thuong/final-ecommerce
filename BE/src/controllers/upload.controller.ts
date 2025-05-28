import { FastifyReply, FastifyRequest } from 'fastify';

import { ReviewErrorMessages } from '@app/constants/review.message';
import { UploadService } from '@app/services/upload.service';
import { binding } from '@decorator/binding';

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  @binding
  async uploadReviewImage(
    request: FastifyRequest<{ Params: { reviewId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const reviewId = parseInt(request.params.reviewId);
      if (isNaN(reviewId)) {
        return reply.badRequest(ReviewErrorMessages.INVALID_REVIEW_ID, 'INVALID_REVIEW_ID');
      }

      const reviewImage = await this.uploadService.uploadReviewImage(request, reviewId);
      return reply.ok(reviewImage);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ReviewErrorMessages.REVIEW_NOT_FOUND) {
          return reply.notFound(error.message, 'REVIEW_NOT_FOUND');
        }
        if (error.message === ReviewErrorMessages.INVALID_IMAGE_FORMAT) {
          return reply.badRequest(error.message, 'INVALID_IMAGE_FORMAT');
        }
        if (error.message === ReviewErrorMessages.IMAGE_SIZE_TOO_LARGE) {
          return reply.badRequest(error.message, 'IMAGE_SIZE_TOO_LARGE');
        }
        if (error.message === ReviewErrorMessages.TOO_MANY_IMAGES) {
          return reply.badRequest(error.message, 'TOO_MANY_IMAGES');
        }
      }
      console.error('Error uploading image:', error);
      return reply.internalError(ReviewErrorMessages.UPLOAD_IMAGE_ERROR, 'UPLOAD_IMAGE_ERROR');
    }
  }

  @binding
  async deleteReviewImage(
    request: FastifyRequest<{ Params: { reviewId: string; imageId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const reviewId = parseInt(request.params.reviewId);
      const imageId = parseInt(request.params.imageId);

      if (isNaN(reviewId) || isNaN(imageId)) {
        return reply.badRequest(ReviewErrorMessages.INVALID_REVIEW_ID, 'INVALID_REVIEW_ID');
      }

      await this.uploadService.deleteReviewImage(reviewId, imageId);
      return reply.ok({ message: 'Review image deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ReviewErrorMessages.REVIEW_NOT_FOUND) {
          return reply.notFound(error.message, 'REVIEW_NOT_FOUND');
        }
      }
      console.error('Error deleting review image:', error);
      return reply.internalError(ReviewErrorMessages.UPLOAD_IMAGE_ERROR, 'UPLOAD_IMAGE_ERROR');
    }
  }
}

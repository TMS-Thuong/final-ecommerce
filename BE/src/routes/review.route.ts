import { FastifyInstance } from 'fastify';

import { ReviewController } from '@app/controllers/review.controller';
import { UploadController } from '@app/controllers/upload.controller';
import { verifyUserAuthentication } from '@app/middlewares/auth.middleware';
import {
  createReviewSchema,
  updateReviewSchema,
  getProductReviewsSchema,
  uploadReviewImageSchema,
  deleteReviewImageSchema,
  getMyReviewsSchema,
} from '@app/schemas/review.schema';

export async function reviewRoutes(fastify: FastifyInstance): Promise<void> {
  const reviewController = new ReviewController();
  const uploadController = new UploadController();

  // Review routes
  fastify.post('/reviews', {
    schema: createReviewSchema,
    preHandler: verifyUserAuthentication,
    handler: reviewController.createReview.bind(reviewController),
  });

  fastify.put('/reviews/:reviewId', {
    schema: updateReviewSchema,
    preHandler: verifyUserAuthentication,
    handler: reviewController.updateReview.bind(reviewController),
  });

  fastify.get('/products/:productId/reviews', {
    schema: getProductReviewsSchema,
    handler: reviewController.getProductReviews.bind(reviewController),
  });

  fastify.post('/reviews/:reviewId/upload', {
    schema: uploadReviewImageSchema,
    preHandler: verifyUserAuthentication,
    attachValidation: true,
    handler: uploadController.uploadReviewImage.bind(uploadController),
  });

  fastify.delete('/reviews/:reviewId/images/:imageId', {
    schema: deleteReviewImageSchema,
    preHandler: verifyUserAuthentication,
    handler: uploadController.deleteReviewImage.bind(uploadController),
  });

  fastify.get('/reviews/me', {
    schema: getMyReviewsSchema,
    preHandler: verifyUserAuthentication,
    handler: reviewController.getMyReviews.bind(reviewController),
  });
}

import fs from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';

import { PrismaClient, ReviewImage } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

import { BASE_URL } from '@app/config';
import { ReviewErrorMessages } from '@app/constants/review.message';

export class UploadService {
  private readonly UPLOAD_DIR = join(process.cwd(), 'uploads', 'reviews');
  private readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  private readonly MAX_IMAGES_PER_REVIEW = 5;
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
  }

  private isValidImageFormat(mimeType: string): boolean {
    return this.ALLOWED_MIME_TYPES.includes(mimeType);
  }

  async uploadReviewImage(request: FastifyRequest, reviewId: number): Promise<ReviewImage> {
    const data = await request.file();
    if (!data) {
      throw new Error(ReviewErrorMessages.INVALID_IMAGE_FORMAT);
    }

    const mimeType = data.mimetype;
    if (!this.isValidImageFormat(mimeType)) {
      throw new Error(ReviewErrorMessages.INVALID_IMAGE_FORMAT);
    }

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { images: true },
    });

    if (!review) {
      throw new Error(ReviewErrorMessages.REVIEW_NOT_FOUND);
    }

    if (review.images.length >= this.MAX_IMAGES_PER_REVIEW) {
      throw new Error(ReviewErrorMessages.TOO_MANY_IMAGES);
    }

    const fileExt = data.filename.split('.').pop();
    const filename = `review-${uuidv4()}.${fileExt}`;
    const filepath = join(this.UPLOAD_DIR, filename);

    await pipeline(data.file, fs.createWriteStream(filepath));

    const imageUrl = `${BASE_URL}/images/uploads/reviews/${filename}`;

    return this.prisma.reviewImage.create({
      data: {
        reviewId,
        imageUrl,
      },
    });
  }

  async deleteReviewImage(reviewId: number, imageId: number): Promise<void> {
    try {
      const review = await this.prisma.review.findUnique({
        where: { id: reviewId },
        include: {
          images: {
            where: {
              id: imageId,
            },
          },
        },
      });

      if (!review) {
        throw new Error(ReviewErrorMessages.REVIEW_NOT_FOUND);
      }

      if (review.images.length === 0) {
        throw new Error(ReviewErrorMessages.REVIEW_NOT_FOUND);
      }

      const image = review.images[0];
      const filename = image.imageUrl.split('/').pop();
      if (filename) {
        const filepath = join(this.UPLOAD_DIR, filename);
        await fs.promises.rm(filepath, { force: true });
      }

      await this.prisma.reviewImage.delete({
        where: {
          id: imageId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ReviewErrorMessages.UPLOAD_IMAGE_ERROR);
    }
  }
}

import { Review, ReviewImage } from '@prisma/client';

export interface IReviewBase {
  id: number;
  productId: number;
  userId: number;
  orderId: number;
  rating: number;
  title?: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewWithImages extends IReviewBase {
  images: ReviewImage[];
}

export interface IReviewWithUser extends IReviewBase {
  user: {
    id: number;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  images?: ReviewImage[];
}

export interface IReviewWithProduct extends IReviewWithUser {
  product: {
    id: number;
    name: string;
    images: {
      id: number;
      imageUrl: string;
      isThumbnail: boolean;
    }[];
  };
}

export interface IReviewResponse {
  reviews: IReviewWithUser[];
  total: number;
  averageRating: number;
}

export interface IReviewCreateInput {
  productId: number;
  orderId: number;
  rating: number;
  title?: string;
  comment: string;
}

export interface IReviewUpdateInput {
  title?: string;
  comment?: string;
}

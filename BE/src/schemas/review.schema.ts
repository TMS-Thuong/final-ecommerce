import { FastifySchema } from 'fastify';

import { errorResponseSchema } from './error.schema';

export const createReviewSchema: FastifySchema = {
  summary: 'Create a new review',
  tags: ['Review'],
  body: {
    type: 'object',
    properties: {
      productId: { type: 'number' },
      orderId: { type: 'number' },
      rating: { type: 'number', minimum: 1, maximum: 5 },
      title: { type: 'string', maxLength: 100 },
      comment: { type: 'string', minLength: 1, maxLength: 500 },
    },
    required: ['productId', 'orderId', 'rating', 'comment'],
  },
  response: {
    201: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            productId: { type: 'number' },
            userId: { type: 'number' },
            orderId: { type: 'number' },
            rating: { type: 'number' },
            title: { type: 'string' },
            comment: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                avatarUrl: { type: 'string' },
              },
            },
          },
        },
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const updateReviewSchema: FastifySchema = {
  summary: 'Update a review',
  tags: ['Review'],
  params: {
    type: 'object',
    properties: {
      reviewId: { type: 'string' },
    },
    required: ['reviewId'],
  },
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', maxLength: 100 },
      comment: { type: 'string', minLength: 1, maxLength: 500 },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            productId: { type: 'number' },
            userId: { type: 'number' },
            orderId: { type: 'number' },
            rating: { type: 'number' },
            title: { type: 'string' },
            comment: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                avatarUrl: { type: 'string' },
              },
            },
          },
        },
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const getProductReviewsSchema: FastifySchema = {
  summary: 'Get product reviews',
  tags: ['Review'],
  params: {
    type: 'object',
    properties: {
      productId: { type: 'string' },
    },
    required: ['productId'],
  },
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1, default: 1 },
      pageSize: { type: 'number', minimum: 1, maximum: 50, default: 10 },
      rating: { type: 'number', minimum: 1, maximum: 5 },
      hasImages: { type: 'boolean' },
      sortBy: { type: 'string', enum: ['newest', 'oldest'], default: 'newest' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            reviews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  productId: { type: 'number' },
                  userId: { type: 'number' },
                  orderId: { type: 'number' },
                  rating: { type: 'number' },
                  title: { type: 'string' },
                  comment: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  images: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        reviewId: { type: 'number' },
                        imageUrl: { type: 'string' },
                      },
                    },
                  },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      firstName: { type: 'string' },
                      lastName: { type: 'string' },
                      avatarUrl: { type: 'string' },
                    },
                  },
                },
              },
            },
            total: { type: 'number' },
            averageRating: { type: 'number' },
          },
        },
      },
    },
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const uploadReviewImageSchema: FastifySchema = {
  summary: 'Upload review image',
  tags: ['Review'],
  consumes: ['multipart/form-data'],
  params: {
    type: 'object',
    properties: {
      reviewId: { type: 'string' },
    },
    required: ['reviewId'],
  },
  body: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
    required: ['file'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            reviewId: { type: 'number' },
            imageUrl: { type: 'string' },
          },
        },
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const deleteReviewImageSchema: FastifySchema = {
  summary: 'Delete review image',
  tags: ['Review'],
  params: {
    type: 'object',
    properties: {
      reviewId: { type: 'string' },
      imageId: { type: 'string' },
    },
    required: ['reviewId', 'imageId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

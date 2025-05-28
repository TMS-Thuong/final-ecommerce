import { FastifySchema } from 'fastify';

import { errorResponseSchema } from './error.schema';

const productSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    sku: { type: 'string' },
    name: { type: 'string' },
    slug: { type: 'string' },
    categoryId: { type: 'integer' },
    brandId: { type: 'integer' },
    basePrice: { type: 'number' },
    salePrice: { type: ['number', 'null'] },
    stockQuantity: { type: 'integer' },
    averageRating: { type: 'number' },
    ratingCount: { type: 'integer' },
    viewCount: { type: 'integer' },
    soldCount: { type: 'integer' },
    isActive: { type: 'boolean' },
    isFeatured: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    images: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          productId: { type: 'integer' },
          imageUrl: { type: 'string' },
          isThumbnail: { type: 'boolean' },
          displayOrder: { type: 'integer' },
        },
      },
    },
  },
  required: ['id', 'name', 'basePrice', 'stockQuantity'],
};

const wishlistItemWithProductSchema = {
  type: 'object',
  properties: {
    favoriteItemId: { type: 'integer' },
    productId: { type: 'integer' },
    product: productSchema,
  },
  required: ['favoriteItemId', 'productId', 'product'],
};

const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'array',
      items: wishlistItemWithProductSchema,
    },
  },
  required: ['success', 'data'],
};

export const getUserFavoritesSchema: FastifySchema = {
  description: 'Get user favorites',
  tags: ['favorites'],
  summary: 'Get user favorites',
  response: {
    200: successResponseSchema,
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const addToFavoritesSchema: FastifySchema = {
  description: 'Add product to favorites',
  tags: ['favorites'],
  summary: 'Add product to favorites',
  body: {
    type: 'object',
    required: ['productId'],
    properties: {
      productId: { type: 'integer' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            favoriteId: { type: 'integer' },
            productId: { type: 'integer' },
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                sku: { type: 'string' },
                name: { type: 'string' },
                slug: { type: 'string' },
                description: { type: ['string', 'null'] },
                categoryId: { type: 'integer' },
                brandId: { type: 'integer' },
                basePrice: { type: 'number' },
                salePrice: { type: ['number', 'null'] },
                stockQuantity: { type: 'integer' },
                averageRating: { type: 'number' },
                ratingCount: { type: 'integer' },
                viewCount: { type: 'integer' },
                soldCount: { type: 'integer' },
                isActive: { type: 'boolean' },
                isFeatured: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                images: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      productId: { type: 'integer' },
                      imageUrl: { type: 'string' },
                      isThumbnail: { type: 'boolean' },
                      displayOrder: { type: 'integer' },
                    },
                    required: ['id', 'productId', 'imageUrl', 'isThumbnail', 'displayOrder'],
                  },
                },
              },
              required: ['id', 'name', 'basePrice', 'stockQuantity'],
            },
          },
          required: ['id', 'favoriteId', 'productId', 'product'],
        },
      },
      required: ['success', 'data'],
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const removeFromFavoritesSchema: FastifySchema = {
  description: 'Remove product from favorites',
  tags: ['favorites'],
  summary: 'Remove product from favorites',
  params: {
    type: 'object',
    required: ['favoriteItemId'],
    properties: {
      favoriteItemId: { type: 'integer' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
          required: ['message'],
        },
      },
      required: ['success', 'data'],
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

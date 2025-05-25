import { FastifySchema } from 'fastify';

import { errorResponseSchema } from './error.schema';

const productSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    basePrice: { type: 'number' },
    salePrice: { type: 'number', nullable: true },
    stockQuantity: { type: 'integer' },
    images: {
      type: 'array',
      nullable: true,
      items: { type: 'string' },
    },
  },
  required: ['id', 'name', 'basePrice', 'stockQuantity'],
};

const favoriteItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    productId: { type: 'integer' },
    product: productSchema,
  },
  required: ['id', 'productId', 'product'],
};

const favoriteListSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    userId: { type: 'integer' },
    createdAt: { type: 'string', format: 'date-time' },
    items: {
      type: 'array',
      items: favoriteItemSchema,
    },
  },
  required: ['id', 'userId', 'createdAt', 'items'],
};

const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: favoriteListSchema,
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
        data: favoriteItemSchema,
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

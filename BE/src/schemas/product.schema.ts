import { FastifySchema } from 'fastify';

const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'boolean' },
    code: { type: 'string' },
    message: { type: 'string' },
  },
};

const productResponseSchema = {
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
  },
};

const productImageSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    productId: { type: 'integer' },
    imageUrl: { type: 'string' },
    isThumbnail: { type: 'boolean' },
    displayOrder: { type: 'integer' },
  },
};

const productWithImagesResponseSchema = {
  type: 'object',
  properties: {
    ...productResponseSchema.properties,
    images: {
      type: 'array',
      items: productImageSchema,
    },
  },
};

export const getProductsSchema: FastifySchema = {
  summary: 'Get list of active products',
  tags: ['Product'],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', default: 1 },
      pageSize: { type: 'integer', default: 10 },
      brandId: { type: 'integer' },
      categoryId: { type: 'integer' },
      minPrice: { type: 'number', minimum: 0 },
      maxPrice: { type: 'number', minimum: 0 },
      stockStatus: { type: 'string', enum: ['inStock', 'outOfStock'] },
      searchQuery: { type: 'string' },
    },
    required: [],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: productWithImagesResponseSchema,
        },
      },
    },
    500: errorResponseSchema,
  },
};

export const getProductByIdSchema: FastifySchema = {
  summary: 'Get a product by its ID',
  tags: ['Product'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: ['object', 'null'],
          properties: productWithImagesResponseSchema.properties,
        },
      },
    },
    500: errorResponseSchema,
  },
};

export const getProductImagesByProductIdSchema: FastifySchema = {
  summary: 'Get all images for a product by its ID',
  tags: ['Product'],
  params: {
    type: 'object',
    properties: {
      productId: { type: 'integer' },
    },
    required: ['productId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
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
    },
    500: errorResponseSchema,
  },
};

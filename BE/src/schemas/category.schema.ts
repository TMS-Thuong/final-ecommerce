import { FastifySchema } from 'fastify';

const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'boolean' },
    code: { type: 'string' },
    message: { type: 'string' },
  },
};

const categoryResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    parentCategoryId: { type: ['integer', 'null'] },
    displayOrder: { type: 'integer' },
    isActive: { type: 'boolean' },
  },
};

const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'array',
      items: categoryResponseSchema,
    },
  },
};

const successResponseSchemaWithCategory = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: ['object', 'null'],
      properties: categoryResponseSchema.properties,
    },
  },
};

export const getCategoriesSchema: FastifySchema = {
  summary: 'Get list of active categories',
  tags: ['Category'],
  response: {
    200: successResponseSchema,
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const getCategoryByIdSchema: FastifySchema = {
  summary: 'Get a category by its ID',
  tags: ['Category'],
  params: {
    type: 'object',
    properties: {
      categoryId: { type: 'integer' },
    },
    required: ['categoryId'],
  },
  response: {
    200: successResponseSchemaWithCategory,
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

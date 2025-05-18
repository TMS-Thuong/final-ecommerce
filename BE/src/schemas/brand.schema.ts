import { FastifySchema } from 'fastify';

const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'boolean' },
    code: { type: 'string' },
    message: { type: 'string' },
  },
};

const brandResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    logoPath: { type: ['string', 'null'] },
    description: { type: ['string', 'null'] },
    isActive: { type: 'boolean' },
  },
};

const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'array',
      items: brandResponseSchema,
    },
  },
};

const successResponseSchemaWithBrand = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: ['object', 'null'],
      properties: brandResponseSchema.properties,
    },
  },
};

export const getBrandsSchema: FastifySchema = {
  summary: 'Get list of active brands',
  tags: ['Brand'],
  response: {
    200: successResponseSchema,
    500: errorResponseSchema,
  },
};

export const getBrandByIdSchema: FastifySchema = {
  summary: 'Get a brand by its ID',
  tags: ['Brand'],
  params: {
    type: 'object',
    properties: {
      brandId: { type: 'integer' },
    },
    required: ['brandId'],
  },
  response: {
    200: successResponseSchemaWithBrand,
    500: errorResponseSchema,
  },
};

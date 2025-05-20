import { FastifySchema } from 'fastify';

import { errorResponseSchema } from './error.schema';

const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {},
  },
};

const shippingMethodSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    description: { type: 'string', nullable: true },
  },
};

export const getShippingMethodsSchema: FastifySchema = {
  summary: 'Get all shipping methods',
  tags: ['Shipping'],
  response: {
    200: {
      ...successResponseSchema,
      properties: {
        ...successResponseSchema.properties,
        data: {
          type: 'array',
          items: shippingMethodSchema,
        },
      },
    },
  },
};

export const calculateShippingFeeSchema: FastifySchema = {
  summary: 'Calculate shipping fee',
  tags: ['Shipping'],
  body: {
    type: 'object',
    required: ['shippingMethodId', 'totalAmount'],
    properties: {
      shippingMethodId: { type: 'integer' },
      totalAmount: { type: 'number' },
    },
  },
  response: {
    200: {
      ...successResponseSchema,
      properties: {
        ...successResponseSchema.properties,
        data: {
          type: 'object',
          properties: {
            fee: { type: 'number' },
          },
        },
      },
    },
    400: errorResponseSchema,
    404: errorResponseSchema,
  },
};

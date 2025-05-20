import { FastifySchema } from 'fastify';

import { errorResponseSchema } from './error.schema';

const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {},
  },
};

const addressItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    recipientName: { type: 'string' },
    phoneNumber: { type: 'string' },
    province: { type: 'string' },
    district: { type: 'string', nullable: true },
    ward: { type: 'string', nullable: true },
    streetAddress: { type: 'string' },
    isDefaultShipping: { type: 'boolean' },
    isDefaultBilling: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const getUserAddressesSchema: FastifySchema = {
  summary: 'Get user addresses',
  tags: ['Address'],
  response: {
    200: {
      ...successResponseSchema,
      properties: {
        ...successResponseSchema.properties,
        data: {
          type: 'array',
          items: addressItemSchema,
        },
      },
    },
    401: errorResponseSchema,
  },
};

export const createAddressSchema: FastifySchema = {
  summary: 'Create new address',
  tags: ['Address'],
  body: {
    type: 'object',
    required: ['recipientName', 'phoneNumber', 'province', 'streetAddress'],
    properties: {
      recipientName: { type: 'string' },
      phoneNumber: { type: 'string' },
      province: { type: 'string' },
      district: { type: 'string' },
      ward: { type: 'string' },
      streetAddress: { type: 'string' },
      isDefaultShipping: { type: 'boolean', default: false },
      isDefaultBilling: { type: 'boolean', default: false },
    },
  },
  response: {
    201: {
      ...successResponseSchema,
      properties: {
        ...successResponseSchema.properties,
        data: addressItemSchema,
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};

export const updateAddressSchema: FastifySchema = {
  summary: 'Update address',
  tags: ['Address'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer' },
    },
  },
  body: {
    type: 'object',
    properties: {
      recipientName: { type: 'string' },
      phoneNumber: { type: 'string' },
      province: { type: 'string' },
      district: { type: 'string' },
      ward: { type: 'string' },
      streetAddress: { type: 'string' },
      isDefaultShipping: { type: 'boolean' },
      isDefaultBilling: { type: 'boolean' },
    },
  },
  response: {
    200: {
      ...successResponseSchema,
      properties: {
        ...successResponseSchema.properties,
        data: addressItemSchema,
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
  },
};

export const deleteAddressSchema: FastifySchema = {
  summary: 'Delete address',
  tags: ['Address'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
    401: errorResponseSchema,
    404: errorResponseSchema,
  },
};

export const getAddressByIdSchema: FastifySchema = {
  summary: 'Get address by ID',
  tags: ['Address'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer' },
    },
  },
  response: {
    200: {
      ...successResponseSchema,
      properties: {
        ...successResponseSchema.properties,
        data: addressItemSchema,
      },
    },
    401: errorResponseSchema,
    404: errorResponseSchema,
  },
};

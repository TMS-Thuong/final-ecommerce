import { FastifySchema } from 'fastify';

import { errorResponseSchema } from './error.schema';

const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {},
  },
};

const orderItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    productId: { type: 'integer' },
    productName: { type: 'string' },
    quantity: { type: 'integer' },
    price: { type: 'number' },
    subtotal: { type: 'number' },
    discountAmount: { type: 'number' },
    status: {
      type: 'string',
      enum: ['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled', 'Failed', 'Completed'],
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const orderResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    orderCode: { type: 'string' },
    subtotal: { type: 'number' },
    shippingFee: { type: 'number' },
    discountAmount: { type: 'number' },
    totalAmount: { type: 'number' },
    addressId: { type: 'integer' },
    paymentId: { type: 'integer' },
    shippingId: { type: 'integer' },
    status: {
      type: 'string',
      enum: ['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled', 'Failed', 'Completed'],
    },
    paymentStatus: {
      type: 'string',
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    },
    customerNotes: { type: 'string', nullable: true },
    trackingId: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const addressSchema = {
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

const orderDetailResponseSchema = {
  ...orderResponseSchema,
  properties: {
    ...orderResponseSchema.properties,
    items: {
      type: 'array',
      items: orderItemSchema,
    },
    address: addressSchema,
  },
};

export const createOrderSchema: FastifySchema = {
  summary: 'Create new order',
  tags: ['Order'],
  body: {
    type: 'object',
    required: ['addressId', 'shippingMethodId', 'paymentMethodId'],
    properties: {
      addressId: { type: 'integer' },
      shippingMethodId: { type: 'integer' },
      paymentMethodId: { type: 'integer' },
      customerNotes: { type: 'string', nullable: true },
      couponCode: { type: 'string', nullable: true },
    },
  },
  response: {
    201: {
      ...successResponseSchema,
      properties: {
        ...successResponseSchema.properties,
        data: orderResponseSchema,
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
};

export const getUserOrdersSchema: FastifySchema = {
  summary: 'Get user orders',
  tags: ['Order'],
  response: {
    200: {
      ...successResponseSchema,
      properties: {
        ...successResponseSchema.properties,
        data: {
          type: 'array',
          items: orderResponseSchema,
        },
      },
    },
    401: errorResponseSchema,
  },
};

export const getOrderDetailsSchema: FastifySchema = {
  summary: 'Get order details',
  tags: ['Order'],
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
        data: orderDetailResponseSchema,
      },
    },
    401: errorResponseSchema,
    404: errorResponseSchema,
  },
};

export const getOrderByCodeSchema: FastifySchema = {
  summary: 'Get order details by order code',
  tags: ['Order'],
  params: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'string' },
    },
  },
  response: {
    200: {
      ...successResponseSchema,
      properties: {
        ...successResponseSchema.properties,
        data: orderDetailResponseSchema,
      },
    },
    401: errorResponseSchema,
    404: errorResponseSchema,
  },
};

export const cancelOrderSchema: FastifySchema = {
  summary: 'Cancel an order',
  tags: ['Order'],
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
        data: orderDetailResponseSchema,
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
  },
};

export const getPurchasedProductsSchema: FastifySchema = {
  summary: 'Get purchased products for review',
  tags: ['Order'],
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              orderCode: { type: 'string' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    product: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        sku: { type: 'string' },
                        slug: { type: 'string' },
                        basePrice: { type: 'number' },
                        salePrice: { type: 'number' },
                        images: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              imageUrl: { type: 'string' },
                            },
                          },
                        },
                      },
                    },
                    quantity: { type: 'integer' },
                    price: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

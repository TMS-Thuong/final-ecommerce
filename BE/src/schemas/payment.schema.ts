import { FastifySchema } from 'fastify';

import { errorResponseSchema } from './error.schema';

const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {},
  },
};

const paymentMethodItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    code: { type: 'string' },
    description: { type: 'string', nullable: true },
  },
};

const vnpayQueryParams = {
  type: 'object',
  properties: {
    vnp_Amount: { type: 'string' },
    vnp_BankCode: { type: 'string' },
    vnp_BankTranNo: { type: 'string' },
    vnp_CardType: { type: 'string' },
    vnp_OrderInfo: { type: 'string' },
    vnp_PayDate: { type: 'string' },
    vnp_ResponseCode: { type: 'string' },
    vnp_TmnCode: { type: 'string' },
    vnp_TransactionNo: { type: 'string' },
    vnp_TransactionStatus: { type: 'string' },
    vnp_TxnRef: { type: 'string' },
    vnp_SecureHash: { type: 'string' },
  },
};

export const VNPayReturnSchema: FastifySchema = {
  summary: 'Handle VNPay payment return',
  tags: ['Payment'],
  querystring: vnpayQueryParams,
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            orderCode: { type: 'string' },
          },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            orderCode: { type: 'string' },
          },
        },
      },
    },
    500: errorResponseSchema,
  },
};

export const VNPayIpnSchema: FastifySchema = {
  summary: 'Handle VNPay IPN notification',
  tags: ['Payment'],
  querystring: vnpayQueryParams,
  response: {
    200: {
      type: 'object',
      properties: {
        RspCode: { type: 'string' },
        Message: { type: 'string' },
      },
    },
  },
};

export const createPaymentUrlSchema: FastifySchema = {
  summary: 'Create VNPay payment URL',
  tags: ['Payment'],
  params: {
    type: 'object',
    properties: {
      orderId: { type: 'string' },
    },
    required: ['orderId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        paymentUrl: { type: 'string' },
      },
    },
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const paymentStatusSchema: FastifySchema = {
  summary: 'Get payment status for an order',
  tags: ['Payment'],
  params: {
    type: 'object',
    properties: {
      orderId: { type: 'string' },
    },
    required: ['orderId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            orderId: { type: 'integer' },
            orderCode: { type: 'string' },
            status: { type: 'string' },
            paymentStatus: { type: 'string' },
          },
        },
      },
    },
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const paymentMethodSchema: FastifySchema = {
  summary: 'Get available payment methods',
  tags: ['Payment'],
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: paymentMethodItemSchema,
        },
      },
    },
    500: errorResponseSchema,
  },
};

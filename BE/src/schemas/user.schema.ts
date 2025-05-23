import { FastifySchema } from 'fastify';

import { errorResponseSchema } from './error.schema';

const userProfileSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    avatarUrl: { type: 'string', nullable: true },
    gender: { type: 'integer' },
    birthDate: { type: 'string', format: 'date-time' },
    phoneNumber: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const getProfileSchema: FastifySchema = {
  summary: 'Get user profile',
  tags: ['User'],
  response: {
    200: {
      type: 'object',
      properties: {
        data: userProfileSchema,
      },
    },
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const updateUserSchema: FastifySchema = {
  summary: 'Update user profile',
  tags: ['User'],
  body: {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      birthDate: { type: 'string', format: 'date' },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'other'],
      },
      phoneNumber: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: userProfileSchema,
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const updatePasswordSchema: FastifySchema = {
  summary: 'Update user password',
  tags: ['User'],
  body: {
    type: 'object',
    properties: {
      currentPassword: { type: 'string' },
      newPassword: { type: 'string' },
    },
    required: ['currentPassword', 'newPassword'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          message: { type: 'string' },
        },
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const updateAvatarSchema: FastifySchema = {
  summary: 'Update user avatar',
  tags: ['User'],
  consumes: ['multipart/form-data'],
  body: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: userProfileSchema,
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};

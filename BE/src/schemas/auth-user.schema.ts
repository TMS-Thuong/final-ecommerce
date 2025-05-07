import { FastifySchema } from 'fastify';

const errorResponseSchema = {
  type: 'object',
  properties: {
    code: { type: 'string' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
};

export const registerUserSchema: FastifySchema = {
  summary: 'Đăng ký người dùng',
  tags: ['Auth'],
  body: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      birthDate: { type: 'string', format: 'date' },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'other'],
      },
    },
    required: ['email', 'password'],
  },
  response: {
    201: {
      type: 'object',
      properties: {
        data: {
          message: { type: 'string' },
        },
      },
    },
    400: errorResponseSchema,
    409: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const resendVerifyEmailSchema: FastifySchema = {
  summary: 'Gửi lại email xác nhận',
  tags: ['Auth'],
  querystring: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    400: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const verifyEmailSchema: FastifySchema = {
  summary: 'Xác minh email',
  tags: ['Auth'],
  querystring: {
    type: 'object',
    properties: {
      token: { type: 'string' },
    },
    required: ['token'],
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
        },
      },
    },
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const loginGoogleSchema: FastifySchema = {
  summary: 'Đăng nhập bằng Google',
  tags: ['Auth'],
  body: {
    type: 'object',
    properties: {
      idToken: { type: 'string' },
    },
    required: ['idToken'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          message: { type: 'string' },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
    },
    201: {
      type: 'object',
      properties: {
        data: {
          message: { type: 'string' },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
    },
    400: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const loginSchema: FastifySchema = {
  summary: 'Đăng nhập',
  tags: ['Auth'],
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
    required: ['email', 'password'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            user: { type: 'object' },
          },
        },
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const refreshTokenSchema: FastifySchema = {
  summary: 'Làm mới token',
  tags: ['Auth'],
  body: {
    type: 'object',
    properties: {
      refreshToken: { type: 'string' },
    },
    required: ['refreshToken'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
          },
        },
      },
    },
    400: errorResponseSchema,
    401: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const forgotPasswordSchema: FastifySchema = {
  summary: 'Quên mật khẩu',
  tags: ['Auth'],
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
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
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

export const resetPasswordSchema: FastifySchema = {
  summary: 'Đặt lại mật khẩu',
  tags: ['Auth'],
  body: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      newPassword: { type: 'string', minLength: 8, maxLength: 16 },
      confirmPassword: { type: 'string', minLength: 8, maxLength: 16 },
    },
    required: ['token', 'newPassword'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
};

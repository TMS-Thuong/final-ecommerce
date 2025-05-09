import { FastifyInstance } from 'fastify';

import AuthController from '@app/controllers/authen.controller';
import {
  forgotPasswordSchema,
  loginGoogleSchema,
  loginSchema,
  refreshTokenSchema,
  registerUserSchema,
  resendVerifyEmailSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '@app/schemas/auth-user.schema';

export async function authUserRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/auth/register', {
    schema: registerUserSchema,
    handler: AuthController.registerUserByEmail,
  });

  fastify.get('/auth/verify-email', {
    schema: verifyEmailSchema,
    handler: AuthController.verifyEmail,
  });

  fastify.get('/auth/resend-verify-email', {
    schema: resendVerifyEmailSchema,
    handler: AuthController.resendVerificationEmail,
  });

  fastify.post('/auth/google-signin', {
    schema: loginGoogleSchema,
    handler: AuthController.loginViaGoogle,
  });

  fastify.post('/auth/login', {
    schema: loginSchema,
    handler: AuthController.loginUserWithEmail,
  });

  fastify.post('/auth/refresh-token', {
    schema: refreshTokenSchema,
    handler: AuthController.refreshToken,
  });

  fastify.post('/auth/forgot-password', {
    schema: forgotPasswordSchema,
    handler: AuthController.forgotPassword,
  });

  fastify.post('/auth/reset-password', {
    schema: resetPasswordSchema,
    handler: AuthController.resetPassword,
  });
}

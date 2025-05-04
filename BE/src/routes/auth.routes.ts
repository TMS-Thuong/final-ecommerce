import {
  googleSignInSchema,
  loginSchema,
  refreshTokenSchema,
  registerUserSchema,
  verifyEmailSchema,
} from '@schemas/auth.schema';
import { FastifyInstance } from 'fastify';

import AuthController from '@app/controllers/authen.controller';

export async function authUserRoutes(fastify: FastifyInstance) {
  fastify.post('/user/auth/register', {
    schema: registerUserSchema,
    handler: AuthController.registerUserByEmail,
  });

  fastify.get('/user/auth/verify-email', {
    schema: verifyEmailSchema,
    handler: AuthController.verifyEmailController,
  });

  fastify.post('/user/auth/google-signin', {
    schema: googleSignInSchema,
    handler: AuthController.googleSignInController,
  });

  fastify.post('/user/auth/login', {
    schema: loginSchema,
    handler: AuthController.loginUserWithEmail,
  });

  fastify.post('/auth/refresh-token', {
    schema: refreshTokenSchema,
    handler: AuthController.refreshToken,
  });
}

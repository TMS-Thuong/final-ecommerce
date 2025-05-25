import { FastifyInstance } from 'fastify';

import UserController from '@app/controllers/user.controller';
import { verifyUserAuthentication } from '@app/middlewares/auth.middleware';
import { getProfileSchema, updateUserSchema, updatePasswordSchema, updateAvatarSchema } from '@app/schemas/user.schema';

export default async function userRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/users/me', {
    schema: getProfileSchema,
    preHandler: verifyUserAuthentication,
    handler: UserController.profile,
  });

  fastify.put('/users/me', {
    schema: updateUserSchema,
    preHandler: verifyUserAuthentication,
    handler: UserController.editProfile,
  });

  fastify.put('/users/me/change-password', {
    schema: updatePasswordSchema,
    preHandler: verifyUserAuthentication,
    handler: UserController.editPassword,
  });

  fastify.put('/users/me/avatar', {
    schema: updateAvatarSchema,
    preHandler: verifyUserAuthentication,
    attachValidation: true,
    handler: UserController.updateAvatar,
  });
}
